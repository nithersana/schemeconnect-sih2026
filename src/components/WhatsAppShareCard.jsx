import React from 'react';
import { X, Share2, Download, ShieldCheck, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export function WhatsAppShareCard({ scheme, profile, onClose }) {
  if (!scheme) return null;

  const handleSendWhatsApp = () => {
    const text = `🇮🇳 *SchemeConnect Welfare Recommendation*\n\n` +
      `*Beneficiary:* ${profile?.name || "Entrepreneur"} (${profile?.caste}, ${profile?.occupation})\n` +
      `*Recommended Scheme:* ${scheme.scheme_name}\n` +
      `*Financial Benefit:* ${scheme.benefit_amount}\n` +
      `*Govt Subsidy:* ${scheme.subsidy}\n` +
      `*Readiness Score:* ${scheme.readiness_score}%\n\n` +
      `*Required Documents:*\n` +
      scheme.documents_required?.map(d => `• ${d}`).join('\n') +
      `\n\n*Apply Here:* ${scheme.portal_url}\n` +
      `_Forward to local SHGs & Community Groups_`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 card-shadow border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-800">WhatsApp Welfare Card Preview</span>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Shareable Card */}
        <div className="bg-gradient-to-tr from-slate-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-5 card-shadow border border-white/10 mb-5 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
              🇮🇳 MoSJE Welfare Pass
            </span>
            <span className="text-xs font-black text-emerald-400">
              {scheme.readiness_score}% Match
            </span>
          </div>

          <h3 className="font-extrabold text-base leading-snug mb-1 text-white">
            {scheme.scheme_name}
          </h3>
          <p className="text-[11px] text-slate-400 mb-3">{scheme.ministry}</p>

          <div className="bg-white/10 rounded-xl p-3 mb-3 border border-white/10 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Sanction Amount:</span>
              <span className="font-extrabold text-amber-300">{scheme.benefit_amount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Govt Subsidy:</span>
              <span className="font-bold text-emerald-400">{scheme.subsidy}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-white/10">
            <span>Beneficiary: {profile?.name || "Citizen"} ({profile?.caste})</span>
            <span>SIH 2026 • TechTitans</span>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleSendWhatsApp}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition"
        >
          <Share2 className="w-4 h-4" />
          <span>Forward to WhatsApp Groups / Contacts</span>
        </button>

      </div>
    </div>
  );
}
