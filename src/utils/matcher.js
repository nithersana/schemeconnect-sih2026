import { SCHEMES } from '../data/schemes';

export function evaluateSchemeClient(profile, scheme) {
  const matched_reasons = [];
  const unmatched_reasons = [];
  let score_points = 0;
  const total_points = 6;

  // 1. Caste / Community (Critical for SC MoSJE Schemes)
  const caste = profile.caste || "SC";
  const allowed_castes = scheme.castes || ["All"];
  if (allowed_castes.includes("All") || allowed_castes.includes(caste)) {
    matched_reasons.push(`Target Community Category '${caste}' is fully eligible under MoSJE guidelines`);
    score_points += 1;
  } else {
    unmatched_reasons.push(`Scheme designated specifically for ${allowed_castes.join(', ')} community members`);
  }

  // 2. Income Level (Cap <= ₹5.00 Lakhs for concessional schemes)
  const income = Number(profile.annual_income) || 180000;
  const max_income = scheme.max_annual_income || 500000;
  if (income <= max_income) {
    matched_reasons.push(`Annual income ₹${income.toLocaleString()} qualifies under the ₹${max_income.toLocaleString()} concessional ceiling`);
    score_points += 1;
  } else {
    unmatched_reasons.push(`Annual income ₹${income.toLocaleString()} exceeds the ₹${max_income.toLocaleString()} concessional ceiling`);
  }

  // 3. Project Cost & Loan Limit Compatibility
  const estCost = Number(profile.estimated_cost) || 140000;
  const schemeMaxCost = scheme.max_project_cost || 5000000;
  if (estCost <= schemeMaxCost) {
    matched_reasons.push(`Estimated project cost ₹${estCost.toLocaleString()} fits within scheme upper limit of ₹${schemeMaxCost.toLocaleString()}`);
    score_points += 1;
  } else {
    unmatched_reasons.push(`Estimated project cost ₹${estCost.toLocaleString()} exceeds scheme limit of ₹${schemeMaxCost.toLocaleString()}`);
  }

  // 4. Age
  const age = Number(profile.age) || 28;
  const min_age = scheme.min_age || 18;
  const max_age = scheme.max_age || 65;
  if (age >= min_age && age <= max_age) {
    matched_reasons.push(`Age ${age} is within required range (${min_age}–${max_age} yrs)`);
    score_points += 1;
  } else {
    unmatched_reasons.push(`Applicant age must be between ${min_age} and ${max_age} yrs (Current: ${age})`);
  }

  // 5. Gender
  const gender = profile.gender || "All";
  const allowed_genders = scheme.genders || ["All"];
  if (allowed_genders.includes("All") || allowed_genders.includes(gender)) {
    matched_reasons.push(`Gender criteria met (${gender})`);
    score_points += 1;
  } else {
    unmatched_reasons.push(`Scheme designated specifically for ${allowed_genders.join(', ')} applicants`);
  }

  // 6. Project Type / Trade / Education
  const projType = profile.project_type || "Micro Business / Street Vending";
  const occ = profile.occupation || "Micro-Entrepreneur";
  matched_reasons.push(`Identified priority loan track for '${projType}'`);
  score_points += 1;

  // State Match
  const state = profile.state || "Tamil Nadu";
  const allowed_states = scheme.states || ["All"];
  const state_match = (allowed_states.includes("All") || allowed_states.includes(state));
  if (!state_match) {
    unmatched_reasons.push(`Scheme is restricted to residents of ${allowed_states.join(', ')}`);
  }

  const is_fully_eligible = (unmatched_reasons.length === 0) && state_match;
  let readiness_score = Math.round((score_points / total_points) * 100);
  if (!state_match) {
    readiness_score = Math.max(0, readiness_score - 40);
  }

  const owned_docs = profile.documents || ["Aadhaar Card", "Bank Account Passbook"];
  const req_docs = scheme.documents_required || [];
  const doc_match_count = req_docs.filter(d => 
    owned_docs.some(od => od.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(od.toLowerCase()))
  ).length;
  const doc_readiness = Math.round((doc_match_count / Math.max(1, req_docs.length)) * 100);

  // Missing documents
  const missing_documents = req_docs.filter(d => 
    !owned_docs.some(od => od.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(od.toLowerCase()))
  );

  return {
    scheme_id: scheme.id,
    scheme_name: scheme.name,
    scheme_name_ta: scheme.name_ta || scheme.name,
    scheme_name_hi: scheme.name_hi || scheme.name,
    ministry: scheme.ministry,
    category: scheme.category,
    scheme_type: scheme.scheme_type || "Concessional Loan",
    description: scheme.description,
    benefit_amount: scheme.benefit_amount,
    max_loan_limit: scheme.max_loan_limit || 500000,
    concessional_interest_rate: scheme.concessional_interest_rate || 6.5,
    moratorium_period_months: scheme.moratorium_period_months || 3,
    subsidy: scheme.subsidy,
    highlight_badge: scheme.highlight_badge || "Govt Welfare",
    portal_url: scheme.portal_url || "https://nsfdc.nic.in",
    channel_partners: scheme.channel_partners || ["State Channelizing Agencies", "Lead Public Sector Banks"],
    application_type: scheme.application_type || "Single Window / SCA",
    repayment_period: scheme.repayment_period || "N/A",
    documents_required: scheme.documents_required || [],
    missing_documents,
    is_eligible: is_fully_eligible,
    readiness_score,
    doc_readiness_score: doc_readiness,
    matched_reasons,
    unmatched_reasons
  };
}

export function matchSchemesClient(profile, schemesList = SCHEMES) {
  const evaluations = schemesList.map(s => evaluateSchemeClient(profile, s));
  
  // Sort: Eligible first, then highest readiness score
  evaluations.sort((a, b) => {
    if (a.is_eligible !== b.is_eligible) {
      return a.is_eligible ? -1 : 1;
    }
    return b.readiness_score - a.readiness_score;
  });

  const eligible_count = evaluations.filter(e => e.is_eligible).length;

  return {
    applicant_name: profile.name || "Beneficiary",
    total_evaluated: evaluations.length,
    eligible_count,
    timestamp: new Date().toISOString(),
    results: evaluations
  };
}
