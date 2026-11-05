import React from 'react';
import { Building2, Bot } from 'lucide-react';

export function Navbar({ lang = "en", setLang, t, view, setView, isOnline, fontSize, setFontSize, onLogoClick }) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";

  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">

          {/* Brand Logo — clicks to reset session */}
          <div
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={onLogoClick || (() => setView('find-schemes'))}
            title="Reset session & return home"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center shadow-xs">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-lg text-slate-900 tracking-tight group-hover:text-[#1e3a8a] transition">
                  SchemeConnect
                </span>
                <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200/80">
                  SIH26092
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                {L(
                  "Ministry of Social Justice & Empowerment • Government of India",
                  "சமூக நீதி மற்றும் அதிகாரமளித்தல் அமைச்சகம் • இந்திய அரசு",
                  "सामाजिक न्याय एवं अधिकारिता मंत्रालय • भारत सरकार"
                )}
              </p>
            </div>
          </div>

          {/* Right Controls: Language Switcher and AI Mitra */}
          <div className="flex items-center space-x-3 shrink-0">
            
            {/* Clean Trilingual Selector */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              {[
                { code: "en", label: "English" },
                { code: "ta", label: "தமிழ்" },
                { code: "hi", label: "हिंदी" }
              ].map(({ code, label }) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                    lang === code
                      ? 'bg-white text-[#1e3a8a] shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* AI Mitra Counselor Access */}
            <button
              type="button"
              onClick={() => setView('counselor')}
              className={`p-2 rounded-xl transition cursor-pointer ${
                view === 'counselor'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
              title="AI Mitra Welfare Advisor"
            >
              <Bot className="w-4 h-4" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
export default Navbar;
