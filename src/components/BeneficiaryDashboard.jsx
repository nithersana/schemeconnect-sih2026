import React, { useState } from 'react';
import { 
  Trophy, CheckCircle2, Download, Share2, Sparkles, Filter, 
  ArrowLeft, FileText, UserCheck, Shield, ChevronRight, Search, 
  Scale, MapPin, Printer, QrCode, AlertTriangle, Lightbulb, Compass, 
  ArrowUpRight, Calculator, Bot, HelpCircle, AlertCircle, Building2, Check
} from 'lucide-react';
import { SchemeCard } from './SchemeCard';
import { SchemeModal } from './SchemeModal';
import { SchemeCompareModal } from './SchemeCompareModal';
import { DigitalApplicationPass } from './DigitalApplicationPass';
import { WhatsAppShareCard } from './WhatsAppShareCard';

export function BeneficiaryDashboard({ results, currentProfile, lang = "ta", t, onReset, onOpenCenterLocator, onOpenCalculator, onOpenCounselor, onSimulateProfile }) {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showPassModal, setShowPassModal] = useState(null);
  const [showWhatsAppCard, setShowWhatsAppCard] = useState(null);

  const [activeTag, setActiveTag] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!results) return null;

  const profile = currentProfile || results.profile || {};
  const allSchemes = results.results || results.all_ranked_schemes || [];
  const eligibleSchemes = allSchemes.filter(s => s.is_eligible);
  const topPicks = eligibleSchemes.length > 0 ? eligibleSchemes.slice(0, 3) : allSchemes.slice(0, 3);
  const isZeroEligible = eligibleSchemes.length === 0;

  const toggleCompare = (scheme) => {
    if (selectedForCompare.some(s => s.scheme_id === scheme.scheme_id)) {
      setSelectedForCompare(selectedForCompare.filter(s => s.scheme_id !== scheme.scheme_id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], scheme]);
      } else {
        setSelectedForCompare([...selectedForCompare, scheme]);
      }
    }
  };

  // Filter tags logic
  const filterTags = [
    { id: "ALL", label: lang === 'ta' ? "அனைத்து திட்டங்கள்" : "All Schemes" },
    { id: "TOP", label: lang === 'ta' ? "⭐ முதன்மை பரிந்துரைகள்" : "⭐ Top Recommendations" },
    { id: "ELIGIBLE", label: lang === 'ta' ? "✓ 100% தகுதியானவை" : "✓ 100% Eligible Only" },
    { id: "MICRO", label: lang === 'ta' ? "⚡ நுண்கடன் (≤₹1.40L)" : "⚡ Micro Finance (≤₹1.40L)" },
    { id: "TERM", label: lang === 'ta' ? "🏢 தொழில் கடன் (≤₹50L)" : "🏢 Term Loans (≤₹50L)" },
    { id: "EDU", label: lang === 'ta' ? "🎓 கல்வி கடன்" : "🎓 Education Loans" }
  ];

  const filteredSchemes = allSchemes.filter(s => {
    let matchesTag = true;
    if (activeTag === 'TOP') matchesTag = topPicks.some(tp => tp.scheme_id === s.scheme_id);
    else if (activeTag === 'ELIGIBLE') matchesTag = s.is_eligible;
    else if (activeTag === 'MICRO') matchesTag = s.scheme_type === 'Micro Finance' || s.max_loan_limit <= 140000;
    else if (activeTag === 'TERM') matchesTag = s.scheme_type === 'Term Loan' || s.max_loan_limit > 140000;
    else if (activeTag === 'EDU') matchesTag = s.category?.toLowerCase().includes('education') || s.id === 'NSFDC_EDU_LOAN';

    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch = s.scheme_name.toLowerCase().includes(q) || 
        s.ministry.toLowerCase().includes(q) || 
        s.description.toLowerCase().includes(q) ||
        s.benefit_amount.toLowerCase().includes(q);
    }

    return matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <button
          onClick={onReset}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{lang === 'ta' ? "புதிய விவரப் பதிவு" : "New Profile Intake"}</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* Official Pass Generator Button */}
          <button
            onClick={() => setShowPassModal(topPicks[0] || allSchemes[0])}
            className="inline-flex items-center space-x-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl shadow-sm transition"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>{lang === 'ta' ? "பயனாளி அனுமதி சீட்டு" : "Generate Beneficiary Pass"}</span>
          </button>

          {/* Center Locator Button */}
          <button
            onClick={onOpenCenterLocator}
            className="inline-flex items-center space-x-1.5 text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl shadow-xs transition"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{lang === 'ta' ? "தாட்கோ & வங்கி கிளைகள்" : "Find SCA & Bank Partners"}</span>
          </button>
        </div>
      </div>

      {/* Hero Beneficiary Summary Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-400/30 mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ta' ? "சரிபார்க்கப்பட்ட பயனாளி சுயவிவரம்" : "Verified Beneficiary Profile"}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {profile.name || "Beneficiary"} ({profile.age || 35} {lang === 'ta' ? "வயது" : "yrs"})
            </h1>

            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              <span className="bg-white/10 px-3 py-1 rounded-xl font-semibold border border-white/10">
                {profile.caste || "SC"} {lang === 'ta' ? "பிரிவு" : "Category"}
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-xl font-semibold border border-white/10">
                ₹{Number(profile.annual_income || 180000).toLocaleString('en-IN')} / {lang === 'ta' ? "ஆண்டு வருமானம்" : "Yr"}
              </span>
              <span className="bg-white/10 px-3 py-1 rounded-xl font-semibold border border-white/10">
                {profile.district || "Tiruchirappalli"}, {profile.state || "Tamil Nadu"}
              </span>
              <span className="bg-blue-600/60 px-3 py-1 rounded-xl font-semibold border border-blue-400/40">
                {profile.project_type || "Micro Business"} (₹{Number(profile.estimated_cost || 140000).toLocaleString('en-IN')})
              </span>
            </div>
          </div>

          {/* Readiness & Matches Score Box */}
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 shrink-0">
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-3xl font-black text-emerald-400 block">
                {topPicks[0]?.readiness_score || (isZeroEligible ? 45 : 85)}%
              </span>
              <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">
                {lang === 'ta' ? "தகுதி மதிப்பெண்" : "Readiness Score"}
              </span>
            </div>
            <div className="text-center px-3">
              <span className={`text-3xl font-black block ${isZeroEligible ? 'text-amber-400' : 'text-blue-400'}`}>
                {eligibleSchemes.length}
              </span>
              <span className="text-[11px] text-slate-300 font-bold uppercase tracking-wider">
                {lang === 'ta' ? "பொருத்தமான திட்டங்கள்" : "Eligible Schemes"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🚀 CASE 1: WHEN 0 SCHEMES ELIGIBLE - VALID DETAILS BASED ON CURRENT ASSETS */}
      {/* ========================================================================= */}
      {isZeroEligible && (
        <div className="mb-10 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-indigo-500/15 border-2 border-amber-400 rounded-3xl p-6 sm:p-8 shadow-xl animate-fadeIn">
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-md">
              <AlertCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-3 py-1 rounded-full border border-amber-300">
                {lang === 'ta' ? "தற்போது உள்ள விவரங்களுக்கான AI தீர்வு & வாய்ப்புகள்" : "Valid Opportunities Based on What You Have Right Now"}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {lang === 'ta' ? "சலுகைக் கடன் வரம்பிற்கு அப்பால் நீங்கள் பயன்பெறக்கூடிய திட்டங்கள்" : "Government Financing Options Available for Your Current Profile"}
              </h2>
            </div>
          </div>

          <div className="p-4 bg-white/90 rounded-2xl border border-amber-200 mb-6 text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-amber-900 block mb-1">
              📌 {lang === 'ta' ? "உங்கள் தற்போதைய விவரங்களின் சுருக்கம்:" : "Summary of Your Current Inventory:"}
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-medium">
              <div>• {lang === 'ta' ? "ஆண்டு வருமானம்:" : "Annual Income:"} <b>₹{Number(profile.annual_income || 0).toLocaleString('en-IN')}</b></div>
              <div>• {lang === 'ta' ? "சாதி/பிரிவு:" : "Caste Category:"} <b>{profile.caste || "General"}</b></div>
              <div>• {lang === 'ta' ? "தொழில் திட்டம்:" : "Project Type:"} <b>{profile.project_type || "Trade"}</b></div>
              <div>• {lang === 'ta' ? "கைவசம் உள்ள ஆவணங்கள்:" : "Available Docs:"} <b>{(profile.documents || []).length} {lang === 'ta' ? "ஆவணங்கள்" : "Docs"}</b></div>
            </div>
          </div>

          {/* Valid Alternate Schemes Table/Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            
            {/* Alt 1: PMEGP */}
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">KVIC / MSME</span>
                  <span className="text-[10px] font-bold text-emerald-700">15%–35% மானியம்</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">PMEGP தொழில் திட்டம்</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {lang === 'ta'
                    ? "குடும்ப வருமான உச்சவரம்பு கிடையாது. உற்பத்தி பிரிவிற்கு ₹50 லட்சம் வரை மற்றும் சேவை பிரிவிற்கு ₹20 லட்சம் வரை அரசு மூலதன மானியத்துடன் கடன் பெறலாம்."
                    : "No family income ceiling. Loans up to ₹50 Lakhs (Manufacturing) and ₹20 Lakhs (Services) with 15%–35% direct government capital subsidy."}
                </p>
              </div>
              <a
                href="https://www.kviconline.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline"
              >
                <span>{lang === 'ta' ? "PMEGP இணையதளத்தில் விண்ணப்பிக்க" : "Apply on PMEGP Portal"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Alt 2: MUDRA */}
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">DFS / MoF</span>
                  <span className="text-[10px] font-bold text-emerald-700">₹10 Lakhs Limit</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">பிரதான் மந்திரி முத்ரா கடன் (MUDRA)</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {lang === 'ta'
                    ? "எந்தவித சாதி அல்லது வருமான சான்றிதழ் இன்றி, ஆதார் மற்றும் வங்கி கணக்கு மூலம் ₹50,000 முதல் ₹10 லட்சம் வரை பிணையமில்லா கடன் பெறலாம்."
                    : "Collateral-free credit up to ₹10 Lakhs across Shishu, Kishore, and Tarun categories without strict caste or income ceilings."}
                </p>
              </div>
              <a
                href="https://www.mudra.org.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline"
              >
                <span>{lang === 'ta' ? "முத்ரா கடன் வழிகாட்டி" : "MUDRA Bank Guidelines"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Alt 3: CGTMSE */}
            <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded">Credit Guarantee</span>
                  <span className="text-[10px] font-bold text-purple-700">Up to ₹2 Crore</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">CGTMSE அரசு உத்தரவாத கடன்</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                  {lang === 'ta'
                    ? "உத்யாம் (Udyam) பதிவு செய்த சிறு நிறுவனங்களுக்கு எந்த சொத்து அடமானமும் இன்றி மத்திய அரசு 85% உத்தரவாதத்துடன் வங்கி கடன் வழங்குகிறது."
                    : "Govt of India credit guarantee covering up to 85% of loans up to ₹2 Crores for registered MSMEs without third-party collateral."}
                </p>
              </div>
              <a
                href="https://udyamregistration.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-purple-600 flex items-center gap-1 hover:underline"
              >
                <span>{lang === 'ta' ? "இலவச உத்யாம் பதிவு (10 நிமிடம்)" : "Free Udyam MSME Registration"}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 items-center">
            <button
              onClick={onOpenCounselor}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition shadow-md"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              <span>{lang === 'ta' ? "AI மித்ராவிடம் எனது விவரங்களுக்கான மாற்று திட்டங்களை கேட்க" : "Ask AI Mitra for Personalized Advice"}</span>
            </button>

            <button
              onClick={onOpenCalculator}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold flex items-center gap-2 transition shadow-md"
            >
              <Calculator className="w-4 h-4 text-blue-200" />
              <span>{lang === 'ta' ? "MUDRA & PMEGP தவணையை கணக்கிட" : "Simulate Alternate EMIs in Calculator"}</span>
            </button>
          </div>

        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
          {filterTags.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTag(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTag === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full lg:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={lang === 'ta' ? "திட்டம் அல்லது துறையை தேடுக..." : "Search scheme or department..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <SchemeCard
            key={scheme.scheme_id || scheme.id}
            scheme={scheme}
            lang={lang}
            onSelect={(s) => setSelectedScheme(s)}
            onToggleCompare={toggleCompare}
            isCompared={selectedForCompare.some(c => (c.scheme_id || c.id) === (scheme.scheme_id || scheme.id))}
          />
        ))}
      </div>

      {/* Floating Compare Drawer */}
      {selectedForCompare.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-4 border border-slate-700 animate-fadeIn">
          <div className="text-xs font-bold">
            <span>{selectedForCompare.length} {lang === 'ta' ? "திட்டங்கள் தேர்வு செய்யப்பட்டுள்ளன" : "Schemes selected for comparison"}</span>
          </div>
          <button
            onClick={() => setShowCompareModal(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition flex items-center gap-1"
          >
            <span>{lang === 'ta' ? "ஒப்பிட்டு பார்க்க" : "Compare Now"}</span>
            <Scale className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSelectedForCompare([])}
            className="text-xs text-slate-400 hover:text-white font-semibold"
          >
            {lang === 'ta' ? "நீக்குக" : "Clear"}
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedScheme && (
        <SchemeModal
          scheme={selectedScheme}
          lang={lang}
          onClose={() => setSelectedScheme(null)}
          onShareWhatsApp={(s) => setShowWhatsAppCard(s)}
        />
      )}

      {showCompareModal && selectedForCompare.length > 0 && (
        <SchemeCompareModal
          schemes={selectedForCompare}
          lang={lang}
          onClose={() => setShowCompareModal(false)}
        />
      )}

      {showPassModal && (
        <DigitalApplicationPass
          scheme={showPassModal}
          profile={profile}
          lang={lang}
          onClose={() => setShowPassModal(null)}
        />
      )}

      {showWhatsAppCard && (
        <WhatsAppShareCard
          scheme={showWhatsAppCard}
          profile={profile}
          lang={lang}
          onClose={() => setShowWhatsAppCard(null)}
        />
      )}

    </div>
  );
}
