import React, { useState, useEffect } from 'react';
import { 
  Building2, Radio, Sparkles, RefreshCw, Save, CheckCircle2, 
  AlertTriangle, Shield, Sliders, ArrowUpRight, Lock, Unlock, 
  Activity, Database, Laptop, Send, Zap, Users, IndianRupee, Search, Check
} from 'lucide-react';
import { 
  getAlphaSchemes, updateAlphaScheme, resetAlphaSchemes, 
  triggerQuickDemo, subscribeToAlphaChanges 
} from '../utils/realtimeSync';

export function AlphaPortalConsole({ onOpenSplitDemo }) {
  const [schemes, setSchemes] = useState(getAlphaSchemes());
  const [selectedSchemeId, setSelectedSchemeId] = useState(schemes[0]?.scheme_id || "NSFDC_MICRO");
  const [searchQuery, setSearchQuery] = useState("");
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: new Date().toLocaleTimeString(),
      event: "ALPHA_PORTAL_INITIALIZED",
      detail: "Supabase Realtime WebSocket & Local Broadcast Channel Ready."
    }
  ]);
  const [broadcastCount, setBroadcastCount] = useState(1);
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Selected scheme for editor
  const selectedScheme = schemes.find(s => s.scheme_id === selectedSchemeId) || schemes[0];

  // Subscribe to external updates
  useEffect(() => {
    const unsubscribe = subscribeToAlphaChanges((updatedSchemes, meta) => {
      setSchemes(updatedSchemes);
      if (meta?.reason) {
        setLogs(prev => [
          {
            id: Date.now(),
            time: new Date().toLocaleTimeString(),
            event: meta.action || "REALTIME_BROADCAST",
            detail: `${meta.schemeId || 'ALL'}: ${meta.reason}`
          },
          ...prev.slice(0, 15)
        ]);
        setBroadcastCount(c => c + 1);
      }
    });
    return unsubscribe;
  }, []);

  const handleFieldChange = (field, value) => {
    const parsedValue = (field === 'sanctioned_amount' || field === 'age_min' || field === 'age_max' || field === 'income_cap')
      ? Number(value)
      : value;

    const updated = updateAlphaScheme(selectedScheme.scheme_id, { [field]: parsedValue }, `Admin modified ${field} to ${value}`);
    setSchemes(updated);
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 2000);
  };

  const handleQuickDemo = (type) => {
    const updated = triggerQuickDemo(type);
    if (updated) {
      setSchemes(updated);
      setBroadcastSuccess(true);
      setTimeout(() => setBroadcastSuccess(false), 2500);
    }
  };

  const handleReset = () => {
    const updated = resetAlphaSchemes();
    setSchemes(updated);
  };

  const filteredSchemes = schemes.filter(s => {
    const q = searchQuery.toLowerCase();
    return s.scheme_name.toLowerCase().includes(q) || 
      (s.scheme_name_ta || '').toLowerCase().includes(q) ||
      s.scheme_id.toLowerCase().includes(q) ||
      s.ministry.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Alpha Portal • Official Government Administration Console
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Live Ministry Scheme Policy Modifier
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Modify scheme age ceilings, income thresholds, or SHG mandates. Updates stream live via Supabase WebSockets to SchemeConnect citizen feeds.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10 text-center">
              <span className="text-xl font-black text-emerald-400 block">{broadcastCount}</span>
              <span className="text-[10px] text-slate-300 font-bold uppercase">Live Broadcasts</span>
            </div>

            {onOpenSplitDemo && (
              <button
                onClick={onOpenSplitDemo}
                className="px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-black text-xs shadow-lg flex items-center gap-2 transition"
              >
                <Laptop className="w-4 h-4 text-amber-300" />
                <span>Open Split-Screen Judge Demo</span>
              </button>
            )}
          </div>
        </div>

        {/* 1-Click Fast Track Hackathon Demo Triggers */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>1-Click Hackathon Judge Triggers (Watch SchemeConnect Unlock in Realtime!):</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {/* Trigger 1: Age Extension (Unlock for 39yo) */}
            <button
              onClick={() => {
                setSelectedSchemeId("NSFDC_MICRO");
                handleQuickDemo("EXTEND_AGE_40");
              }}
              className="px-3.5 py-2 bg-emerald-600/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-black border border-emerald-400/40 shadow-sm flex items-center gap-1.5 transition"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-200" />
              <span>Extend NSFDC Age: 38 ➔ 40 (Unlock for Rajan 39yo)</span>
            </button>

            {/* Trigger 2: Revert Age to 38 */}
            <button
              onClick={() => {
                setSelectedSchemeId("NSFDC_MICRO");
                handleQuickDemo("RESTRICT_AGE_38");
              }}
              className="px-3.5 py-2 bg-amber-600/90 hover:bg-amber-600 text-white rounded-xl text-xs font-black border border-amber-400/40 shadow-sm flex items-center gap-1.5 transition"
            >
              <Lock className="w-3.5 h-3.5 text-amber-200" />
              <span>Revert NSFDC Age: 40 ➔ 38 (Freeze Card)</span>
            </button>

            {/* Trigger 3: Waive SHG */}
            <button
              onClick={() => {
                setSelectedSchemeId("MAHILA_SAMRIDHI");
                handleQuickDemo("RAISE_MAHILA_INCOME");
              }}
              className="px-3.5 py-2 bg-purple-600/90 hover:bg-purple-600 text-white rounded-xl text-xs font-black border border-purple-400/40 shadow-sm flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>Waive Mahila SHG Mandate & Raise Income</span>
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 shadow-sm flex items-center gap-1.5 transition ml-auto"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Benchmark State</span>
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================= */}
      {/* 2-COLUMN NON-CLUTTERED ADMIN LAYOUT                       */}
      {/* Left: Scheme Directory Table | Right: Live Modifier Drawer*/}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: 20 SCHEMES COMPACT DIRECTORY (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm flex flex-col h-[650px]">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
                  Scheme Directory ({filteredSchemes.length} Schemes)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">PostgreSQL</span>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search scheme ID or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Scheme List Items */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredSchemes.map((s) => {
                const isSelected = selectedScheme.scheme_id === s.scheme_id;
                return (
                  <div
                    key={s.scheme_id}
                    onClick={() => setSelectedSchemeId(s.scheme_id)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-500 shadow-xs ring-2 ring-indigo-500/20'
                        : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700">
                        {s.scheme_id}
                      </span>
                      <span className="text-[10px] font-bold text-indigo-700">
                        ₹{Number(s.sanctioned_amount).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 leading-snug line-clamp-1">
                      {s.scheme_name}
                    </h4>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                      <span>Age: {s.age_min}–{s.age_max} yrs</span>
                      <span>Cap: ≤ ₹{Number(s.income_cap).toLocaleString('en-IN')}</span>
                      <span className="font-bold text-slate-700">{s.sector}</span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: LIVE CRITERIA MODIFIER DRAWER (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                  Live Modifier Drawer: {selectedScheme.scheme_id}
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                  {selectedScheme.scheme_name}
                </h2>
                <p className="text-xs text-slate-500">{selectedScheme.ministry}</p>
              </div>

              {broadcastSuccess && (
                <span className="text-[10px] font-black px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 animate-pulse flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Broadcasted!</span>
                </span>
              )}
            </div>

            {/* Modifier Form Fields */}
            <div className="space-y-5">
              
              {/* Slider 1: Maximum Age Bracket */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Maximum Age Ceiling (`age_max`):</span>
                  </label>
                  <span className="text-sm font-black text-indigo-900 bg-indigo-100 px-3 py-0.5 rounded-xl border border-indigo-200">
                    {selectedScheme.age_max} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="70"
                  step="1"
                  value={selectedScheme.age_max}
                  onChange={(e) => handleFieldChange('age_max', e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                  <span>18 yrs</span>
                  <span className="text-amber-600 font-bold">38 yrs (Benchmark Freeze)</span>
                  <span className="text-emerald-600 font-bold">40 yrs (Judge Unlock)</span>
                  <span>70 yrs</span>
                </div>
              </div>

              {/* Slider 2: Sanctioned Amount */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sanctioned Credit Limit (`sanctioned_amount`):</span>
                  </label>
                  <span className="text-sm font-black text-blue-900 bg-blue-100 px-3 py-0.5 rounded-xl border border-blue-200">
                    ₹{Number(selectedScheme.sanctioned_amount).toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="20000"
                  max="5000000"
                  step="10000"
                  value={selectedScheme.sanctioned_amount}
                  onChange={(e) => handleFieldChange('sanctioned_amount', e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Slider 3: Household Income Cap */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Annual Income Ceiling (`income_cap`):</span>
                  </label>
                  <span className="text-sm font-black text-emerald-900 bg-emerald-100 px-3 py-0.5 rounded-xl border border-emerald-200">
                    ₹{Number(selectedScheme.income_cap).toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="50000"
                  value={selectedScheme.income_cap}
                  onChange={(e) => handleFieldChange('income_cap', e.target.value)}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>

              {/* Toggle Dropdowns Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                    Target Sector:
                  </label>
                  <select
                    value={selectedScheme.sector}
                    onChange={(e) => handleFieldChange('sector', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white"
                  >
                    <option value="Street Vendor">Street Vendor</option>
                    <option value="Handicraft/Artisan">Handicraft/Artisan</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Services">Services</option>
                    <option value="Agriculture/Farming">Agriculture/Farming</option>
                    <option value="All">All Sectors</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                    SHG Mandate:
                  </label>
                  <select
                    value={selectedScheme.shg_membership}
                    onChange={(e) => handleFieldChange('shg_membership', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white"
                  >
                    <option value="Not Required">Not Required</option>
                    <option value="Mandatory">Mandatory</option>
                    <option value="Preferred">Preferred</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">
                    Geographic Area:
                  </label>
                  <select
                    value={selectedScheme.area}
                    onChange={(e) => handleFieldChange('area', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white"
                  >
                    <option value="Both">Both (Rural & Urban)</option>
                    <option value="Urban">Urban Only</option>
                    <option value="Rural">Rural Only</option>
                  </select>
                </div>

              </div>

              {/* 1-Click Explicit Broadcast Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleFieldChange('updated_at', new Date().toISOString());
                    setBroadcastSuccess(true);
                    setTimeout(() => setBroadcastSuccess(false), 2500);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-black text-xs rounded-2xl shadow-lg transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Broadcast Policy Payload to Supabase & SchemeConnect</span>
                </button>
              </div>

            </div>

          </div>

          {/* Realtime Stream Audit Logs Feed */}
          <div className="bg-slate-950 text-slate-300 rounded-3xl p-5 border border-slate-800 font-mono text-xs shadow-md">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-bold text-white text-[11px] uppercase tracking-wider">
                  Supabase Realtime WebSocket Audit Log
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Live Payload Channel</span>
            </div>

            <div className="space-y-1 max-h-28 overflow-y-auto">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start space-x-2 text-[10px] leading-relaxed">
                  <span className="text-slate-500">[{log.time}]</span>
                  <span className="text-emerald-400 font-bold">{log.event}:</span>
                  <span className="text-slate-300">{log.detail}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
