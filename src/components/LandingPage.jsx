import React from 'react';
import { 
  Sparkles, ArrowRight, ShieldCheck, Building2, Users, 
  CheckCircle2, TrendingUp, Landmark, Award, MapPin, 
  Calculator, Bot, Radio, Laptop, FileText, Zap, Mic, Camera
} from 'lucide-react';
import { motion } from 'framer-motion';

export function LandingPage({ 
  lang = "en", 
  setLang, 
  t, 
  onNavigate 
}) {
  const isTa = lang === "ta";

  return (
    <div className="w-full bg-slate-50/70 text-slate-900 animate-fadeIn">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-16 sm:pb-24">
        
        {/* National Portal Emblem Badge */}
        <div className="text-center max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-blue-50 text-blue-900 px-4 py-1.5 rounded-full text-xs font-black border border-blue-200/80 shadow-xs mb-6"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>
              {isTa 
                ? "சமூக நீதி & அதிகாரமளித்தல் அமைச்சகம் • Problem Statement SIH26092" 
                : "Ministry of Social Justice & Empowerment • Problem Statement SIH26092"}
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14] mb-6"
          >
            {isTa 
              ? "விளிம்புநிலை தொழில்முனைவோருக்கான AI அரசு நலத்திட்ட வழிகாட்டி" 
              : "AI-Powered Multilingual Micro-Entrepreneur Scheme Matching Engine"}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto mb-10"
          >
            {isTa 
              ? "தெருவோர வியாபாரிகள், கைவினைஞர்கள் மற்றும் பட்டியலின சிறு வணிகர்களுக்கான 20+ மத்திய மற்றும் மாநில அரசு சலுகைக் கடன்களை துல்லியமாக கண்டறியுங்கள். நிகழ்நேர அரசு நிர்வாக இணைப்புடன் (Alpha Portal) இணைக்கப்பட்டுள்ளது."
              : "Discover verified government concessional micro-credit (≤₹1.40L), term loans (≤₹50L), and 35% capital subsidies in under 2 minutes with voice-to-text input, OCR verification, and real-time ministry sync."}
          </motion.p>

          {/* Core Multi-Page CTAs */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
          >
            
            {/* Primary CTA: Find Eligible Schemes */}
            <button
              onClick={() => onNavigate("find-schemes")}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-sm rounded-2xl shadow-xl hover:shadow-2xl transition flex items-center justify-center space-x-3 group transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{isTa ? "திட்டங்களைக் கண்டறியவும் (Find Schemes)" : "Find Eligible Schemes"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition" />
            </button>

            {/* Split Screen Demo View CTA */}
            <button
              onClick={() => onNavigate("demo-split")}
              className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center space-x-2.5 border border-slate-700"
            >
              <Laptop className="w-4 h-4 text-emerald-400" />
              <span>{isTa ? "நடுவர் நேரடி செயல்விளக்கம் (Split Demo)" : "Judge Pitch Split-Screen View"}</span>
            </button>

            {/* Alpha Portal Console CTA */}
            <button
              onClick={() => onNavigate("alpha-portal")}
              className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold text-xs rounded-2xl shadow-sm transition flex items-center justify-center space-x-2"
            >
              <Radio className="w-4 h-4 text-indigo-600 animate-pulse" />
              <span>{isTa ? "அரசு நிர்வாக முகப்பு (Alpha Portal)" : "Alpha Portal Admin Console"}</span>
            </button>

          </motion.div>

          {/* Quick Input Features Featurettes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left mb-16">
            
            {/* Feature 1: Voice-to-Text */}
            <div 
              onClick={() => onNavigate("find-schemes")}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-wider mb-1">
                  {isTa ? "குரல் வழி உள்ளீடு" : "Voice-to-Text Module"}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">
                  {isTa ? "தாய்மொழியில் பேசி விண்ணப்பிக்க" : "Speak Details in Your Mother Tongue"}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {isTa 
                    ? "தமிழ் அல்லது ஆங்கிலத்தில் உங்கள் வயது, தொழில், வருமானத்தை பேசினால் படிவம் தானாக நிரம்பும்."
                    : "Speak your age, sector, and income into the mic to auto-populate the 7-parameter eligibility form in seconds."}
                </p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600">
                <span>{isTa ? "குரல் வழியை தொடங்க" : "Try Voice Intake"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Feature 2: OCR Document Auto-Fill */}
            <div 
              onClick={() => onNavigate("find-schemes")}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black text-indigo-600 uppercase tracking-wider mb-1">
                  {isTa ? "ஆவண ஸ்கேனர் (OCR)" : "Client-Side OCR Scanning"}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">
                  {isTa ? "ஆதார் / சாதி அட்டை ஸ்கேன்" : "Aadhaar & ID Auto-Extraction"}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {isTa 
                    ? "ஆதார் அல்லது ரேஷன் அட்டையை பதிவேற்றி 5 நொடிகளில் வயது, முகவரி மற்றும் பெயரை பிரித்தெடுக்கலாம்."
                    : "Upload citizen ID cards to automatically parse Name, Age, and Area using in-browser Tesseract OCR."}
                </p>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-600">
                <span>{isTa ? "ஆவணத்தை ஸ்கேன் செய்ய" : "Scan ID Card"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Feature 3: Realtime Alpha Portal Sync */}
            <div 
              onClick={() => onNavigate("demo-split")}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-400 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <Radio className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1">
                  {isTa ? "நிகழ்நேர அமைச்சக இணைப்பு" : "Live Ministry Sync"}
                </div>
                <h3 className="text-base font-black text-slate-900 mb-2">
                  {isTa ? "உடனடி அன்லாக் (Live Unlock)" : "Dynamic Realtime Card Unlocking"}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">
                  {isTa 
                    ? "அரசு கொள்கை மாற்றங்கள் நிகழ்நேரத்தில் ஸ்ட்ரீம் செய்யப்பட்டு தகுதி நிலையை உடனடியாக மாற்றுகிறது."
                    : "When ministries adjust age or income caps in Alpha Portal, SchemeConnect unlocks frozen cards live without refresh."}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate("demo-split");
                }}
                className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-800 transition cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl w-fit"
              >
                <span>{isTa ? "செயல்விளக்கத்தை பார்க்க" : "View Live Sync"}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </button>
            </div>

          </div>

        </div>

        {/* Live National Welfare Statistics Bar */}
        <div className="border-t border-slate-200 pt-10 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">20+</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">{isTa ? "அங்கீகரிக்கப்பட்ட அரசு திட்டங்கள்" : "Active Welfare Schemes"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 block">5.0% – 8.0%</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">{isTa ? "சலுகை வட்டி விகிதங்கள்" : "Concessional Rates"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">&lt; 10ms</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">{isTa ? "நிகழ்நேர நேரலை இணைப்பு" : "WebSocket Sync Latency"}</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 block">100%</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase">{isTa ? "துல்லியமான விதிமுறை பொருத்தம்" : "Deterministic Accuracy"}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
