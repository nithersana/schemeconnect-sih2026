import React, { useState, useEffect } from 'react';
import { 
  User, Briefcase, IndianRupee, MapPin, Sparkles, Filter, 
  Radio, CheckCircle2, Lock, Unlock, AlertTriangle, ShieldCheck, 
  RefreshCw, Bot, ArrowRight, Laptop
} from 'lucide-react';
import { LiveSchemeCard } from './LiveSchemeCard';
import { rankAlphaSchemes } from '../utils/alphaMatcher';
import { getAlphaSchemes, subscribeToAlphaChanges } from '../utils/realtimeSync';

export function SchemeConnectFeed({ 
  lang = "en", 
  t, 
  onOpenCalculator, 
  onOpenLocator, 
  onOpenCounselor, 
  onOpenSplitDemo,
  onOpenAdmin 
}) {
  // 1. Default Benchmark Test State specified in Hackathon Architecture:
  // Age: 39 | Area: Urban | Sector: Street Vendor | Income: ₹2,00,000 | SHG Member: No
  const [userProfile, setUserProfile] = useState({
    name: "Rajan S.",
    age: 39, // Default test state
    area: "Urban",
    sector: "Street Vendor",
    income: 200000,
    shg_membership: "No", // Not an SHG member
    gender: "Male",
    caste: "SC/ST",
    state: "Tamil Nadu",
    district: "Tiruchirappalli"
  });

  const [rawSchemes, setRawSchemes] = useState(getAlphaSchemes());
  const [lastLiveBroadcast, setLastLiveBroadcast] = useState(null);
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState(null);

  // 2. Realtime Subscription to Alpha Portal Console
  useEffect(() => {
    const unsubscribe = subscribeToAlphaChanges((updatedSchemes, meta) => {
      setRawSchemes(updatedSchemes);
      if (meta?.reason) {
        setLastLiveBroadcast({
          time: new Date().toLocaleTimeString(),
          message: meta.reason,
          schemeId: meta.schemeId
        });

        // Clear banner after 6 seconds
        const timer = setTimeout(() => {
          setLastLiveBroadcast(null);
        }, 6000);
        return () => clearTimeout(timer);
      }
    });
    return unsubscribe;
  }, []);

  // 3. Dynamic Re-Evaluation
  const rankedSchemes = rankAlphaSchemes(rawSchemes, userProfile);
  const eligibleSchemes = rankedSchemes.filter(s => s.is_eligible);
  const ineligibleSchemes = rankedSchemes.filter(s => !s.is_eligible);

  const handleProfileFieldChange = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: field === 'age' || field === 'income' ? Number(value) : value
    }));
  };

  const handleResetTestProfile = () => {
    setUserProfile({
      name: "Rajan S.",
      age: 39,
      area: "Urban",
      sector: "Street Vendor",
      income: 200000,
      shg_membership: "No",
      gender: "Male",
      caste: "SC/ST",
      state: "Tamil Nadu",
      district: "Tiruchirappalli"
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Live Stream Alert Toast */}
      {lastLiveBroadcast && (
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white p-4 rounded-2xl shadow-xl mb-6 flex items-center justify-between gap-3 animate-bounce border border-emerald-400">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Radio className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-100">
                ⚡ Realtime Alpha Portal Stream Received [{lastLiveBroadcast.time}]
              </div>
              <div className="text-xs sm:text-sm font-black text-white">
                {lastLiveBroadcast.message} ➔ Re-evaluating citizen eligibility live!
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono bg-white/20 px-2 py-1 rounded font-bold">
            SYNCED
          </span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-900 px-3 py-1 rounded-full text-xs font-black border border-blue-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Problem Statement SIH26092 • SchemeConnect Live Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Micro-Entrepreneur Concessional Scheme Recommender
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Deterministic weighted matching with real-time sync to Alpha Portal government administration console.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {onOpenSplitDemo && (
            <button
              onClick={onOpenSplitDemo}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-sm flex items-center gap-2 transition"
            >
              <Laptop className="w-4 h-4 text-amber-300" />
              <span>Split Screen Judge View</span>
            </button>
          )}

          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-indigo-600" />
              <span>Alpha Portal Console</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. USER PROFILE CONTROLLER (Default Test State: 39 / Urban / Vendor / ₹2L / No) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm mb-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900">
                User Profile Controller (Interactive Citizen Parameters)
              </h3>
              <p className="text-xs text-slate-500">
                Modify parameters below to see real-time eligibility shifts & card freeze states.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {eligibleSchemes.length} of {rankedSchemes.length} Active (100% Eligible)
            </span>
            <button
              onClick={handleResetTestProfile}
              className="p-1.5 text-slate-400 hover:text-slate-600 text-xs font-semibold flex items-center gap-1 rounded-lg hover:bg-slate-50"
              title="Reset to benchmark test state (Age: 39, Urban, Street Vendor, ₹2L, SHG: No)"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Test</span>
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* Age */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              Age (Years):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="18"
                max="75"
                value={userProfile.age}
                onChange={(e) => handleProfileFieldChange('age', e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-blue-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Default: 39 Yrs</span>
          </div>

          {/* Area */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              Geographic Area:
            </label>
            <select
              value={userProfile.area}
              onChange={(e) => handleProfileFieldChange('area', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Urban">Urban</option>
              <option value="Rural">Rural</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Default: Urban</span>
          </div>

          {/* Sector / Trade */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              Target Sector:
            </label>
            <select
              value={userProfile.sector}
              onChange={(e) => handleProfileFieldChange('sector', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="Street Vendor">Street Vendor</option>
              <option value="Handicraft/Artisan">Handicraft/Artisan</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Services">Services</option>
              <option value="Agriculture/Farming">Agriculture/Farming</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Default: Street Vendor</span>
          </div>

          {/* Household Income */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              Annual Income (₹):
            </label>
            <input
              type="number"
              step="10000"
              value={userProfile.income}
              onChange={(e) => handleProfileFieldChange('income', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-emerald-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Default: ₹2,00,000</span>
          </div>

          {/* SHG Member */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              SHG Member?:
            </label>
            <select
              value={userProfile.shg_membership}
              onChange={(e) => handleProfileFieldChange('shg_membership', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="No">No (Non-Member)</option>
              <option value="Yes">Yes (SHG Member)</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Default: No</span>
          </div>

          {/* Caste / Category */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">
              Social Category:
            </label>
            <select
              value={userProfile.caste}
              onChange={(e) => handleProfileFieldChange('caste', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="SC/ST">SC / ST</option>
              <option value="OBC">OBC</option>
              <option value="General">General</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Default: SC/ST</span>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. LIVE SCHEME GRID (Eligible 100% on top, Frozen <100% below)             */}
      {/* ========================================================================= */}
      
      {/* Eligible Schemes Section */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
              100% Eligible Schemes ({eligibleSchemes.length})
            </h2>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Active UI • Fast-Track Apply Enabled
          </span>
        </div>

        {eligibleSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eligibleSchemes.map((scheme) => (
              <LiveSchemeCard
                key={scheme.scheme_id}
                scheme={scheme}
                userProfile={userProfile}
                lang={lang}
                onSelect={(s) => setSelectedSchemeForModal(s)}
                onOpenCalculator={onOpenCalculator}
                onOpenLocator={onOpenLocator}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 bg-amber-50 rounded-3xl border border-amber-200 text-center">
            <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
            <h3 className="text-sm font-black text-slate-900">No 100% Eligible Schemes for Current Parameters</h3>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Check the frozen cards below to see the exact failed rules, or adjust policy thresholds in Alpha Portal to unlock them.
            </p>
          </div>
        )}
      </div>

      {/* Ineligible / Frozen Schemes Section */}
      {ineligibleSchemes.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-slate-400" />
              <h2 className="text-base font-black text-slate-600 uppercase tracking-wide">
                Locked / Ineligible Schemes ({ineligibleSchemes.length})
              </h2>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Grayscale Frozen State • Actions Disabled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ineligibleSchemes.map((scheme) => (
              <LiveSchemeCard
                key={scheme.scheme_id}
                scheme={scheme}
                userProfile={userProfile}
                lang={lang}
                onSelect={(s) => setSelectedSchemeForModal(s)}
                onOpenCalculator={onOpenCalculator}
                onOpenLocator={onOpenLocator}
              />
            ))}
          </div>
        </div>
      )}

      {/* Scheme Details Modal */}
      {selectedSchemeForModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">
                  {selectedSchemeForModal.scheme_id}
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  {selectedSchemeForModal.scheme_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSchemeForModal(null)}
                className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
            </div>

            {/* Audit Breakdown */}
            <div className="space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Deterministic Eligibility Audit Results:
                </span>
                <div className="space-y-2 mt-2">
                  {selectedSchemeForModal.audits?.map((audit, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 p-2 rounded-xl bg-white border border-slate-100">
                      <div className="flex items-start gap-2">
                        {audit.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{audit.criterion}</span>
                          <span className={audit.passed ? "text-slate-600" : "text-amber-700 font-semibold"}>
                            {audit.reason}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                        audit.passed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {audit.passed ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex gap-2 pt-2">
                {selectedSchemeForModal.is_eligible ? (
                  <button
                    onClick={() => {
                      alert(`Application initiated for ${selectedSchemeForModal.scheme_name}! Fast-track token generated.`);
                      setSelectedSchemeForModal(null);
                    }}
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <span>Submit Online Application</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="w-full text-center text-xs text-amber-800 font-bold bg-amber-50 p-3 rounded-2xl border border-amber-200">
                    🔒 Currently Ineligible ({selectedSchemeForModal.match_percentage}%). Review failed audit rules above.
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
