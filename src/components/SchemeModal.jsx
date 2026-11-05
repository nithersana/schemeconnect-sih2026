import React from 'react';
import { 
  X, CheckCircle, AlertTriangle, ExternalLink, FileText, 
  Download, Share2, Building2, ShieldCheck, Check, Clock
} from 'lucide-react';

export function SchemeModal({ scheme, lang, onClose, onShareWhatsApp }) {
  if (!scheme) return null;

  const displayName = lang === 'ta' && scheme.scheme_name_ta 
    ? scheme.scheme_name_ta 
    : (lang === 'hi' && scheme.scheme_name_hi ? scheme.scheme_name_hi : scheme.scheme_name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto card-shadow border border-slate-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/70 rounded-t-3xl">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {scheme.highlight_badge || "Central / State Scheme"}
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {scheme.readiness_score}% Readiness
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
              {displayName}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{scheme.ministry}</p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Key Financial Terms */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100">
              <span className="text-[10px] uppercase font-bold text-blue-500 block">Total Benefit</span>
              <span className="text-sm font-extrabold text-blue-900">{scheme.benefit_amount}</span>
            </div>
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100">
              <span className="text-[10px] uppercase font-bold text-emerald-600 block">Subsidy Rate</span>
              <span className="text-sm font-extrabold text-emerald-900">{scheme.subsidy}</span>
            </div>
            <div className="bg-purple-50/70 p-3.5 rounded-xl border border-purple-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] uppercase font-bold text-purple-600 block">Repayment Term</span>
              <span className="text-sm font-extrabold text-purple-900">{scheme.repayment_period || "36 Months"}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Official Objective</h4>
            <p className="text-sm text-slate-700 leading-relaxed">{scheme.description}</p>
          </div>

          {/* Matched & Unmatched Criteria Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Deterministic Eligibility Audit</h4>
            <div className="space-y-2">
              {scheme.matched_reasons.map((r, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 text-emerald-900">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
              {scheme.unmatched_reasons.map((r, i) => (
                <div key={i} className="flex items-start space-x-2 text-xs bg-amber-50 p-2.5 rounded-lg border border-amber-100 text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mandatory Application Checklist</h4>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              {scheme.documents_required.map((doc, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs text-slate-800">
                  <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                    {i + 1}
                  </div>
                  <span>{doc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/70 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => onShareWhatsApp(scheme)}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share on WhatsApp</span>
          </button>

          <a
            href={scheme.portal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition shadow-sm"
          >
            <span>Apply on Official Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

    </div>
  );
}
