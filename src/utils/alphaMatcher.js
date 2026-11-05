/**
 * Deterministic Weighted Recommender Engine for SchemeConnect & Alpha Portal
 * Supports trilingual audit diagnostics: English, Tamil (தமிழ்), Hindi (हिंदी)
 */

const REMEDIATION = {
  age: {
    en: "Check your Age Certificate or wait for Alpha Portal age-cap policy update.",
    ta: "வயது சான்றிதழை சரிபார்க்கவும் அல்லது Alpha Portal வயது வரம்பு மாற்றத்திற்கு காத்திருக்கவும்.",
    hi: "अपना आयु प्रमाण पत्र जाँचें या Alpha Portal पर आयु सीमा नीति अपडेट की प्रतीक्षा करें।"
  },
  area: {
    en: "Schemes are area-specific. Look for schemes covering your residential area type.",
    ta: "திட்டங்கள் பகுதி சார்ந்தவை. உங்கள் பகுதி வகையை உள்ளடக்கும் திட்டங்களை தேடுங்கள்.",
    hi: "योजनाएँ क्षेत्र-विशिष्ट हैं। अपने आवासीय क्षेत्र प्रकार को कवर करने वाली योजनाएँ खोजें।"
  },
  sector: {
    en: "Update your Udyam Certificate to match the scheme's target sector, or explore other sector-matching schemes.",
    ta: "திட்டத்தின் இலக்கு துறையுடன் பொருந்த உங்கள் உதயம் சான்றிதழை புதுப்பிக்கவும்.",
    hi: "योजना के लक्षित क्षेत्र से मिलान करने के लिए अपना उद्यम प्रमाणपत्र अपडेट करें।"
  },
  gender: {
    en: "This scheme is reserved for a specific gender. Check other eligible schemes in the recommendations grid.",
    ta: "இத்திட்டம் ஒரு குறிப்பிட்ட பாலினத்திற்காக ஒதுக்கப்பட்டுள்ளது. பரிந்துரை பட்டியலில் மற்ற தகுதியான திட்டங்களை சரிபார்க்கவும்.",
    hi: "यह योजना एक विशिष्ट लिंग के लिए आरक्षित है। अनुशंसा ग्रिड में अन्य पात्र योजनाएँ देखें।"
  },
  caste: {
    en: "Obtain your Caste/Community Certificate from the local Tahsildar office to qualify for reserved category schemes.",
    ta: "ஒதுக்கீடு பிரிவு திட்டங்களுக்கு தகுதி பெற உள்ளூர் தாசில்தாரிடம் சாதி/சமுதாய சான்றிதழ் பெறுங்கள்.",
    hi: "आरक्षित श्रेणी योजनाओं के लिए पात्रता हेतु स्थानीय तहसीलदार कार्यालय से जाति/समुदाय प्रमाण पत्र प्राप्त करें।"
  },
  income: {
    en: "Income exceeds this scheme's cap. Browse schemes with higher income limits, or seek income re-assessment from your Block Development Officer.",
    ta: "வருமானம் இத்திட்டத்தின் உச்சவரம்பை மீறியுள்ளது. அதிக வருமான வரம்பு உள்ள திட்டங்களை பரிசீலிக்கவும் அல்லது வட்டார வளர்ச்சி அலுவலரிடம் வருமான மறுமதிப்பீடு பெறுங்கள்.",
    hi: "आय इस योजना की सीमा से अधिक है। अधिक आय सीमा वाली योजनाएँ देखें या अपने खंड विकास अधिकारी से आय पुनर्मूल्यांकन लें।"
  },
  shg: {
    en: "Join a registered Self-Help Group (SHG) at your nearest Common Service Centre to unlock this scheme.",
    ta: "இத்திட்டத்தை திறக்க அருகிலுள்ள பொது சேவை மையத்தில் பதிவு செய்யப்பட்ட சுயஉதவிக்குழுவில் (SHG) சேரவும்.",
    hi: "इस योजना को अनलॉक करने के लिए अपने निकटतम सामान्य सेवा केंद्र में एक पंजीकृत स्व-सहायता समूह (SHG) में शामिल हों।"
  }
};

export function evaluateSchemeEligibility(scheme, user, lang = "en") {
  const audits = [];
  const isTa = lang === "ta";
  const isHi = lang === "hi";
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  // 1. Age Rule
  const userAge = Number(user.age) || 0;
  const isAgeValid = userAge >= scheme.age_min && userAge <= scheme.age_max;
  audits.push({
    criterion: L("Age Eligibility", "வயது தகுதி", "आयु पात्रता"),
    passed: isAgeValid,
    remediation: isAgeValid ? null : REMEDIATION.age[lang] || REMEDIATION.age.en,
    reason: isAgeValid
      ? L(`Age ${userAge} within bracket (${scheme.age_min}–${scheme.age_max} yrs)`,
          `வயது ${userAge} அனுமதிக்கப்பட்ட வரம்பிற்குள் (${scheme.age_min}–${scheme.age_max})`,
          `आयु ${userAge} निर्धारित सीमा (${scheme.age_min}–${scheme.age_max} वर्ष) में है`)
      : L(`Failed: Max eligible age is ${scheme.age_max} yrs (Your age: ${userAge})`,
          `தகுதி தோல்வி: அதிகபட்ச வயது ${scheme.age_max} (உங்கள் வயது: ${userAge})`,
          `असफल: अधिकतम पात्र आयु ${scheme.age_max} वर्ष है (आपकी आयु: ${userAge})`)
  });

  // 2. Area Rule
  const userArea = user.area || "";
  const isAreaValid = scheme.area === "Both" || scheme.area === "All" ||
    scheme.area.toLowerCase() === userArea.toLowerCase();
  audits.push({
    criterion: L("Geographic Area", "இருப்பிட பகுதி", "भौगोलिक क्षेत्र"),
    passed: isAreaValid,
    remediation: isAreaValid ? null : REMEDIATION.area[lang] || REMEDIATION.area.en,
    reason: isAreaValid
      ? L(`Area '${userArea}' is eligible under ${scheme.area} guideline`,
          `'${userArea === "Urban" ? "நகர்ப்புறம்" : "கிராமப்புறம்"}' பகுதி அனுமதிக்கப்பட்டுள்ளது`,
          `क्षेत்र '${userArea === "Urban" ? "शहरी" : "ग्रामीण"}' पात्र है`)
      : L(`Failed: Scheme restricted to ${scheme.area} areas (Your area: ${userArea})`,
          `தகுதி தோல்வி: இத்திட்டம் ${scheme.area === "Urban" ? "நகர்ப்புறத்திற்கு" : "கிராமப்புறத்திற்கு"} மட்டுமே (உங்கள் பகுதி: ${userArea})`,
          `असफल: योजना ${scheme.area === "Urban" ? "शहरी" : "ग्रामीण"} क्षेत्र तक सीमित है (आपका क्षेत्र: ${userArea})`)
  });

  // 3. Sector Rule
  const userSector = user.sector || "";
  const isSectorValid = scheme.sector === "All" ||
    scheme.sector.toLowerCase() === userSector.toLowerCase();
  audits.push({
    criterion: L("Trade / Sector", "தொழில் பிரிவு", "व्यापार / क्षेत्र"),
    passed: isSectorValid,
    remediation: isSectorValid ? null : REMEDIATION.sector[lang] || REMEDIATION.sector.en,
    reason: isSectorValid
      ? L(`Sector '${userSector}' recognized`,
          `'${userSector}' தொழில் அங்கீகரிக்கப்பட்டுள்ளது`,
          `क्षेत्र '${userSector}' मान्यता प्राप्त है`)
      : L(`Failed: Target sector is '${scheme.sector}' (Your sector: '${userSector}')`,
          `தகுதி தோல்வி: இத்திட்டம் '${scheme.sector}' தொழிலுக்கு மட்டுமே (உங்கள் தொழில்: '${userSector}')`,
          `असफल: लक्षित क्षेत्र '${scheme.sector}' है (आपका क्षेत्र: '${userSector}')`)
  });

  // 4. Gender Rule
  const userGender = user.gender || "";
  const isGenderValid = scheme.gender === "All" ||
    scheme.gender.toLowerCase() === userGender.toLowerCase();
  audits.push({
    criterion: L("Gender Specification", "பாலினம்", "लिंग निर्धारण"),
    passed: isGenderValid,
    remediation: isGenderValid ? null : REMEDIATION.gender[lang] || REMEDIATION.gender.en,
    reason: isGenderValid
      ? L(`Gender '${userGender}' permitted`,
          `பாலினம் '${userGender}' அனுமதிக்கப்பட்டுள்ளது`,
          `लिंग '${userGender}' अनुमत है`)
      : L(`Failed: Scheme reserved for ${scheme.gender} applicants`,
          `தகுதி தோல்வி: இத்திட்டம் பெண்களுக்கு மட்டுமே`,
          `असफल: योजना केवल ${scheme.gender} आवेदकों के लिए आरक्षित है`)
  });

  // 5. Caste/Category Rule
  const userCaste = user.caste || user.social_category || "";
  const isCasteValid = scheme.social_category === "All" ||
    (scheme.social_category === "SC/ST" && (userCaste === "SC" || userCaste === "ST" || userCaste === "SC/ST")) ||
    scheme.social_category === "ST" && userCaste === "ST" ||
    scheme.social_category === userCaste;
  audits.push({
    criterion: L("Social Category", "சமூகப் பிரிவு", "सामाजिक श्रेणी"),
    passed: isCasteValid,
    remediation: isCasteValid ? null : REMEDIATION.caste[lang] || REMEDIATION.caste.en,
    reason: isCasteValid
      ? L(`Category '${userCaste}' qualifies`,
          `'${userCaste}' பிரிவு தகுதியானது`,
          `श्रेणी '${userCaste}' पात्र है`)
      : L(`Failed: Requires ${scheme.social_category} category (Your category: ${userCaste})`,
          `தகுதி தோல்வி: ${scheme.social_category} பிரிவு கட்டாயம் (உங்கள் பிரிவு: ${userCaste})`,
          `असफल: ${scheme.social_category} श्रेणी आवश्यक है (आपकी श्रेणी: ${userCaste})`)
  });

  // 6. Income Cap Rule
  const userIncome = Number(user.income || user.annual_income || 0);
  const isIncomeValid = userIncome <= Number(scheme.income_cap);
  audits.push({
    criterion: L("Household Income Cap", "வருமான வரம்பு", "घरेलू आय सीमा"),
    passed: isIncomeValid,
    remediation: isIncomeValid ? null : REMEDIATION.income[lang] || REMEDIATION.income.en,
    reason: isIncomeValid
      ? L(`Income ₹${userIncome.toLocaleString('en-IN')} within ceiling ₹${Number(scheme.income_cap).toLocaleString('en-IN')}`,
          `வருமானம் ₹${userIncome.toLocaleString('en-IN')} உச்சவரம்பிற்குள்`,
          `आय ₹${userIncome.toLocaleString('en-IN')} सीमा ₹${Number(scheme.income_cap).toLocaleString('en-IN')} के भीतर`)
      : L(`Failed: Income ₹${userIncome.toLocaleString('en-IN')} exceeds ceiling ₹${Number(scheme.income_cap).toLocaleString('en-IN')}`,
          `தகுதி தோல்வி: வருமானம் ₹${userIncome.toLocaleString('en-IN')} உச்சவரம்பை மீறியுள்ளது`,
          `असफल: आय ₹${userIncome.toLocaleString('en-IN')} सीमा ₹${Number(scheme.income_cap).toLocaleString('en-IN')} से अधिक`)
  });

  // 7. SHG Membership Rule
  const isShgMember = user.shg_membership === "Yes";
  const isShgValid = scheme.shg_membership === "Not Required" ||
    scheme.shg_membership === "Preferred" ||
    (scheme.shg_membership === "Mandatory" && isShgMember);
  audits.push({
    criterion: L("SHG Membership", "சுயஉதவிக்குழு நிலை", "SHG सदस्यता"),
    passed: isShgValid,
    remediation: isShgValid ? null : REMEDIATION.shg[lang] || REMEDIATION.shg.en,
    reason: isShgValid
      ? L(scheme.shg_membership === "Mandatory" ? "SHG membership verified" : "SHG membership not mandatory",
          scheme.shg_membership === "Mandatory" ? "சுயஉதவிக்குழு உறுப்பினர் சரிபார்க்கப்பட்டது" : "சுயஉதவிக்குழு கட்டாயமில்லை",
          scheme.shg_membership === "Mandatory" ? "SHG सदस्यता सत्यापित" : "SHG आवश्यक नहीं")
      : L("Failed: Active Self-Help Group (SHG) membership required",
          "தகுதி தோல்வி: சுயஉதவிக்குழு (SHG) உறுப்பினர் சான்று கட்டாயம்",
          "असफल: सक्रिय स्व-सहायता समूह (SHG) सदस्यता आवश्यक है")
  });

  const totalCriteria = audits.length;
  const passedCount = audits.filter(a => a.passed).length;
  const matchPercentage = Math.round((passedCount / totalCriteria) * 100);
  const isEligible = matchPercentage === 100;

  const passedCriteria = audits.filter(a => a.passed).map(a => a.reason);
  const failedCriteria = audits.filter(a => !a.passed).map(a => a.reason);
  const remediationSteps = audits.filter(a => !a.passed && a.remediation).map(a => a.remediation);

  return {
    ...scheme,
    total_criteria: totalCriteria,
    passed_criteria_count: passedCount,
    match_percentage: matchPercentage,
    readiness_score: matchPercentage,
    is_eligible: isEligible,
    passed_criteria: passedCriteria,
    failed_criteria: failedCriteria,
    remediation_steps: remediationSteps,
    matched_reasons: passedCriteria,
    unmatched_reasons: failedCriteria,
    audits: audits
  };
}

/**
 * Ranks all schemes for a given user profile.
 * Prioritizes 100% eligible → higher match% → higher sanctioned amount.
 */
export function rankAlphaSchemes(schemesList, userProfile, lang = "en") {
  if (!userProfile) return schemesList; // No profile = don't rank
  const evaluated = schemesList.map(scheme => evaluateSchemeEligibility(scheme, userProfile, lang));
  return evaluated.sort((a, b) => {
    if (a.is_eligible && !b.is_eligible) return -1;
    if (!a.is_eligible && b.is_eligible) return 1;
    if (b.match_percentage !== a.match_percentage) return b.match_percentage - a.match_percentage;
    return Number(b.sanctioned_amount || 0) - Number(a.sanctioned_amount || 0);
  });
}
