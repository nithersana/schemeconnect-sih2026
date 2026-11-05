import React, { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, Building2,
  FileText, Lock, Globe, ChevronRight, Users, X
} from 'lucide-react';
import { grantConsent } from '../config/portalConfig';

// ─── Trilingual Consent Content ────────────────────────────────────────────
const CONSENT_CONTENT = {
  en: {
    badge: "Ministry of Social Justice & Empowerment • MoSJE • SIH26092",
    title: "Terms, Privacy & Data Consent",
    subtitle: "SchemeConnect — AI-Powered Welfare Scheme Discovery Portal",
    intro: "Before accessing the Scheme Discovery Engine, please read and provide your explicit consent to the following terms as mandated by the IT Act 2000, Digital Personal Data Protection Act 2023, and MoSJE e-Governance guidelines.",
    section1: "Section 1: Identity Verification (eKYC)",
    s1_body: "I authorize SchemeConnect to simulate a DigiLocker-linked eKYC verification using my submitted Aadhaar/PAN details for pre-screening purposes only. No biometric data is collected or retained.",
    section2: "Section 2: Data Privacy & Usage",
    s2_body: "I consent to SchemeConnect processing my demographic and income data (age, area, sector, income, SHG status, gender, caste) solely to match eligible Central and State government welfare schemes. Data is not sold, shared, or retained beyond the session.",
    section3: "Section 3: Bank Referral Token Authorization",
    s3_body: "I authorize SchemeConnect to issue a signed, time-limited JWT referral token (valid 15 minutes) containing my pre-verified eligibility details to a partner bank of my choice upon request. I understand I may withdraw this consent at any time before token generation.",
    cb1: "I consent to simulated eKYC identity pre-verification for scheme eligibility checking.",
    cb2: "I consent to session-only processing of my demographic data for welfare scheme discovery.",
    cb3: "I authorize issuance of a signed JWT referral token to a partner bank upon my explicit request.",
    accept: "Accept All & Begin Intake →",
    decline: "I do not consent (Exit)",
    privacy_ref: "Data Privacy Reference: DPDPA 2023 • IT Act Section 43A",
    grievance: "Grievance Officer: scheme-connect-grievance@mosje.gov.in",
    processing: "Please check all 3 consent boxes to continue.",
  },
  ta: {
    badge: "சமூக நீதி மற்றும் அதிகாரமளிப்பு அமைச்சகம் • SIH26092",
    title: "விதிமுறைகள், தனியுரிமை மற்றும் தரவு சம்மதம்",
    subtitle: "திட்டங்கள் இணைப்பு — AI-இயக்கும் நலத்திட்ட கண்டுபிடிப்பு போர்டல்",
    intro: "திட்டத்தைத் தேடுவதற்கு முன், IT சட்டம் 2000, டிஜிட்டல் தனிப்பட்ட தரவு பாதுகாப்பு சட்டம் 2023 மற்றும் MoSJE ஆட்சி வழிகாட்டுதல்களின்படி கீழ்க்கண்ட விதிமுறைகளை படிக்கவும் மற்றும் உங்கள் வெளிப்படையான சம்மதத்தை வழங்கவும்.",
    section1: "பிரிவு 1: அடையாள சரிபார்ப்பு (eKYC)",
    s1_body: "DigiLocker இணைக்கப்பட்ட eKYC மூலம் திட்டத்திற்கான முன் தகுதி சரிபார்ப்புக்காக என் ஆதார்/PAN விவரங்களைப் பயன்படுத்த அனுமதிக்கிறேன். எந்த உயிர் அடையாள தரவும் சேகரிக்கப்படுவதில்லை.",
    section2: "பிரிவு 2: தரவு தனியுரிமை",
    s2_body: "என் வயது, பகுதி, துறை, வருமானம், சுயஉதவிக்குழு நிலை, பாலினம், சாதி ஆகிய விவரங்களை அரசு நலத்திட்டங்களை பொருத்துவதற்கு மட்டும் செயலாக்க சம்மதிக்கிறேன். தரவு விற்கப்படுவதில்லை அல்லது அமர்வுக்கு அப்பால் வைக்கப்படுவதில்லை.",
    section3: "பிரிவு 3: வங்கி பரிந்துரை டோக்கன் அங்கீகாரம்",
    s3_body: "என் தகுதி விவரங்களை கொண்ட கையொப்பமிடப்பட்ட, 15 நிமிட கால வரம்புள்ள JWT டோக்கனை என் விருப்பமான கூட்டாளி வங்கிக்கு வழங்க SchemeConnect-க்கு அங்கீகரிக்கிறேன்.",
    cb1: "திட்டத் தகுதி சரிபார்ப்புக்காக eKYC அடையாள முன் சரிபார்ப்புக்கு சம்மதிக்கிறேன்.",
    cb2: "நலத்திட்ட கண்டுபிடிப்புக்காக என் ஜனவிழி தரவை அமர்வுக்கு மட்டும் செயலாக்க சம்மதிக்கிறேன்.",
    cb3: "என் வெளிப்படையான கோரிக்கையின் பேரில் கூட்டாளி வங்கிக்கு கையொப்பமிடப்பட்ட JWT பரிந்துரை டோக்கனை வழங்க அங்கீகரிக்கிறேன்.",
    accept: "அனைத்தையும் ஏற்றுக்கொண்டு தொடரவும் →",
    decline: "சம்மதிக்கவில்லை (வெளியேறு)",
    privacy_ref: "தனியுரிமை குறிப்பு: DPDPA 2023 • IT சட்டம் பிரிவு 43A",
    grievance: "புகார் அலுவலர்: scheme-connect-grievance@mosje.gov.in",
    processing: "தொடர அனைத்து 3 சம்மத பெட்டிகளையும் சரிபார்க்கவும்.",
  },
  hi: {
    badge: "सामाजिक न्याय एवं अधिकारिता मंत्रालय • SIH26092",
    title: "नियम, गोपनीयता और डेटा सहमति",
    subtitle: "स्कीमकनेक्ट — AI-संचालित कल्याण योजना खोज पोर्टल",
    intro: "योजना खोज इंजन तक पहुँचने से पहले, कृपया IT अधिनियम 2000, डिजिटल व्यक्तिगत डेटा संरक्षण अधिनियम 2023 और MoSJE ई-गवर्नेंस दिशानिर्देशों के अनुसार निम्नलिखित शर्तों को पढ़ें और स्पष्ट सहमति दें।",
    section1: "धारा 1: पहचान सत्यापन (eKYC)",
    s1_body: "मैं DigiLocker से जुड़े eKYC के माध्यम से अपने आधार/PAN विवरण का उपयोग केवल पूर्व-स्क्रीनिंग उद्देश्यों के लिए करने की अनुमति देता/देती हूँ। कोई बायोमेट्रिक डेटा एकत्र या संग्रहीत नहीं किया जाता।",
    section2: "धारा 2: डेटा गोपनीयता और उपयोग",
    s2_body: "मैं केंद्र और राज्य सरकार की कल्याण योजनाओं से मिलान करने के लिए अपने जनसांख्यिकीय और आय डेटा (आयु, क्षेत्र, क्षेत्र, आय, SHG स्थिति, लिंग, जाति) को सत्र-केवल आधार पर संसाधित करने की सहमति देता/देती हूँ।",
    section3: "धारा 3: बैंक रेफरल टोकन प्राधिकरण",
    s3_body: "मैं SchemeConnect को मेरी पूर्व-सत्यापित पात्रता विवरण वाला एक हस्ताक्षरित, 15 मिनट की अवधि का JWT रेफरल टोकन, मेरे अनुरोध पर मेरे चुने हुए भागीदार बैंक को जारी करने का अधिकार देता/देती हूँ।",
    cb1: "मैं योजना पात्रता जाँच के लिए eKYC पहचान पूर्व-सत्यापन की सहमति देता/देती हूँ।",
    cb2: "मैं कल्याण योजना खोज के लिए अपने जनसांख्यिकीय डेटा को सत्र-केवल प्रसंस्करण की सहमति देता/देती हूँ।",
    cb3: "मैं अपने स्पष्ट अनुरोध पर भागीदार बैंक को हस्ताक्षरित JWT रेफरल टोकन जारी करने का अधिकार देता/देती हूँ।",
    accept: "सभी स्वीकार करें और शुरू करें →",
    decline: "मैं सहमत नहीं हूँ (बाहर जाएँ)",
    privacy_ref: "डेटा गोपनीयता संदर्भ: DPDPA 2023 • IT अधिनियम धारा 43A",
    grievance: "शिकायत अधिकारी: scheme-connect-grievance@mosje.gov.in",
    processing: "जारी रखने के लिए सभी 3 सहमति बॉक्स चेक करें।",
  }
};

export function ConsentModal({ onAccept, onDecline, initialLang = "en" }) {
  const [modalLang, setModalLang] = useState(initialLang);
  const [cb1, setCb1] = useState(false);
  const [cb2, setCb2] = useState(false);
  const [cb3, setCb3] = useState(false);

  const c = CONSENT_CONTENT[modalLang] || CONSENT_CONTENT.en;
  const allChecked = cb1 && cb2 && cb3;

  const handleAccept = () => {
    if (!allChecked) return;
    grantConsent();
    onAccept(modalLang);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-blue-200 max-h-[92vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            {/* Language Switcher inside Modal */}
            <div className="flex items-center bg-white/10 rounded-2xl p-1 gap-0.5 text-xs font-black">
              {["en", "ta", "hi"].map(l => (
                <button
                  key={l}
                  onClick={() => setModalLang(l)}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    modalLang === l
                      ? "bg-white text-blue-900 shadow"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {l === "en" ? "EN" : l === "ta" ? "தமிழ்" : "हिंदी"}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-1">
            {c.badge}
          </p>
          <h2 className="text-xl font-black text-white">{c.title}</h2>
          <p className="text-xs text-slate-300 mt-0.5">{c.subtitle}</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">

          {/* Introduction */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 font-medium leading-relaxed">
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{c.intro}</span>
            </div>
          </div>

          {/* Section 1 */}
          <ConsentSection
            number="1"
            title={c.section1}
            body={c.s1_body}
            checked={cb1}
            onChange={setCb1}
            cbLabel={c.cb1}
            color="blue"
          />

          {/* Section 2 */}
          <ConsentSection
            number="2"
            title={c.section2}
            body={c.s2_body}
            checked={cb2}
            onChange={setCb2}
            cbLabel={c.cb2}
            color="indigo"
          />

          {/* Section 3 */}
          <ConsentSection
            number="3"
            title={c.section3}
            body={c.s3_body}
            checked={cb3}
            onChange={setCb3}
            cbLabel={c.cb3}
            color="emerald"
          />

          {/* Not all checked warning */}
          {!allChecked && (
            <div className="flex items-center gap-2 text-xs text-amber-700 font-bold bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>{c.processing}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAccept}
              disabled={!allChecked}
              className={`flex-1 py-4 rounded-2xl text-sm font-black transition flex items-center justify-center gap-2 shadow-lg ${
                allChecked
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{c.accept}</span>
            </button>
            <button
              onClick={onDecline}
              className="px-5 py-4 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 rounded-2xl text-xs font-bold transition"
            >
              {c.decline}
            </button>
          </div>

          {/* Legal Footer */}
          <div className="text-center space-y-1 pt-2 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-mono">{c.privacy_ref}</p>
            <p className="text-[10px] text-slate-400">{c.grievance}</p>
          </div>

        </div>
      </div>
    </div>
  );
}

// Reusable Section Component
function ConsentSection({ number, title, body, checked, onChange, cbLabel, color }) {
  const colors = {
    blue: "border-blue-200 bg-blue-50",
    indigo: "border-indigo-200 bg-indigo-50",
    emerald: "border-emerald-200 bg-emerald-50",
  };
  const checkColors = {
    blue: checked ? "bg-blue-600 border-blue-600" : "border-slate-300",
    indigo: checked ? "bg-indigo-600 border-indigo-600" : "border-slate-300",
    emerald: checked ? "bg-emerald-600 border-emerald-600" : "border-slate-300",
  };

  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${colors[color]}`}>
      <div className="flex items-start gap-2">
        <span className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5 ${
          color === "blue" ? "bg-blue-600" : color === "indigo" ? "bg-indigo-600" : "bg-emerald-600"
        } text-white`}>
          {number}
        </span>
        <div>
          <h4 className="text-xs font-black text-slate-900 mb-1">{title}</h4>
          <p className="text-xs text-slate-600 leading-relaxed">{body}</p>
        </div>
      </div>
      {/* Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          onClick={() => onChange(!checked)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition ${checkColors[color]}`}
        >
          {checked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
        </div>
        <span
          onClick={() => onChange(!checked)}
          className="text-xs font-semibold text-slate-800 leading-relaxed"
        >
          {cbLabel}
        </span>
      </label>
    </div>
  );
}
