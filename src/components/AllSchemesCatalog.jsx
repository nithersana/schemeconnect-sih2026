import React, { useState } from 'react';
import { 
  Building2, Search, Filter, Sparkles, ExternalLink, 
  ArrowRight, Calculator, ShieldCheck, Landmark, CheckCircle2,
  Clock, IndianRupee, Radio, FileText, Check
} from 'lucide-react';
import { getAlphaSchemes } from '../utils/realtimeSync';
import { AlphaGazetteModal } from './AlphaGazetteModal';

export function AllSchemesCatalog({ 
  lang = "en", 
  t, 
  onStartIntake, 
  onOpenCalculator,
  onOpenAlphaPortal
}) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  const [schemes, setSchemes] = useState(getAlphaSchemes());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [selectedGazetteScheme, setSelectedGazetteScheme] = useState(null);

  const categories = [
    { id: "ALL", label: L("All Schemes (20)", "அனைத்து திட்டங்கள் (20)", "सभी योजनाएँ (20)") },
    { id: "MICRO", label: L("Micro Finance (≤₹1.40L)", "நுண்கடன் (≤₹1.40L)", "सूक्ष्म वित्त (≤₹1.40L)") },
    { id: "TERM", label: L("Term Loans (≤₹50L)", "தொழில் கடன் (≤₹50L)", "मियादी ऋण (≤₹50L)") },
    { id: "WOMEN", label: L("Women-Centric", "மகளிர் பிரத்யேக திட்டம்", "महिला-केंद्रित") },
    { id: "ARTISAN", label: L("Artisan & Handicraft", "கைவினைஞர் & விஸ்வகர்மா", "कारीगर एवं हस्तशिल्प") },
    { id: "MSME", label: L("Manufacturing & MSME", "உற்பத்தி & MSME", "विनिर्माण एवं MSME") },
  ];

  const filteredSchemes = schemes.filter(s => {
    // Category match
    let matchCat = true;
    if (activeCategory === "MICRO") matchCat = Number(s.sanctioned_amount) <= 140000;
    else if (activeCategory === "TERM") matchCat = Number(s.sanctioned_amount) > 140000;
    else if (activeCategory === "WOMEN") matchCat = s.gender === "Women" || s.shg_membership === "Mandatory";
    else if (activeCategory === "ARTISAN") matchCat = s.sector === "Handicraft/Artisan";
    else if (activeCategory === "MSME") matchCat = s.sector === "Manufacturing" || s.sector === "Services";

    // Search query match
    let matchSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchSearch = (s.scheme_name || "").toLowerCase().includes(q) ||
        (s.scheme_name_ta || "").toLowerCase().includes(q) ||
        (s.scheme_name_hi || "").toLowerCase().includes(q) ||
        (s.ministry || "").toLowerCase().includes(q) ||
        (s.sector || "").toLowerCase().includes(q) ||
        (s.scheme_id || "").toLowerCase().includes(q);
    }

    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Gazette Modal */}
      {selectedGazetteScheme && (
        <AlphaGazetteModal
          scheme={selectedGazetteScheme}
          lang={lang}
          onClose={() => setSelectedGazetteScheme(null)}
        />
      )}

      {/* Directory Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-400/30 mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>{L("Official Statutory Welfare Schemes Directory", "அரசு அங்கீகரிக்கப்பட்ட நலத்திட்டங்கள் தொகுப்பு", "आधिकारिक सांविधिक कल्याणकारी योजना निर्देशिका")}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {L("ALL SCHEMES CATALOG", "அனைத்து திட்டங்கள்", "सभी योजनाएँ निर्देशिका")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {L(
                "Browse all 20 central and state government concessional micro-credit and term loan schemes. Complete your applicant intake to calculate personalized eligibility and direct bank sanctioning.",
                "அனைத்து 20 மத்திய மற்றும் மாநில அரசு சலுகைக் கடன் திட்டங்களை இங்கே காணலாம். உங்களுக்கான தகுதியை சரிபார்க்க புதிய விண்ணப்பதாரர் பதிவை தொடங்கவும்.",
                "सभी 20 केंद्रीय एवं राज्य सरकार की रियायती सूक्ष्म-ऋण और मियादी ऋण योजनाएँ देखें। अपनी व्यक्तिगत पात्रता जाँचने के लिए आवेदक पंजीकरण करें।"
              )}
            </p>
          </div>

          {/* Action Box: Start Intake CTA */}
          <div className="bg-white/10 p-5 rounded-2xl border border-white/10 shrink-0 text-center sm:text-left">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
              {L("Check Personal Eligibility", "உங்கள் தகுதியை சரிபார்க்க", "अपनी व्यक्तिगत पात्रता जांचें")}
            </span>
            <p className="text-xs text-slate-200 mb-3">
              {L("Use Voice, OCR, or manual input", "குரல் அல்லது OCR மூலம் பதிவு செய்க", "वॉयस, OCR या फ़ॉर्म द्वारा दर्ज करें")}
            </p>
            <button
              onClick={onStartIntake}
              className="w-full py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{L("Start Applicant Input Form ➔", "விண்ணப்ப படிவத்தை தொடங்குக ➔", "आवेदक इनपुट फ़ॉर्म शुरू करें ➔")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-indigo-900 text-white shadow-xs font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={L("Search scheme name, ministry, or sector...", "திட்டம், அமைச்சகம் அல்லது தொழிலை தேடுக...", "योजना का नाम, मंत्रालय या क्षेत्र खोजें...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* Schemes Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-bold mb-4 px-1">
        <span>{L(`Displaying ${filteredSchemes.length} of ${schemes.length} schemes`, `மொத்தம் ${schemes.length}-இல் ${filteredSchemes.length} திட்டங்கள்`, `${schemes.length} में से ${filteredSchemes.length} योजनाएँ प्रदर्शित`)}</span>
        <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          {L("Statutory Central & State Schemes", "அரசு சலுகை திட்டங்கள்", "सांविधिक सरकारी योजनाएँ")}
        </span>
      </div>

      {/* 20 Schemes Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => {
          const displayName = isHi && scheme.scheme_name_hi
            ? scheme.scheme_name_hi
            : isTa && scheme.scheme_name_ta
            ? scheme.scheme_name_ta
            : scheme.scheme_name;

          const description = isHi && scheme.description_hi
            ? scheme.description_hi
            : isTa && scheme.description_ta
            ? scheme.description_ta
            : scheme.description;

          const badge = isHi && scheme.highlight_badge_hi
            ? scheme.highlight_badge_hi
            : isTa && scheme.highlight_badge_ta
            ? scheme.highlight_badge_ta
            : scheme.highlight_badge;

          return (
            <div
              key={scheme.scheme_id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-indigo-300 transition flex flex-col justify-between"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    {scheme.scheme_id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {scheme.concessional_interest_rate || 5.0}% p.a.
                  </span>
                </div>

                {/* Scheme Title */}
                <h3 className="font-black text-sm text-slate-900 leading-snug mb-1">
                  {displayName}
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mb-3">
                  {scheme.ministry}
                </p>

                {/* Highlight Badge */}
                {badge && (
                  <div className="inline-block text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg mb-3">
                    {badge}
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
                  {description}
                </p>

                {/* Specs Box */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 mb-4 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">{L("Sanction Limit", "கடன் தொகை", "ऋण सीमा")}:</span>
                    <span className="font-black text-blue-700">₹{Number(scheme.sanctioned_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">{L("Age Bracket", "வயது வரம்பு", "आयु सीमा")}:</span>
                    <span className="font-bold text-slate-800">{scheme.age_min}–{scheme.age_max} Yrs</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">{L("Target Sector", "தொழில் பிரிவு", "लक्षित क्षेत्र")}:</span>
                    <span className="font-bold text-slate-800">{scheme.sector}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">{L("Income Cap", "வருமான வரம்பு", "आय सीमा")}:</span>
                    <span className="font-bold text-slate-800">≤ ₹{Number(scheme.income_cap).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedGazetteScheme(scheme)}
                    className="flex-1 py-2 px-3 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 hover:border-indigo-300 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Building2 className="w-3 h-3 text-indigo-600" />
                    <span>{L("Verify on Gov Gazette", "அரசிதழ் சரிபார்", "सरकारी गजट")}</span>
                  </button>

                  {onOpenCalculator && (
                    <button
                      onClick={() => onOpenCalculator(scheme)}
                      className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                      title={L("Simulate EMI", "தவணை கணக்கிடுக", "EMI गणना")}
                    >
                      <Calculator className="w-3 h-3 text-emerald-600" />
                      <span>EMI</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={onStartIntake}
                  className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{L("Check My Eligibility ➔", "என் தகுதியை சோதிக்க ➔", "मेरी पात्रता जांचें ➔")}</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
