import React, { useState } from 'react';
import { 
  Building2, CheckCircle, AlertTriangle, ChevronRight,
  Volume2, VolumeX, Scale, IndianRupee, ShieldCheck
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/speech';

export function SchemeCard({ scheme, lang = "ta", onSelect, onToggleCompare, isCompared }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const displayName = lang === 'ta' && scheme.scheme_name_ta 
    ? scheme.scheme_name_ta 
    : (lang === 'hi' && scheme.scheme_name_hi ? scheme.scheme_name_hi : (scheme.scheme_name || scheme.name));

  const handleAudioPlayback = (e) => {
    e.stopPropagation();
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const audioNarrative = `${displayName}. ${scheme.ministry}. நிதி உதவி: ${scheme.benefit_amount}. மானியம்: ${scheme.subsidy}.`;
      speakText(audioNarrative, lang, () => setIsPlayingAudio(false));
    }
  };

  const matchedReasons = scheme.matched_reasons || scheme.reasons || [];
  const unmatchedReasons = scheme.unmatched_reasons || [];
  const readiness = scheme.readiness_score !== undefined ? scheme.readiness_score : (scheme.is_eligible ? 90 : 50);

  return (
    <div className={`bg-white rounded-3xl border transition-all duration-200 shadow-sm overflow-hidden flex flex-col justify-between p-5 sm:p-6 ${
      isCompared ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50/10' : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
    }`}>
      
      {/* Top Header & Badges */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {scheme.highlight_badge || scheme.category || "Welfare Scheme"}
          </span>

          <div className="flex items-center space-x-1.5">
            {/* Audio Voice Narration Button */}
            <button
              onClick={handleAudioPlayback}
              title="Listen to Scheme Details"
              className={`p-1.5 rounded-full transition ${
                isPlayingAudio 
                  ? 'bg-blue-600 text-white animate-pulse' 
                  : 'bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {/* Match Score Pill */}
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              readiness >= 80 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              {readiness}% {lang === 'ta' ? "பொருத்தம்" : "Match"}
            </span>
          </div>
        </div>

        {/* Scheme Title */}
        <h3 className="font-black text-slate-900 text-base leading-snug tracking-tight mb-1">
          {displayName}
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-4">
          {scheme.ministry}
        </p>

        {/* Highlight Financial Box */}
        <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {lang === 'ta' ? "அதிகபட்ச கடன் உதவி" : "Benefit Amount"}
              </span>
              <span className="text-sm font-black text-blue-700">{scheme.benefit_amount}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                {lang === 'ta' ? "அரசு சலுகை / வட்டி" : "Concessional Terms"}
              </span>
              <span className="text-xs font-bold text-emerald-700">{scheme.concessional_interest_rate ? `${scheme.concessional_interest_rate}% p.a.` : scheme.subsidy}</span>
            </div>
          </div>
        </div>

        {/* Deterministic Match Reasons */}
        <div className="space-y-1.5 mb-5">
          {matchedReasons.slice(0, 2).map((r, i) => (
            <div key={i} className="flex items-start space-x-2 text-xs text-slate-600">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{r}</span>
            </div>
          ))}
          {unmatchedReasons.slice(0, 1).map((r, i) => (
            <div key={i} className="flex items-start space-x-2 text-xs text-amber-700">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span className="line-clamp-1">{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Row */}
      <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelect(scheme)}
          className="flex-1 bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition shadow-2xs"
        >
          <span>{lang === 'ta' ? "விவரங்களை காண்க" : "View Details"}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={(e) => { e.stopPropagation(); onToggleCompare(scheme); }}
          className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center transition ${
            isCompared 
              ? 'bg-blue-600 border-blue-600 text-white shadow-2xs' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="Compare with another scheme"
        >
          <Scale className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
