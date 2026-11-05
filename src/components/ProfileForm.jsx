import React, { useState } from 'react';
import { 
  User, Briefcase, IndianRupee, MapPin, Award, CheckCircle, 
  ArrowRight, GraduationCap, Building2, ShieldCheck, Sparkles 
} from 'lucide-react';

export function ProfileForm({ lang = "ta", t, initialProfile, onFindSchemes }) {
  const [profile, setProfile] = useState(initialProfile || {
    name: "Rajan S.",
    age: 38,
    gender: "Male",
    caste: "SC",
    project_type: "Micro Business / Street Vending",
    estimated_cost: 140000,
    education_status: "10th / 12th Pass",
    occupation: "Street Vendor",
    annual_income: 180000,
    state: "Tamil Nadu",
    district: "Tiruchirappalli",
    documents: ["Aadhaar Card", "Bank Account Passbook", "Community Certificate", "Income Certificate"]
  });

  const projectTypes = [
    { 
      label: lang === 'ta' ? "நுண்கடன் / தெருவோர வியாபாரம் (₹1.40 லட்சம் வரை)" : "Micro Business / Street Vending (≤ ₹1.40 Lakh)", 
      val: "Micro Business / Street Vending", 
      cost: 140000 
    },
    { 
      label: lang === 'ta' ? "நடுத்தர மற்றும் பெருந்தொழில் கடன் (₹50.00 லட்சம் வரை)" : "Small Enterprise / Term Loan (≤ ₹50.00 Lakhs)", 
      val: "Small Enterprise / Term Loan", 
      cost: 1500000 
    },
    { 
      label: lang === 'ta' ? "உயர்கல்வி / தொழிற்கல்வி கடன் (₹20 லட்சம் வரை)" : "Higher / Professional Education Loan (≤ ₹20 Lakhs)", 
      val: "Higher / Professional Education", 
      cost: 800000 
    },
    { 
      label: lang === 'ta' ? "விஸ்வகர்மா பாரம்பரிய கைவினைஞர் கடன் (₹3 லட்சம் வரை)" : "Artisan / PM Vishwakarma Trade (≤ ₹3.00 Lakhs)", 
      val: "Artisan / Handicraft", 
      cost: 300000 
    },
    { 
      label: lang === 'ta' ? "வாகன கடன் / வணிக பயன்பாடு (₹10 லட்சம் வரை)" : "Commercial Vehicle / Transport (≤ ₹10.00 Lakhs)", 
      val: "Transport / Vehicle", 
      cost: 900000 
    },
    { 
      label: lang === 'ta' ? "மகளிர் சுயஉதவிக்குழு நுண்கடன் (SHG Micro-Credit)" : "Women Self-Help Group (SHG) Micro-Credit", 
      val: "Self-Help Group (SHG)", 
      cost: 140000 
    }
  ];

  const educationLevels = [
    lang === 'ta' ? "10-ஆம் வகுப்புக்கு கீழ்" : "Below 10th Standard",
    lang === 'ta' ? "10 / 12-ஆம் வகுப்பு தேர்ச்சி" : "10th / 12th Pass",
    lang === 'ta' ? "டிப்ளமோ / ஐ.டி.ஐ (Diploma / ITI)" : "Diploma / ITI Graduate",
    lang === 'ta' ? "இளங்கலை பட்டதாரி (BA/BSc/BCom/BE)" : "Undergraduate Degree (BA/BSc/BCom/BE)",
    lang === 'ta' ? "முதுகலை / தொழிற்கல்வி (ME/MBA/மருத்துவம்/சட்டம்)" : "Postgraduate / Professional (ME/MBA/Doctor/Lawyer)"
  ];

  const availableDocs = [
    lang === 'ta' ? "ஆதார் அட்டை" : "Aadhaar Card",
    lang === 'ta' ? "வங்கி கணக்கு புத்தகம்" : "Bank Account Passbook",
    lang === 'ta' ? "சாதிச் சான்றிதழ் (SC/ST)" : "Community / Caste Certificate (SC/ST)",
    lang === 'ta' ? "வருமானச் சான்றிதழ் (≤ ₹5 லட்சம்)" : "Income Certificate (≤ ₹5 Lakhs)",
    lang === 'ta' ? "திட்ட மதிப்பீடு / உபகரண விலைப்பட்டியல்" : "Trade Quotation / Project Estimate",
    lang === 'ta' ? "கல்லூரி சேர்க்கை கடிதம் (கல்வி கடனுக்கு)" : "College Admission Letter (if Education Loan)"
  ];

  const toggleDoc = (doc) => {
    const current = profile.documents || [];
    if (current.includes(doc)) {
      setProfile({ ...profile, documents: current.filter(d => d !== doc) });
    } else {
      setProfile({ ...profile, documents: [...current, doc] });
    }
  };

  const handleProjectTypeChange = (ptVal) => {
    const matched = projectTypes.find(p => p.val === ptVal);
    setProfile({
      ...profile,
      project_type: ptVal,
      estimated_cost: matched ? matched.cost : profile.estimated_cost
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFindSchemes(profile);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-6 sm:p-8 animate-fadeIn">
      
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-slate-100">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>{lang === 'ta' ? "ஸ்மார்ட் திட்ட தகுதி இயந்திரம்" : "Smart Scheme Eligibility Engine"}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          {t?.profiler_title || "Citizen & Project Profiler"}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {t?.profiler_desc || "Enter basic details to automatically discover eligible concessional schemes, calculate EMIs, and route to active Channel Partners."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* ROW 1: Project Type & Estimated Cost */}
        <div className="p-4 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-2xl border border-blue-100 space-y-4">
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>{t?.section_loan_type || "1. Loan Category & Project Requirement"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t?.label_proj_type || "Target Scheme Category:"}
              </label>
              <select
                value={profile.project_type}
                onChange={(e) => handleProjectTypeChange(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {projectTypes.map((pt) => (
                  <option key={pt.val} value={pt.val}>
                    {pt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t?.label_est_cost || "Estimated Project / Study Cost (₹):"}
              </label>
              <input
                type="number"
                step="10000"
                min="10000"
                max="10000000"
                value={profile.estimated_cost}
                onChange={(e) => setProfile({ ...profile, estimated_cost: Number(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-black text-blue-900 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {profile.estimated_cost <= 140000 && (lang === 'ta' ? "🟢 NSFDC நுண்கடன் திட்டத்திற்கு ஏற்றது (₹1.40L வரை @ 5% வட்டி)" : "🟢 Fits NSFDC Micro Finance Scheme (≤ ₹1.40L @ 5% Rate)")}
                {profile.estimated_cost > 140000 && profile.estimated_cost <= 5000000 && (lang === 'ta' ? "🏢 NSFDC தொழில் கடன் திட்டத்திற்கு ஏற்றது (₹50.00L வரை @ 6.5% வட்டி)" : "🏢 Fits NSFDC Term Loan Scheme (≤ ₹50.00L @ 6.5% Rate)")}
                {profile.estimated_cost > 5000000 && (lang === 'ta' ? "🚀 ஸ்டாண்ட்-அப் இந்தியா பெருந்தொழில் கடன்" : "🚀 Fits Stand-Up India Large Venture Loan")}
              </span>
            </div>
          </div>
        </div>

        {/* ROW 2: Personal Profile */}
        <div className="space-y-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {t?.section_personal || "2. Beneficiary Details"}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t?.label_name || "Full Name"}</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t?.label_age || "Age"}</label>
              <input
                type="number"
                min="18"
                max="75"
                value={profile.age}
                onChange={(e) => setProfile({ ...profile, age: parseInt(e.target.value) || 18 })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t?.label_gender || "Gender"}</label>
              <select
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Male">{lang === 'ta' ? "ஆண் (Male)" : "Male"}</option>
                <option value="Female">{lang === 'ta' ? "பெண் (Female - 4% சிறப்பு சலுகை)" : "Female (Special 4% Subsidies)"}</option>
                <option value="Transgender">{lang === 'ta' ? "மூன்றாம் பாலினம்" : "Transgender"}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t?.label_caste || "Caste / Category"}</label>
              <select
                value={profile.caste}
                onChange={(e) => setProfile({ ...profile, caste: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="SC">{lang === 'ta' ? "பட்டியலினத்தவர் (SC - முதன்மை தகுதி)" : "Scheduled Caste (SC - Primary Focus)"}</option>
                <option value="ST">{lang === 'ta' ? "பழங்குடியினர் (ST)" : "Scheduled Tribe (ST)"}</option>
                <option value="OBC">{lang === 'ta' ? "பிற்படுத்தப்பட்டோர் (OBC)" : "Other Backward Class (OBC)"}</option>
                <option value="General">{lang === 'ta' ? "பொதுப் பிரிவு (General)" : "General / EWS"}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t?.label_edu || "Education Status"}</label>
              <select
                value={profile.education_status}
                onChange={(e) => setProfile({ ...profile, education_status: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {educationLevels.map((edu) => (
                  <option key={edu} value={edu}>{edu}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t?.label_income || "Annual Family Income (₹)"}</label>
              <input
                type="number"
                step="10000"
                value={profile.annual_income}
                onChange={(e) => setProfile({ ...profile, annual_income: parseInt(e.target.value) || 0 })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                {profile.annual_income <= 500000 ? (lang === 'ta' ? "✓ ≤ ₹5.00L (100% குறைந்த வட்டி தகுதி)" : "✓ ≤ ₹5.00L (100% Concessional Eligible)") : "⚠️ Exceeds ₹5L Cap"}
              </span>
            </div>
          </div>
        </div>

        {/* ROW 3: District */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t?.label_district || "District (For Partner Routing)"}</label>
            <select
              value={profile.district}
              onChange={(e) => setProfile({ ...profile, district: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Tiruchirappalli">Tiruchirappalli (திருச்சி)</option>
              <option value="Madurai">Madurai (மதுரை)</option>
              <option value="Salem">Salem (சேலம்)</option>
              <option value="Coimbatore">Coimbatore (கோயம்புத்தூர்)</option>
              <option value="Chennai">Chennai (சென்னை)</option>
              <option value="Thanjavur">Thanjavur (தஞ்சாவூர்)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">{t?.label_occupation || "Current Occupation / Trade"}</label>
            <input
              type="text"
              value={profile.occupation}
              onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* ROW 4: Documents Checklist */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            {t?.label_docs || "Available KYC & Verification Documents:"}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableDocs.map((doc) => {
              const isChecked = (profile.documents || []).includes(doc);
              return (
                <button
                  type="button"
                  key={doc}
                  onClick={() => toggleDoc(doc)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition flex items-center space-x-2.5 ${
                    isChecked
                      ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                  }`}>
                    {isChecked && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <span className="truncate">{doc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
          >
            <span>{t?.btn_find_schemes || "Run Smart Scheme Recommender & Financial Match"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
}
