import React, { useState, useEffect } from 'react';
import {
  CheckCircle, AlertTriangle, Lock, Unlock, ArrowRight,
  Volume2, VolumeX, Sparkles, Building2, ShieldCheck, IndianRupee,
  Clock, Info, ChevronRight, UserCheck, Landmark, Calculator, ExternalLink, QrCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { speakText, stopSpeaking } from '../utils/speech';
import { generateReferralJWT } from '../utils/jwtToken';
import { navigateToAlpha } from '../config/portalConfig';

export function LiveSchemeCard({
  scheme,
  userProfile,
  lang = "en",
  onSelect,
  onOpenCalculator,
  onOpenLocator,
  onApply,
  verificationAudit = {}
}) {
  const isTa = lang === "ta";
  const isHi = lang === "hi";
  const L = (en, ta, hi) => isHi ? hi : (isTa ? ta : en);

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [prevEligible, setPrevEligible] = useState(scheme.is_eligible);
  const [showJWTPreview, setShowJWTPreview] = useState(false);

  const isEligible = scheme.is_eligible === true;
  const matchPercentage = scheme.match_percentage || 0;

  // Detect Live Unlock from Alpha Portal Stream
  useEffect(() => {
    if (!prevEligible && isEligible) {
      setJustUnlocked(true);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch (e) {}
      const timer = setTimeout(() => setJustUnlocked(false), 5000);
      return () => clearTimeout(timer);
    }
    setPrevEligible(isEligible);
  }, [isEligible, prevEligible]);

  const displayName = isHi && scheme.scheme_name_hi 
    ? scheme.scheme_name_hi 
    : (isTa && scheme.scheme_name_ta ? scheme.scheme_name_ta : scheme.scheme_name);

  const handleAudio = (e) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const text = `${displayName}. ${scheme.ministry}. ${L("Sanction Amount", "கடன் தொகை", "ऋण राशि")}: ₹${Number(scheme.sanctioned_amount).toLocaleString('en-IN')}. ${isEligible
        ? L('You are 100% eligible for this scheme.', 'நீங்கள் இத்திட்டத்திற்கு 100% தகுதியானவர்.', 'आप इस योजना के लिए 100% पात्र हैं।')
        : L('Currently locked. ', 'தற்போது நிறுத்திவைக்கப்பட்டுள்ளது. ', 'वर्तमान में अपात्र। ') + (scheme.failed_criteria || []).join('. ')}`;
      speakText(text, lang, () => setIsPlayingAudio(false));
    }
  };

  // Generate JWT for preview when eligible
  const jwtPreview = isEligible ? generateReferralJWT(scheme, userProfile, verificationAudit) : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{
        opacity: isEligible ? 1 : 0.78,
        scale: justUnlocked ? [1, 1.03, 1] : 1
      }}
      transition={{ duration: 0.35 }}
      className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between p-5 sm:p-6 relative overflow-hidden ${
        isEligible
          ? justUnlocked
            ? 'bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-emerald-500 shadow-xl ring-4 ring-emerald-400/30'
            : 'bg-white border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-400'
          : 'bg-slate-50/90 border-dashed border-slate-300 grayscale-[60%] hover:grayscale-0 hover:bg-white'
      }`}
    >
      {/* Live Unlock Banner */}
      <AnimatePresence>
        {justUnlocked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-emerald-600 text-white text-[11px] font-black px-3.5 py-1.5 rounded-xl mb-3 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
              <span>{isTa ? "⚡ Alpha Portal புதுப்பிப்பு: தகுதி திறக்கப்பட்டது!" : "⚡ Alpha Portal Live Update: Eligibility Unlocked!"}</span>
            </div>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">100% MATCH</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        {/* Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
            isEligible
              ? 'bg-blue-50 text-blue-800 border border-blue-200'
              : 'bg-slate-200 text-slate-600'
          }`}>
            {scheme.ministry}
          </span>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleAudio}
              title="Voice Guidance"
              className={`p-1.5 rounded-full transition ${
                isPlayingAudio
                  ? 'bg-blue-600 text-white animate-pulse'
                  : 'bg-slate-100 text-slate-600 hover:bg-blue-100 hover:text-blue-700'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
              isEligible
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}>
              {isEligible ? <CheckCircle className="w-3 h-3 text-emerald-600" /> : <Lock className="w-3 h-3 text-amber-600" />}
              <span>{matchPercentage}% {isTa ? "பொருத்தம்" : "Match"}</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className={`font-black text-base leading-snug tracking-tight mb-1 ${isEligible ? 'text-slate-900' : 'text-slate-700'}`}>
          {displayName}
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-4">{scheme.ministry}</p>

        {/* Key Specs Grid */}
        <div className={`p-3.5 rounded-2xl border mb-3 ${isEligible ? 'bg-slate-50 border-slate-200/80' : 'bg-slate-100/70 border-slate-200'}`}>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{isTa ? "கடன் தொகை" : "Sanction Amount"}</span>
              <span className={`text-sm font-black ${isEligible ? 'text-blue-700' : 'text-slate-700'}`}>
                ₹{Number(scheme.sanctioned_amount).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{isTa ? "வயது வரம்பு" : "Age Bracket"}</span>
              <span className="text-xs font-bold text-slate-800">{scheme.age_min}–{scheme.age_max} Yrs</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{isTa ? "வருமான வரம்பு" : "Income Cap"}</span>
              <span className="text-xs font-bold text-slate-800">≤ ₹{Number(scheme.income_cap).toLocaleString('en-IN')}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">{isTa ? "வட்டி விகிதம்" : "Interest Rate"}</span>
              <span className="text-xs font-black text-emerald-700">{scheme.concessional_interest_rate || 5.0}% p.a.</span>
            </div>
          </div>
        </div>

        {/* Inter-Portal Handshake Buttons (for Eligible schemes) */}
        {isEligible && (
          <div className="flex gap-2 mb-3">
            {/* Verify on Alpha Portal (Official Gazette) */}
            <button
              onClick={() => {
                navigateToAlpha(scheme.scheme_id, true);
                if (onSelect) onSelect({ ...scheme, _openGazette: true });
              }}
              className="flex-1 py-1.5 px-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 border border-slate-200 hover:border-indigo-300 rounded-xl text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
              title="Open Official Gazette on Alpha Portal (New Tab)"
            >
              <Building2 className="w-3 h-3 text-indigo-600" />
              <span>{L("Verify on Gov Gazette ↗", "அரசிதழ் சரிபார் ↗", "सरकारी गजट ↗")}</span>
              <ExternalLink className="w-2.5 h-2.5 text-indigo-400" />
            </button>

            {/* JWT Token Preview */}
            <button
              onClick={() => setShowJWTPreview(!showJWTPreview)}
              className="py-1.5 px-2.5 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl text-[11px] font-bold transition flex items-center gap-1 text-amber-800 cursor-pointer"
              title="View Signed JWT Token"
            >
              <QrCode className="w-3 h-3" />
              <span>JWT</span>
            </button>
          </div>
        )}

        {/* JWT Token Preview Panel */}
        <AnimatePresence>
          {showJWTPreview && jwtPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-3 bg-slate-900 rounded-2xl p-3 overflow-hidden"
            >
              <div className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-1.5">Signed JWT Referral Token (15-min expiry)</div>
              <div className="font-mono text-[9px] text-emerald-400 break-all leading-relaxed mb-1.5">
                {jwtPreview.token.slice(0, 120)}...
              </div>
              <div className="text-[9px] text-slate-400 font-mono">
                REF: {jwtPreview.referralId} • Expires: {new Date(jwtPreview.expiresAt).toLocaleTimeString()}
              </div>
              <div className="flex gap-1 mt-1.5 flex-wrap">
                <span className="text-[9px] bg-emerald-900/60 text-emerald-400 px-1.5 py-0.5 rounded font-bold">eKYC ✓</span>
                <span className="text-[9px] bg-emerald-900/60 text-emerald-400 px-1.5 py-0.5 rounded font-bold">OCR: MATCH ✓</span>
                <span className="text-[9px] bg-blue-900/60 text-blue-400 px-1.5 py-0.5 rounded font-bold">Trust: {jwtPreview.payload.trust_score}%</span>
                <span className="text-[9px] bg-amber-900/60 text-amber-400 px-1.5 py-0.5 rounded font-bold">iss: schemeconnect.in</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calculator Shortcut */}
        {onOpenCalculator && (
          <button
            onClick={() => onOpenCalculator(scheme)}
            className="w-full py-1.5 px-3 mb-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] font-bold transition flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-emerald-600" />
              <span>{L("Simulate Monthly EMI & Subsidy Savings", "மாதாந்திர EMI & சேமிப்பை கணக்கிடுக", "मासिक EMI एवं सब्सिडी बचत सिमुलेटर")}</span>
            </div>
            <ArrowRight className="w-3 h-3 text-emerald-600" />
          </button>
        )}

        {/* Failed Criteria Block (Ineligible) */}
        {!isEligible && scheme.failed_criteria?.length > 0 && (
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-3 mb-4 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-amber-900 tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{L(`Ineligibility Diagnostics (${scheme.failed_criteria.length} Failed):`, `தகுதி தோல்வி காரணங்கள் (${scheme.failed_criteria.length}):`, `अपात्रता निदान (${scheme.failed_criteria.length} नियम असफल):`)}</span>
            </div>
            {scheme.failed_criteria.map((fail, i) => (
              <div key={i} className="text-xs font-semibold text-amber-800 flex items-start gap-1.5 pl-1">
                <span className="text-amber-500 font-bold">•</span>
                <span>{fail}</span>
              </div>
            ))}
            {/* Dynamic Remediation Steps */}
            {scheme.remediation_steps && scheme.remediation_steps.length > 0 ? (
              <div className="mt-2 pt-2 border-t border-amber-200 space-y-1">
                <div className="text-[10px] uppercase font-black text-amber-900 tracking-wider">
                  💡 {L("Remediation Steps to Unlock:", "திறக்க வேண்டிய வழிகாட்டுதல்:", "अनलॉक करने के उपाय:")}
                </div>
                {scheme.remediation_steps.map((step, idx) => (
                  <div key={idx} className="text-[11px] font-bold text-amber-800 flex items-start gap-1">
                    <span>→</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-2 pt-2 border-t border-amber-200 text-[10px] text-amber-700 font-bold">
                💡 {L("Update Udyam registration or complete eKYC to unlock", "Udyam பதிவை புதுப்பிக்கவும் அல்லது eKYC முடிக்கவும்", "पंजीकरण अपडेट करें या eKYC पूरा करें")}
              </div>
            )}
          </div>
        )}

        {/* Passed Criteria (Eligible) */}
        {isEligible && scheme.passed_criteria?.length > 0 && (
          <div className="space-y-1 mb-4">
            {scheme.passed_criteria.slice(0, 2).map((pass, i) => (
              <div key={i} className="flex items-center space-x-1.5 text-xs text-slate-600">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{pass}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2">
        {isEligible ? (
          <>
            <button
              onClick={() => onApply ? onApply(scheme) : onSelect(scheme)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black py-2.5 px-3.5 rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition cursor-pointer"
            >
              <Landmark className="w-3.5 h-3.5 text-amber-300" />
              <span>{L("Apply via Partner Bank ➔", "வங்கிக்கு விண்ணப்பிக்க ➔", "बैंक आवेदन (JWT) ➔")}</span>
            </button>
            <button
              onClick={() => onSelect && onSelect(scheme)}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
              title="Full Audit Details"
            >
              <Info className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full flex items-center justify-between gap-2">
            <button
              disabled
              className="flex-1 bg-slate-200 text-slate-400 cursor-not-allowed text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>🔒 {L("Ineligible", "தகுதியற்றது", "अपात्र")} ({matchPercentage}%)</span>
            </button>
            <button
              onClick={() => onSelect && onSelect(scheme)}
              className="p-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition cursor-pointer"
              title="View Ineligibility Audit"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
