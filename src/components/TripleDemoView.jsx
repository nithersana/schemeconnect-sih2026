import React, { useState } from 'react';
import { 
  Laptop, Radio, Sparkles, ArrowRight, Zap, RefreshCw, 
  ShieldCheck, Lock, Unlock, UserCheck, CheckCircle2, Building2, Landmark 
} from 'lucide-react';
import { AlphaPortalConsole } from './AlphaPortalConsole';
import { RecommendationsGridPage } from './RecommendationsGridPage';
import { BetaPortalBank } from './BetaPortalBank';

export function TripleDemoView({ 
  userProfile, 
  lang = "en", 
  t, 
  onEditProfile,
  onOpenCalculator, 
  onOpenLocator, 
  onOpenCounselor,
  onRouteToBank 
}) {
  const isTa = lang === "ta";
  const [selectedSchemeForBank, setSelectedSchemeForBank] = useState(null);

  // Dedicated demo benchmark profile (39 yrs old) ensures NSFDC Micro (age_max: 38)
  // starts LOCKED / FROZEN so clicking "Extend NSFDC Age: 38 ➔ 40" demonstrates live unlocking!
  const demoProfile = userProfile || {
    name: "Rajan S.",
    age: 39,
    area: "Urban",
    sector: "Street Vendor",
    income: 200000,
    caste: "SC/ST",
    shg_membership: "No",
    gender: "Male",
    district: "Tiruchirappalli",
    state: "Tamil Nadu"
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 p-2 sm:p-4 text-slate-100 animate-fadeIn flex flex-col">
      
      {/* Top Presentation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 mb-3 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-blue-500 to-emerald-400 p-0.5 flex items-center justify-center">
            <Zap className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                Triple-Portal Welfare-to-Credit Ecosystem Pitch
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                Sub-10ms Cross-Portal Realtime Sync
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-white">
              Alpha Portal (Policy) ⟷ SchemeConnect (Discovery) ⟷ Beta Portal (Bank Sanction)
            </h2>
          </div>
        </div>

        {/* Live Pitch Workflow Step Guide */}
        <div className="text-[11px] text-slate-300 bg-slate-800/90 px-3.5 py-2 rounded-2xl border border-slate-700 flex items-center gap-2">
          <span className="font-bold text-amber-300">1. Modify Policy on Left</span>
          <span className="text-slate-500">➔</span>
          <span className="font-bold text-blue-300">2. Scheme Unlocks in Center & Click Apply</span>
          <span className="text-slate-500">➔</span>
          <span className="font-bold text-emerald-300">3. Sanction Loan on Right!</span>
        </div>
      </div>

      {/* 3-Pane Responsive Grid: 30% | 40% | 30% */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1">
        
        {/* PANE 1 (30% Width - 3.5 Cols): ALPHA PORTAL ADMIN CONSOLE */}
        <div className="lg:col-span-4 bg-slate-900/95 rounded-3xl border border-indigo-900/60 p-3 overflow-y-auto max-h-[86vh] shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-300">
                Pane 1: Alpha Portal (Gov Policy)
              </span>
            </div>
            <span className="text-[9px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
              Admin Publisher
            </span>
          </div>

          <div className="scale-95 origin-top">
            <AlphaPortalConsole />
          </div>
        </div>

        {/* PANE 2 (40% Width - 4.5 Cols): SCHEMECONNECT CITIZEN FEED */}
        <div className="lg:col-span-4 bg-slate-100 text-slate-900 rounded-3xl border border-slate-700 p-3 overflow-y-auto max-h-[86vh] shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-200">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-900">
                Pane 2: SchemeConnect (Citizen Feed)
              </span>
            </div>
            <span className="text-[9px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-300 font-bold">
              Citizen Subscriber
            </span>
          </div>

          <div className="scale-95 origin-top">
            <RecommendationsGridPage
              userProfile={demoProfile}
              lang={lang}
              t={t}
              onEditProfile={onEditProfile}
              onOpenCalculator={onOpenCalculator}
              onOpenLocator={onOpenLocator}
              onOpenCounselor={onOpenCounselor}
              onRouteToBank={(scheme) => setSelectedSchemeForBank(scheme)}
            />
          </div>
        </div>

        {/* PANE 3 (30% Width - 4 Cols): BETA PORTAL BANK SANCTION CONSOLE */}
        <div className="lg:col-span-4 bg-slate-900/95 rounded-3xl border border-emerald-900/60 p-3 overflow-y-auto max-h-[86vh] shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-1.5">
              <Landmark className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-300">
                Pane 3: Beta Portal (Bank Sanction)
              </span>
            </div>
            <span className="text-[9px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              Bank Approver
            </span>
          </div>

          <div className="scale-95 origin-top">
            <BetaPortalBank
              referredScheme={selectedSchemeForBank}
              userProfile={demoProfile}
              lang={lang}
              t={t}
            />
          </div>
        </div>

      </div>

    </div>
  );
}
