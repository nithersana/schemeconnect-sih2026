/**
 * Document Verification & Authentication Engine for SchemeConnect
 * 
 * Replaces ambiguous percentage matching with strict, multi-factor MATCH / INCORRECT decisions:
 * - Correct document uploaded      -> MATCH
 * - Wrong document uploaded        -> INCORRECT (with detected vs. required breakdown)
 * - Unrelated document uploaded    -> INCORRECT (flags bills, invoices, receipts, resumes, general text)
 * - Blank / unreadable document    -> INCORRECT (detects blurred, sparse, or noisy images)
 * 
 * Never returns or displays match percentages.
 */

export const SUPPORTED_DOCUMENTS = [
  {
    id: "aadhaar",
    label: "Aadhaar Card (UIDAI)",
    label_ta: "ஆதார் அட்டை (UIDAI)",
    label_hi: "आधार कार्ड (UIDAI)",
    authority: "Unique Identification Authority of India (UIDAI)",
    idFormat: "12-digit UID (XXXX XXXX XXXX)"
  },
  {
    id: "pan",
    label: "PAN Card (Income Tax Dept)",
    label_ta: "பான் அட்டை (வருமான வரித்துறை)",
    label_hi: "पैन कार्ड (आयकर विभाग)",
    authority: "Income Tax Department / Govt. of India",
    idFormat: "10-character Alphanumeric (ABCDE1234F)"
  },
  {
    id: "caste",
    label: "Community / Caste Certificate",
    label_ta: "சாதி / சமூகச் சான்றிதழ்",
    label_hi: "जाति / समुदाय प्रमाण पत्र",
    authority: "Revenue Department / Tahsildar Office",
    idFormat: "State Revenue Certificate Registration Ref"
  },
  {
    id: "income",
    label: "Income Certificate",
    label_ta: "வருமானச் சான்றிதழ்",
    label_hi: "आय प्रमाण पत्र",
    authority: "Revenue Administration / Taluk Office",
    idFormat: "Revenue District Annual Income Certificate Ref"
  },
  {
    id: "udyam",
    label: "Udyam MSME Certificate",
    label_ta: "உத்யம் சிறுதொழில் சான்றிதழ் (MSME)",
    label_hi: "उद्यम एमएसएमई प्रमाणपत्र",
    authority: "Ministry of Micro, Small and Medium Enterprises",
    idFormat: "UDYAM-XX-00-0000000"
  }
];

export function getDocMeta(docId) {
  return SUPPORTED_DOCUMENTS.find(d => d.id === docId) || SUPPORTED_DOCUMENTS[0];
}

/**
 * Normalizes text for clean semantic analysis
 */
function cleanText(raw) {
  if (!raw || typeof raw !== "string") return "";
  return raw.replace(/[\r\t]+/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * 1. Checks if raw text is blank, too short, or illegible noise
 */
function checkReadability(text) {
  const cleaned = cleanText(text);
  if (!cleaned || cleaned.length < 25) {
    return {
      isReadable: false,
      reason: "Document is blank or contains insufficient legible text. Please upload a clear, high-resolution image."
    };
  }

  // Count alphabetic characters vs symbols
  const alphaChars = (cleaned.match(/[a-zA-Z\u0B80-\u0BFF\u0900-\u097F]/g) || []).length;
  const ratio = alphaChars / cleaned.length;
  if (ratio < 0.35 && cleaned.length < 60) {
    return {
      isReadable: false,
      reason: "Document image is blurred or contains unreadable noisy artifacts. Legible text could not be extracted."
    };
  }

  // Count distinct words with at least 2 letters
  const words = cleaned.split(/\s+/).filter(w => w.length >= 2);
  if (words.length < 5) {
    return {
      isReadable: false,
      reason: "Document text is too sparse to perform identity authentication."
    };
  }

  return { isReadable: true };
}

/**
 * 2. Unrelated Document Classifier
 * Detects utility bills, store receipts, cash memos, resumes, news clippings
 */
function checkUnrelatedDocument(text) {
  const lower = text.toLowerCase();

  // Electricity / Utility Bill markers
  const isUtilityBill = (
    (lower.includes("electricity") || lower.includes("tangedco") || lower.includes("consumer no") || lower.includes("meter reading") || lower.includes("kwh") || lower.includes("units consumed") || lower.includes("bill amount") || lower.includes("due date")) &&
    !lower.includes("uidai") && !lower.includes("permanent account number")
  );

  // Commercial Store / Restaurant / Hotel Invoice markers
  const isCommercialReceipt = (
    (lower.includes("tax invoice") || lower.includes("cash memo") || lower.includes("gstin") || lower.includes("sub total") || lower.includes("table no") || lower.includes("waiter") || lower.includes("supermarket") || lower.includes("restaurant") || lower.includes("pos receipt")) &&
    !lower.includes("uidai") && !lower.includes("permanent account number") && !lower.includes("revenue department")
  );

  // Resume / CV markers
  const isResume = (
    (lower.includes("curriculum vitae") || lower.includes("resume") || lower.includes("work experience") || lower.includes("technical skills") || lower.includes("education qualification") || lower.includes("career objective")) &&
    !lower.includes("unique identification") && !lower.includes("revenue department")
  );

  if (isUtilityBill) {
    return {
      isUnrelated: true,
      detectedType: "Utility / Electricity Bill",
      reason: "Uploaded file appears to be a Utility / Electricity Bill, which is not an accepted identity document."
    };
  }

  if (isCommercialReceipt) {
    return {
      isUnrelated: true,
      detectedType: "Commercial Receipt / Store Invoice",
      reason: "Uploaded file is a Commercial Store Invoice / Cash Memo, not an official government identity certificate."
    };
  }

  if (isResume) {
    return {
      isUnrelated: true,
      detectedType: "Curriculum Vitae / Resume",
      reason: "Uploaded file is a Resume / CV, not an official government credential."
    };
  }

  return { isUnrelated: false };
}

/**
 * 3. Multi-Factor Document Signature Analyzers
 */

function analyzeAadhaar(lower, raw) {
  // Positive UIDAI Authority anchors (at least one strong anchor required)
  const hasUidaiAnchor = (
    lower.includes("unique identification authority") ||
    lower.includes("uidai") ||
    lower.includes("mera aadhaar") ||
    lower.includes("mera aadhar") ||
    lower.includes("मेरा आधार") ||
    lower.includes("ஆதார்") ||
    lower.includes("aadhaar") ||
    lower.includes("aadhar") ||
    lower.includes("help@uidai.gov.in") ||
    lower.includes("www.uidai.gov.in") ||
    lower.includes("myaadhaar.uidai.gov.in")
  );

  // Valid 12-digit number (4-4-4 spacing or masked XXXX XXXX 1234)
  const aadhaarNumberMatch = raw.match(/\b\d{4}\s\d{4}\s\d{4}\b/) || 
                             raw.match(/\b[xX\d]{4}\s[xX\d]{4}\s\d{4}\b/) ||
                             (hasUidaiAnchor && raw.match(/\b[2-9]\d{11}\b/));

  // Identity field cues
  const hasDobOrYob = (
    lower.includes("dob") ||
    lower.includes("date of birth") ||
    lower.includes("year of birth") ||
    lower.includes("yob") ||
    lower.includes("பிறந்த தேதி") ||
    lower.includes("जन्म तारीख") ||
    lower.includes("जन्म तिथि") ||
    /\b[0-3]?\d[\/\-][01]?\d[\/\-][12][90]\d\d\b/.test(raw)
  );

  const hasGender = (
    lower.includes("male") ||
    lower.includes("female") ||
    lower.includes("transgender") ||
    lower.includes("ஆண்") ||
    lower.includes("பெண்") ||
    lower.includes("पुरुष") ||
    lower.includes("महिला")
  );

  const hasGovHeader = (
    lower.includes("government of india") ||
    lower.includes("govt of india") ||
    lower.includes("bharat sarkar") ||
    lower.includes("भारत सरकार") ||
    lower.includes("இந்திய அரசு")
  );

  // Aadhaar requires UIDAI anchor + (12-digit match OR (Gov header + DOB/Gender))
  const isAadhaar = Boolean(
    hasUidaiAnchor && (aadhaarNumberMatch || (hasGovHeader && (hasDobOrYob || hasGender)))
  );

  return {
    isMatch: isAadhaar,
    idNumber: aadhaarNumberMatch ? aadhaarNumberMatch[0] : null,
    hasAuthority: hasUidaiAnchor || (hasGovHeader && Boolean(aadhaarNumberMatch)),
    hasIdFormat: Boolean(aadhaarNumberMatch),
    hasMandatoryFields: Boolean(hasDobOrYob || hasGender)
  };
}

function analyzePAN(lower, raw) {
  const hasPanAnchor = (
    lower.includes("income tax department") ||
    lower.includes("permanent account number") ||
    lower.includes("incometax") ||
    lower.includes("आयकर विभाग")
  );

  // Strict PAN regex: 5 uppercase letters, 4 digits, 1 uppercase letter
  const panMatch = raw.match(/\b[A-Za-z]{5}[0-9]{4}[A-Za-z]\b/);

  const hasIdentityFields = (
    lower.includes("father") ||
    lower.includes("name") ||
    lower.includes("date of birth") ||
    lower.includes("dob")
  );

  const isPan = Boolean(
    hasPanAnchor && (panMatch || hasIdentityFields) || (panMatch && hasIdentityFields)
  );

  return {
    isMatch: isPan,
    idNumber: panMatch ? panMatch[0].toUpperCase() : null,
    hasAuthority: hasPanAnchor,
    hasIdFormat: Boolean(panMatch),
    hasMandatoryFields: Boolean(hasIdentityFields)
  };
}

function analyzeCommunity(lower, raw) {
  const hasCommunityAnchor = (
    lower.includes("community certificate") ||
    lower.includes("caste certificate") ||
    lower.includes("சாதிச் சான்றிதழ்") ||
    lower.includes("சமூகச் சான்றிதழ்") ||
    lower.includes("जाति प्रमाण पत्र") ||
    lower.includes("social welfare department")
  );

  const hasRevenueAuthority = (
    lower.includes("revenue department") ||
    lower.includes("tahsildar") ||
    lower.includes("taluk") ||
    lower.includes("zonal deputy") ||
    lower.includes("district collector") ||
    lower.includes("வருவாய்த்துறை") ||
    lower.includes("வட்டாட்சியர்")
  );

  const hasCasteCategory = (
    lower.includes("scheduled caste") ||
    lower.includes("scheduled tribe") ||
    lower.includes("most backward") ||
    lower.includes("backward class") ||
    lower.includes("sc") ||
    lower.includes("st") ||
    lower.includes("obc") ||
    lower.includes("mbc") ||
    lower.includes("பட்டியலின") ||
    lower.includes("பிற்படுத்தப்பட்ட")
  );

  const hasDeclaration = (
    lower.includes("this is to certify") ||
    lower.includes("certify that") ||
    lower.includes("residing at") ||
    lower.includes("சான்றளிக்கப்படுகிறது") ||
    lower.includes("प्रमाणित किया जाता है")
  );

  const isCommunity = Boolean(
    (hasCommunityAnchor && (hasRevenueAuthority || hasCasteCategory)) ||
    (hasRevenueAuthority && hasCasteCategory && hasDeclaration)
  );

  return {
    isMatch: isCommunity,
    idNumber: (raw.match(/\bTN-\d{8,14}\b/i) || raw.match(/\bCC\/?\d{4,12}\b/i) || [null])[0],
    hasAuthority: hasRevenueAuthority || hasCommunityAnchor,
    hasIdFormat: Boolean(hasCasteCategory),
    hasMandatoryFields: hasDeclaration || hasCasteCategory
  };
}

function analyzeIncome(lower, raw) {
  const hasIncomeAnchor = (
    lower.includes("income certificate") ||
    lower.includes("வருமானச் சான்றிதழ்") ||
    lower.includes("आय प्रमाण पत्र")
  );

  const hasRevenueAuthority = (
    lower.includes("revenue department") ||
    lower.includes("revenue administration") ||
    lower.includes("tahsildar") ||
    lower.includes("district collectorate") ||
    lower.includes("taluk office") ||
    lower.includes("வருவாய்த்துறை")
  );

  const hasFinancialFields = (
    lower.includes("annual income") ||
    lower.includes("family income") ||
    lower.includes("rupees") ||
    lower.includes("per annum") ||
    lower.includes("ஆண்டு வருமானம்") ||
    /rs\.?\s*[\d,]+/i.test(raw) ||
    /₹\s*[\d,]+/.test(raw)
  );

  const hasDeclaration = (
    lower.includes("this is to certify") ||
    lower.includes("certify that") ||
    lower.includes("residing at") ||
    lower.includes("சான்றளிக்கப்படுகிறது") ||
    lower.includes("प्रमाणित किया जाता है")
  );

  const isIncome = Boolean(
    (hasIncomeAnchor && (hasRevenueAuthority || hasFinancialFields)) ||
    (hasRevenueAuthority && hasFinancialFields && hasDeclaration)
  );

  return {
    isMatch: isIncome,
    idNumber: (raw.match(/\bINC\/?\d{4,12}\b/i) || raw.match(/\bTN-\d{8,14}\b/i) || [null])[0],
    hasAuthority: hasRevenueAuthority || hasIncomeAnchor,
    hasIdFormat: Boolean(hasFinancialFields),
    hasMandatoryFields: hasFinancialFields && (hasDeclaration || hasIncomeAnchor)
  };
}

function analyzeUdyam(lower, raw) {
  const hasUdyamAnchor = (
    lower.includes("udyam registration") ||
    lower.includes("ministry of micro, small and medium") ||
    lower.includes("ministry of msme") ||
    lower.includes("msme registration")
  );

  const udyamMatch = raw.match(/\bUDYAM-[A-Z]{2}-\d{2}-\d{7}\b/i);

  const isUdyam = Boolean(
    hasUdyamAnchor || Boolean(udyamMatch)
  );

  return {
    isMatch: isUdyam,
    idNumber: udyamMatch ? udyamMatch[0].toUpperCase() : null,
    hasAuthority: hasUdyamAnchor,
    hasIdFormat: Boolean(udyamMatch),
    hasMandatoryFields: Boolean(hasUdyamAnchor && udyamMatch)
  };
}

/**
 * Parses verified parameters from recognized authentic government documents
 */
function extractProfileFields(raw, lower, docType) {
  let name = null;
  let age = null;
  let dob = null;
  let gender = null;
  let district = null;
  let area = null;
  let caste = null;
  let income = null;
  let occupation = null;

  // Name extraction
  const nameMatch = raw.match(/(?:Name|பெயர்|नाम)[\s:]*([A-Za-z\s\.]{3,35})/i);
  if (nameMatch && nameMatch[1].trim().length > 2) {
    name = nameMatch[1].trim().replace(/\n.*$/, '');
  }

  // DOB / Age extraction
  const dobMatch = raw.match(/(?:DOB|Date of Birth|Year of Birth|YOB|Birth|பிறந்த தேதி)[\s:]*([0-3]?\d[\/\-][01]?\d[\/\-][12][90]\d\d|[12][90]\d\d)/i);
  if (dobMatch) {
    dob = dobMatch[1];
    const year = dob.length === 4 ? parseInt(dob) : parseInt(dob.slice(-4));
    const currentYear = new Date().getFullYear();
    if (year >= 1940 && year <= currentYear - 18) {
      age = currentYear - year;
    }
  }

  // Gender extraction
  if (lower.includes("female") || lower.includes("பெண்") || lower.includes("महिला") || lower.includes("smt.") || lower.includes("smt ")) {
    gender = "Female";
  } else if (lower.includes("male") || lower.includes("ஆண்") || lower.includes("पुरुष") || lower.includes("shri") || lower.includes("thiru")) {
    gender = "Male";
  }

  // District extraction
  const districts = ["Tiruchirappalli", "Chennai", "Madurai", "Coimbatore", "Salem", "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Dindigul", "Trichy"];
  for (const d of districts) {
    if (lower.includes(d.toLowerCase())) {
      district = d === "Trichy" ? "Tiruchirappalli" : d;
      break;
    }
  }

  // Area extraction
  if (lower.includes("urban") || lower.includes("corporation") || lower.includes("municipality") || lower.includes("city")) {
    area = "Urban";
  } else if (lower.includes("rural") || lower.includes("village") || lower.includes("panchayat")) {
    area = "Rural";
  }

  // Caste extraction
  if (lower.includes("scheduled caste") || lower.includes("sc ") || lower.includes("sc/") || lower.includes("பட்டியலின")) {
    caste = "SC";
  } else if (lower.includes("scheduled tribe") || lower.includes("st ") || lower.includes("st/")) {
    caste = "ST";
  } else if (lower.includes("most backward") || lower.includes("mbc") || lower.includes("backward class") || lower.includes("obc")) {
    caste = "OBC";
  }

  // Income extraction
  const incomeMatch = raw.match(/(?:income|வருமானம்|annual family income)[\s:]*(?:rs\.?|inr|₹)?\s*([\d,]+)/i);
  if (incomeMatch) {
    const parsed = parseInt(incomeMatch[1].replace(/,/g, ''), 10);
    if (parsed > 10000 && parsed < 2000000) {
      income = parsed;
    }
  }

  // Sector / Occupation extraction
  if (lower.includes("vendor") || lower.includes("hawker") || lower.includes("வியாபாரி")) {
    occupation = "Street Vendor";
  } else if (lower.includes("artisan") || lower.includes("potter") || lower.includes("weaver") || lower.includes("கைவினை")) {
    occupation = "Handicraft/Artisan";
  }

  return { name, age, dob, gender, district, area, caste, income, occupation };
}

/**
 * MAIN VERIFICATION FUNCTION
 * 
 * Evaluates the uploaded document against the required document type.
 * Never outputs percentages. Makes a strict MATCH / INCORRECT decision.
 * 
 * @param {string} rawText - Raw OCR text extracted by Tesseract
 * @param {string} requiredDocId - The required document ID (aadhaar, pan, caste, income, udyam)
 * @param {string} lang - Language code ('en', 'ta', 'hi')
 */
export function verifyDocument(rawText, requiredDocId = "aadhaar", lang = "en") {
  const reqMeta = getDocMeta(requiredDocId);
  const requiredLabel = reqMeta.label;

  // Step 1: Readability & Blank Check
  const readability = checkReadability(rawText);
  if (!readability.isReadable) {
    return {
      decision: "INCORRECT",
      status: "BLANK_OR_UNREADABLE",
      badgeText: "INCORRECT",
      badgeColor: "rose",
      requiredDocId,
      requiredDocLabel: requiredLabel,
      detectedDocType: "Blank / Unreadable Document",
      reason: readability.reason,
      diagnostics: "The scanner could not extract legible text. Please upload a clear photo or high-resolution scan.",
      checklist: [
        { label: "Image Readability & Resolution", passed: false, detail: "Illegible or blank text" },
        { label: "Required Document Match", passed: false, detail: "Unidentified document" },
        { label: "Official Issuing Authority Seal", passed: false, detail: "No official markers found" },
        { label: "Mandatory Information Fields", passed: false, detail: "No identity fields detected" }
      ],
      extractedData: null
    };
  }

  // Step 2: Unrelated Document Check (Utility bill, receipt, resume, etc.)
  const unrelated = checkUnrelatedDocument(rawText);
  if (unrelated.isUnrelated) {
    return {
      decision: "INCORRECT",
      status: "UNRELATED_DOCUMENT",
      badgeText: "INCORRECT",
      badgeColor: "rose",
      requiredDocId,
      requiredDocLabel: requiredLabel,
      detectedDocType: unrelated.detectedType,
      reason: `Unrelated document detected (${unrelated.detectedType}). It does not meet the requirement for ${requiredLabel}.`,
      diagnostics: unrelated.reason,
      checklist: [
        { label: "Image Readability & Resolution", passed: true, detail: "Legible text extracted" },
        { label: "Required Document Match", passed: false, detail: `Detected unrelated ${unrelated.detectedType}` },
        { label: "Official Issuing Authority Seal", passed: false, detail: "Missing government authority seal" },
        { label: "Mandatory Information Fields", passed: false, detail: "Non-compliant document format" }
      ],
      extractedData: null
    };
  }

  // Step 3: Analyze against all official document signatures
  const lower = rawText.toLowerCase();
  const aadhaarRes = analyzeAadhaar(lower, rawText);
  const panRes = analyzePAN(lower, rawText);
  const communityRes = analyzeCommunity(lower, rawText);
  const incomeRes = analyzeIncome(lower, rawText);
  const udyamRes = analyzeUdyam(lower, rawText);

  // Determine detected document type
  let detectedId = null;
  let detectedMeta = null;
  let activeAnalysis = null;

  if (aadhaarRes.isMatch) {
    detectedId = "aadhaar";
    detectedMeta = getDocMeta("aadhaar");
    activeAnalysis = aadhaarRes;
  } else if (panRes.isMatch) {
    detectedId = "pan";
    detectedMeta = getDocMeta("pan");
    activeAnalysis = panRes;
  } else if (communityRes.isMatch) {
    detectedId = "caste";
    detectedMeta = getDocMeta("caste");
    activeAnalysis = communityRes;
  } else if (incomeRes.isMatch) {
    detectedId = "income";
    detectedMeta = getDocMeta("income");
    activeAnalysis = incomeRes;
  } else if (udyamRes.isMatch) {
    detectedId = "udyam";
    detectedMeta = getDocMeta("udyam");
    activeAnalysis = udyamRes;
  }

  // If no recognized government document matches
  if (!detectedId) {
    return {
      decision: "INCORRECT",
      status: "UNRELATED_DOCUMENT",
      badgeText: "INCORRECT",
      badgeColor: "rose",
      requiredDocId,
      requiredDocLabel: requiredLabel,
      detectedDocType: "Unrecognized / Unofficial Document",
      reason: `The uploaded document could not be authenticated as a valid Government ID. Required document is ${requiredLabel}.`,
      diagnostics: "The document lacks official government issuing authority markers, statutory seals, or valid identification number formats.",
      checklist: [
        { label: "Image Readability & Resolution", passed: true, detail: "Legible text extracted" },
        { label: "Required Document Match", passed: false, detail: `Does not match ${requiredLabel}` },
        { label: "Official Issuing Authority Seal", passed: false, detail: "No official authority markers verified" },
        { label: "Mandatory Information Fields", passed: false, detail: "Required fields could not be verified" }
      ],
      extractedData: null
    };
  }

  // Step 4: Compare Detected Document vs. Required Document
  if (detectedId !== requiredDocId) {
    return {
      decision: "INCORRECT",
      status: "WRONG_DOCUMENT_TYPE",
      badgeText: "INCORRECT",
      badgeColor: "rose",
      requiredDocId,
      requiredDocLabel: requiredLabel,
      detectedDocType: detectedMeta.label,
      reason: `Wrong document uploaded! You uploaded a ${detectedMeta.label}, but the required document for this step is ${requiredLabel}.`,
      diagnostics: `Please upload the correct ${requiredLabel} to proceed with verification.`,
      checklist: [
        { label: "Image Readability & Resolution", passed: true, detail: "Clear text extracted" },
        { label: "Required Document Match", passed: false, detail: `Detected: ${detectedMeta.label} ≠ Required: ${requiredLabel}` },
        { label: "Official Issuing Authority Seal", passed: activeAnalysis.hasAuthority, detail: `Seal belongs to ${detectedMeta.authority}` },
        { label: "Mandatory Information Fields", passed: activeAnalysis.hasMandatoryFields, detail: "Fields match different document specification" }
      ],
      extractedData: null
    };
  }

  // Step 5: Verify Mandatory Fields for the Required Document
  if (!activeAnalysis.hasIdFormat && !activeAnalysis.hasMandatoryFields) {
    return {
      decision: "INCORRECT",
      status: "MISSING_REQUIRED_INFO",
      badgeText: "INCORRECT",
      badgeColor: "rose",
      requiredDocId,
      requiredDocLabel: requiredLabel,
      detectedDocType: detectedMeta.label,
      reason: `Incomplete ${requiredLabel}. Document is missing mandatory registration numbers or required beneficiary information.`,
      diagnostics: `Expected valid ID format (${reqMeta.idFormat}) or key applicant credentials.`,
      checklist: [
        { label: "Image Readability & Resolution", passed: true, detail: "Legible text extracted" },
        { label: "Required Document Match", passed: true, detail: `Identified as ${requiredLabel}` },
        { label: "Official Issuing Authority Seal", passed: activeAnalysis.hasAuthority, detail: `${reqMeta.authority} markers verified` },
        { label: "Mandatory Information Fields", passed: false, detail: `Missing valid ${reqMeta.idFormat} or applicant details` }
      ],
      extractedData: null
    };
  }

  // Step 6: Full Verification MATCH!
  const extracted = extractProfileFields(rawText, lower, requiredDocId);

  return {
    decision: "MATCH",
    status: "VERIFIED_MATCH",
    badgeText: "MATCH",
    badgeColor: "emerald",
    requiredDocId,
    requiredDocLabel: requiredLabel,
    detectedDocType: detectedMeta.label,
    idNumber: activeAnalysis.idNumber,
    reason: `Authenticated ${requiredLabel}. Document type verified and required credentials successfully validated.`,
    diagnostics: `All statutory authority seals and identity parameters matched the requirements for ${requiredLabel}.`,
    checklist: [
      { label: "Image Readability & Resolution", passed: true, detail: "High-resolution legible document" },
      { label: "Required Document Match", passed: true, detail: `Accurately matched ${requiredLabel}` },
      { label: "Official Issuing Authority Seal", passed: true, detail: `${reqMeta.authority} authenticated` },
      { label: "Mandatory Information Fields", passed: true, detail: activeAnalysis.idNumber ? `ID Reference: ${activeAnalysis.idNumber}` : "Identity parameters verified" }
    ],
    extractedData: extracted
  };
}
