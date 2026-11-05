import React, { useState } from 'react';
import { 
  Laptop, Radio, Sparkles, ArrowRight, Zap, RefreshCw, 
  ShieldCheck, Lock, Unlock, UserCheck, CheckCircle2 
} from 'lucide-react';
import { AlphaPortalConsole } from './AlphaPortalConsole';
import { RecommendationsGridPage } from './RecommendationsGridPage';

export function SplitDemoView({ 
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
    <div className="w-full min-h-screen bg-slate-950 p-3 sm:p-5 text-slate-100 animate-fadeIn flex flex-col">
      
      {/* Top Split Presentation Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 mb-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 p-0.5 flex items-center justify-center">
            <Laptop className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                Hackathon Judge Pitch Live Demonstration
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                WebSocket Sync &lt; 10ms
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white">
              Alpha Portal (Admin Policy Console) ⟷ SchemeConnect (Citizen Live Feed)
            </h2>
          </div>
        </div>

        {/* Demo Guide Pill */}
        <div className="text-xs text-slate-300 bg-slate-800/90 px-4 py-2 rounded-2xl border border-slate-700 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
          <span>
            <b>Judge Demo Action:</b> Click <span className="text-emerald-300 font-bold">"Extend NSFDC Age: 38 ➔ 40"</span> on the Left ➔ Watch NSFDC Micro unlock on the Right!
          </span>
        </div>
      </div>

      {/* 2-Column Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        
        {/* LEFT 6 COLS: ALPHA PORTAL CONSOLE */}
        <div className="lg:col-span-6 bg-slate-900/95 rounded-3xl border border-indigo-900/60 p-3 sm:p-4 overflow-y-auto max-h-[85vh] shadow-2xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                Left Pane: Alpha Portal Government Administration Console
              </span>
            </div>
            <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800 font-bold">
              Admin Publisher
            </span>
          </div>

          <AlphaPortalConsole />
        </div>

        {/* RIGHT 6 COLS: SCHEMECONNECT RECOMMENDATIONS FEED */}
        <div className="lg:col-span-6 bg-slate-100 text-slate-900 rounded-3xl border border-slate-700 p-3 sm:p-4 overflow-y-auto max-h-[85vh] shadow-2xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Right Pane: SchemeConnect Citizen Feed (Rajan S., 39 Yrs)
              </span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300 font-bold">
              Citizen Subscriber
            </span>
          </div>

          <RecommendationsGridPage
            userProfile={demoProfile}
            lang={lang}
            t={t}
            onEditProfile={onEditProfile}
            onOpenCalculator={onOpenCalculator}
            onOpenLocator={onOpenLocator}
            onOpenCounselor={onOpenCounselor}
            onRouteToBank={onRouteToBank}
          />
        </div>

      </div>

    </div>
  );
}
