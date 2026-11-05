import React, { useState, useEffect } from 'react';
import { 
  Building2, Radio, ExternalLink, ShieldCheck, 
  FileText, Settings, Search, CheckCircle2, Lock, Unlock, 
  Sparkles, RefreshCw, Landmark, ArrowRight, X, Printer, IndianRupee, Database
} from 'lucide-react';
import { AlphaGazetteModal } from './components/AlphaGazetteModal';
import { 
  getAlphaSchemes, updateAlphaScheme, resetAlphaSchemes, 
  triggerQuickDemo, subscribeToAlphaChanges 
} from './utils/realtimeSync';
import { navigateToSchemeConnect } from './config/portalConfig';

export function AlphaApp() {
  const [lang, setLang] = useState('en');
  const [activeTab, setActiveTab] = useState('home'); // 'home' (Public Schemes Directory) | 'admin' (Admin Policy Console)
  const [schemes, setSchemes] = useState(getAlphaSchemes());
  const [selectedSchemeId, setSelectedSchemeId] = useState("NSFDC_MICRO");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [gazetteScheme, setGazetteScheme] = useState(null);
  
  // Real-time broadcast logs
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      event: "ALPHA_PORTAL_ACTIVE",
      detail: "BroadcastChannel ('alpha_schemes_live_sync') ready for cross-tab sync."
    }
  ]);
  const [broadcastCount, setBroadcastCount] = useState(1);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Subscribe to changes (cross-tab sync)
  useEffect(() => {
    const unsubscribe = subscribeToAlphaChanges((updatedSchemes, meta) => {
      setSchemes(updatedSchemes);
      if (meta?.reason) {
        setLogs(prev => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            event: meta.action || "POLICY_BROADCAST",
            detail: `${meta.schemeId || 'ALL'}: ${meta.reason}`
          },
          ...prev.slice(0, 15)
        ]);
        setBroadcastCount(c => c + 1);
      }
    });
    return unsubscribe;
  }, []);

  // Check URL params for ?scheme=... or view=admin
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const schemeId = params.get("scheme");
      if (schemeId) {
        const found = schemes.find(s => s.scheme_id === schemeId);
        if (found) setGazetteScheme(found);
      }
      if (window.location.pathname.includes("admin") || params.get("view") === "admin") {
        setActiveTab("admin");
      }
    }
  }, [schemes]);

  // Selected scheme for editor
  const selectedScheme = schemes.find(s => s.scheme_id === selectedSchemeId) || schemes[0];

  // Modify policy parameter
  const handleFieldChange = (field, value) => {
    const parsedValue = (field === 'sanctioned_amount' || field === 'age_min' || field === 'age_max' || field === 'income_cap')
      ? Number(value)
      : value;

    const updated = updateAlphaScheme(selectedScheme.scheme_id, { [field]: parsedValue }, `Admin modified ${field} to ${value}`);
    setSchemes(updated);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 2000);
  };

  // 1-Click Fast Track triggers
  const handleQuickDemo = (type) => {
    const updated = triggerQuickDemo(type);
    if (updated) {
      setSchemes(updated);
      setBroadcastSuccess(true);
      setTimeout(() => setBroadcastSuccess(false), 2500);
    }
  };

  // Reset to statutory defaults
  const handleReset = () => {
    const updated = resetAlphaSchemes();
    setSchemes(updated);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 2000);
  };

  // Filter schemes for Home view
  const filteredSchemes = schemes.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = s.scheme_name.toLowerCase().includes(q) || 
      (s.scheme_name_ta || '').toLowerCase().includes(q) ||
      s.scheme_id.toLowerCase().includes(q) ||
      s.ministry.toLowerCase().includes(q);

    if (!matchesSearch) return false;
    if (categoryFilter === "all") return true;
    if (categoryFilter === "micro" && s.sanctioned_amount <= 200000) return true;
    if (categoryFilter === "msme" && s.sanctioned_amount > 200000) return true;
    if (categoryFilter === "scst" && (s.caste_eligibility?.includes("SC") || s.caste_eligibility?.includes("ST"))) return true;
    if (categoryFilter === "women" && (s.gender_eligibility === "Female" || s.scheme_name.includes("Mahila"))) return true;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Official Gazette Modal */}
      {gazetteScheme && (
        <AlphaGazetteModal
          scheme={gazetteScheme}
          lang={lang}
          onClose={() => setGazetteScheme(null)}
        />
      )}

      {/* Official Government Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            
            {/* Brand Emblem & Portal Title */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
              <div className="w-10 h-10 rounded-xl bg-[#1e3a8a] text-white flex items-center justify-center shadow-xs">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">
                    ALPHA PORTAL
                  </span>
                  <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    alphagov.vercel.app
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                    <Radio className="w-2.5 h-2.5 text-emerald-600 animate-pulse" /> Live Sync Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                  Ministry of Social Justice & Empowerment • Government Welfare Policy & Gazette Administration
                </p>
              </div>
            </div>

            {/* Navigation Tabs (Home / Schemes vs Admin Policy Panel) */}
            <div className="flex items-center space-x-2 shrink-0">
              
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'home'
                      ? 'bg-white text-[#1e3a8a] shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Public Schemes (20)</span>
                </button>

                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-[#1e3a8a] text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Admin Policy Console</span>
                </button>
              </div>

              {/* Link to SchemeConnect in New Tab */}
              <button
                onClick={() => navigateToSchemeConnect("/", true)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer hidden sm:flex"
                title="Open SchemeConnect Citizen Portal in a separate tab"
              >
                <span>SchemeConnect ↗</span>
              </button>

            </div>

          </div>
        </div>
      </header>

      {/* Sub-Header Notice */}
      <div className="bg-slate-100 border-b border-slate-200 py-2 px-4 text-center">
        <p className="text-xs text-slate-700">
          <span className="font-bold text-[#1e3a8a] mr-1.5">🏛️ Official Government Policy Authority:</span>
          {activeTab === 'home' 
            ? "Publicly verified central and state concessional credit guidelines under MoSJE, MoMSME, and MoHUA." 
            : "Adjust scheme age, income, or subsidy parameters below — changes broadcast live across browser tabs to SchemeConnect in <10ms without page reload."}
        </p>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: HOME PAGE — LIST OF ALL 20 SCHEMES (PUBLIC GAZETTE DIRECTORY)     */}
      {/* ========================================================================= */}
      {activeTab === 'home' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn flex-1">
          
          {/* Hero Banner for Home */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200 mb-2">
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Statutory Welfare Scheme Registry • Problem Statement SIH26092</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Official Ministry Scheme Directory ({schemes.length} Statutory Schemes)
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Comprehensive statutory catalog of central and state welfare credit programs. Click any scheme to review its official gazette certificate with cryptographic SHA256 audit signature.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('admin')}
              className="px-5 py-2.5 bg-[#1e3a8a] hover:bg-[#172554] text-white rounded-lg text-xs font-semibold shadow-xs transition flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>Admin Policy Live Editor ➔</span>
            </button>
          </div>

          {/* Filter & Search Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {[
                { id: "all", label: `All Schemes (${schemes.length})` },
                { id: "micro", label: "Micro-Credit (≤₹2L)" },
                { id: "msme", label: "Term Loans / MSME" },
                { id: "scst", label: "SC/ST Welfare" },
                { id: "women", label: "Women & Artisans" }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-[#1e3a8a] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search schemes or ministry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1e3a8a] focus:bg-white outline-none"
              />
            </div>

          </div>

          {/* 20 Schemes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSchemes.map((scheme) => (
              <div 
                key={scheme.scheme_id}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-xs transition flex flex-col justify-between"
              >
                <div>
                  {/* Ministry Header */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-500 truncate max-w-[200px]">
                      {scheme.ministry}
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {scheme.scheme_id}
                    </span>
                  </div>

                  {/* Scheme Name */}
                  <h3 className="font-bold text-sm text-slate-900 leading-snug mb-1">
                    {scheme.scheme_name}
                  </h3>
                  {scheme.scheme_name_ta && (
                    <p className="text-[11px] text-slate-500 mb-3 line-clamp-1">
                      {scheme.scheme_name_ta}
                    </p>
                  )}

                  {/* Scheme Parameters Table */}
                  <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 mb-4 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sanction Limit:</span>
                      <span className="font-bold text-slate-900">₹{Number(scheme.sanctioned_amount).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Age Bracket:</span>
                      <span className="font-semibold text-slate-800">{scheme.age_min}–{scheme.age_max} Yrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Income Cap:</span>
                      <span className="font-semibold text-slate-800">≤ ₹{Number(scheme.income_cap).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Interest Rate:</span>
                      <span className="font-bold text-emerald-700">{scheme.concessional_interest_rate || 5.0}% p.a.</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setGazetteScheme(scheme)}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Gazette ↗</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedSchemeId(scheme.scheme_id);
                      setActiveTab('admin');
                    }}
                    className="py-2 px-3 bg-blue-50 hover:bg-blue-100 text-[#1e3a8a] rounded-lg text-xs font-semibold transition cursor-pointer"
                    title="Edit scheme criteria in Admin Console"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </main>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: ADMIN PANEL — REAL-TIME POLICY UPDATER (SYNC WITH SCHEMECONNECT)   */}
      {/* ========================================================================= */}
      {activeTab === 'admin' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn flex-1">
          
          {/* Admin Header Banner */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 mb-2">
                  <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>Real-time Inter-Portal WebSockets & BroadcastChannel Active</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Government Policy Administration & Live Broadcast Console
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  When ministries update age ceilings or income limits here, all open SchemeConnect tabs instantly unlock frozen scheme cards in real time (&lt;10ms latency) without page reloads.
                </p>
              </div>

              {/* Broadcast Counter & Status */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-center px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl">
                  <span className="text-xl font-bold text-slate-900 block">{broadcastCount}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase">Broadcasts Emitted</span>
                </div>
                {broadcastSuccess && (
                  <div className="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Broadcast Sent &lt;10ms!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Fast-Track 1-Click Action Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2.5">
                ⚡ 1-Click Fast Track Policy Demonstrations (Watch SchemeConnect tab unlock live!):
              </span>

              <div className="flex flex-wrap gap-2.5">
                
                {/* Trigger 1: Extend NSFDC Age */}
                <button
                  onClick={() => {
                    setSelectedSchemeId("NSFDC_MICRO");
                    handleQuickDemo("EXTEND_AGE_40");
                  }}
                  className="px-3.5 py-2 bg-[#1e3a8a] hover:bg-[#172554] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5 text-amber-300" />
                  <span>Extend NSFDC Age: 38 ➔ 40 (Unlocks Frozen Card Live)</span>
                </button>

                {/* Trigger 2: Revert NSFDC Age */}
                <button
                  onClick={() => {
                    setSelectedSchemeId("NSFDC_MICRO");
                    handleQuickDemo("RESTRICT_AGE_38");
                  }}
                  className="px-3.5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-300" />
                  <span>Revert NSFDC Age: 40 ➔ 38 (Freezes Card Live)</span>
                </button>

                {/* Trigger 3: Waive SHG Mandate */}
                <button
                  onClick={() => {
                    setSelectedSchemeId("MAHILA_SAMRIDHI");
                    handleQuickDemo("RAISE_MAHILA_INCOME");
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-600" />
                  <span>Waive Mahila SHG Mandate & Raise Cap</span>
                </button>

                {/* Reset Benchmark */}
                <button
                  onClick={handleReset}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition ml-auto cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Reset All 20 Schemes</span>
                </button>

              </div>
            </div>
          </div>

          {/* 2-Column Admin Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Scheme Selector Table (5 Cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col h-[600px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                  Select Scheme to Edit ({schemes.length})
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">PostgreSQL</span>
              </div>

              {/* Scrollable list of schemes */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                {schemes.map(s => (
                  <div
                    key={s.scheme_id}
                    onClick={() => setSelectedSchemeId(s.scheme_id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-center justify-between ${
                      selectedSchemeId === s.scheme_id
                        ? 'bg-blue-50/80 border-blue-400 font-semibold text-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">{s.ministry}</span>
                      <span className="truncate block font-medium">{s.scheme_name}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-500 shrink-0">
                      ≤{s.age_max}y
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Live Parameter Editor (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedScheme.ministry}</span>
                    <h2 className="text-base font-bold text-slate-900">{selectedScheme.scheme_name}</h2>
                  </div>
                  <span className="text-xs font-mono font-bold bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-slate-700">
                    {selectedScheme.scheme_id}
                  </span>
                </div>

                {/* Form Controls for Selected Scheme */}
                <div className="space-y-4 text-xs">
                  
                  {/* Parameter 1: Maximum Age Limit */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="font-semibold text-slate-800">Maximum Age Ceiling (Years):</label>
                      <span className="font-bold text-[#1e3a8a] text-sm">{selectedScheme.age_max} Yrs</span>
                    </div>
                    <input
                      type="range"
                      min="25"
                      max="65"
                      value={selectedScheme.age_max}
                      onChange={(e) => handleFieldChange("age_max", e.target.value)}
                      className="w-full accent-[#1e3a8a] cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Beneficiaries older than this cap will be locked on SchemeConnect.
                    </span>
                  </div>

                  {/* Parameter 2: Annual Income Cap */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="font-semibold text-slate-800">Annual Income Ceiling (₹):</label>
                      <span className="font-bold text-[#1e3a8a] text-sm">₹{Number(selectedScheme.income_cap).toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="800000"
                      step="25000"
                      value={selectedScheme.income_cap}
                      onChange={(e) => handleFieldChange("income_cap", e.target.value)}
                      className="w-full accent-[#1e3a8a] cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Income limit for BPL / EWS priority qualification.
                    </span>
                  </div>

                  {/* Parameter 3: Sanction Amount */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="font-semibold text-slate-800">Maximum Sanction Loan Limit (₹):</label>
                      <span className="font-bold text-[#1e3a8a] text-sm">₹{Number(selectedScheme.sanctioned_amount).toLocaleString('en-IN')}</span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="5000000"
                      step="50000"
                      value={selectedScheme.sanctioned_amount}
                      onChange={(e) => handleFieldChange("sanctioned_amount", e.target.value)}
                      className="w-full accent-[#1e3a8a] cursor-pointer"
                    />
                  </div>

                  {/* Parameter 4: Concessional Interest Rate */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="font-semibold text-slate-800">Concessional Interest Rate (% p.a.):</label>
                      <span className="font-bold text-emerald-700 text-sm">{selectedScheme.concessional_interest_rate || 5.0}%</span>
                    </div>
                    <input
                      type="range"
                      min="3.0"
                      max="12.0"
                      step="0.5"
                      value={selectedScheme.concessional_interest_rate || 5.0}
                      onChange={(e) => handleFieldChange("concessional_interest_rate", e.target.value)}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                </div>
              </div>

              {/* Live Broadcast Event Log */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Broadcast Audit Trail (Recent Events):
                </span>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg font-mono text-[11px] space-y-1 max-h-28 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="truncate">
                      <span className="text-slate-400 mr-2">[{log.time}]</span>
                      <span className="text-amber-400 font-bold mr-1.5">{log.event}:</span>
                      <span className="text-slate-200">{log.detail}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </main>
      )}

      {/* Official Government Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>ALPHA PORTAL • Ministry of Social Justice & Empowerment • Government of India</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Problem Statement SIH26092 • Decoupled Triple-Portal Architecture</p>
      </footer>

    </div>
  );
}
export default AlphaApp;
