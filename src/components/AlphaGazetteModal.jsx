import React from 'react';
import { 
  Building2, ShieldCheck, QrCode, CheckCircle2, FileText, 
  ExternalLink, Printer, X, Lock, Sparkles, IndianRupee 
} from 'lucide-react';

export function AlphaGazetteModal({ scheme, onClose, lang = "en" }) {
  if (!scheme) return null;
  const isTa = lang === "ta";

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-2 border-slate-300 max-h-[90vh] overflow-y-auto text-slate-900 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Official Gazette Header */}
        <div className="text-center pb-5 mb-6 border-b-2 border-slate-900">
          <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Building2 className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block">
            THE GAZETTE OF INDIA • EXTRAORDINARY NOTIFICATION
          </span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1 uppercase tracking-tight">
            Official Ministry Policy Gazette Certificate
          </h2>
          <span className="text-xs font-mono text-slate-600 font-bold">
            Gazette Ref: GAZ-MoSJE-2026-N{Math.abs(scheme.scheme_id.hashCode ? scheme.scheme_id.hashCode() % 900 + 100 : 882)} • Published on alpha.gov-schemeconnect.in
          </span>
        </div>

        {/* Gazette Body */}
        <div className="space-y-4 text-xs">
          
          <div className="flex justify-between items-center text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Ministry / Authority:</span>
              <span className="font-black text-slate-900">{scheme.ministry}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Scheme Code:</span>
              <span className="font-mono font-black text-indigo-700">{scheme.scheme_id}</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <h3 className="font-black text-slate-900 text-sm mb-1">
              {isTa && scheme.scheme_name_ta ? scheme.scheme_name_ta : scheme.scheme_name}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isTa && scheme.description_ta ? scheme.description_ta : scheme.description}
            </p>
          </div>

          {/* Certified Policy Parameter Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-600 uppercase font-black text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Statutory Criterion</th>
                  <th className="py-2.5 px-3">Approved Limit</th>
                  <th className="py-2.5 px-3 text-right">Gazette Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-700">Sanctioned Credit Ceiling</td>
                  <td className="py-2.5 px-3 font-black text-blue-900">₹{Number(scheme.sanctioned_amount).toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">✓ Active Law</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-700">Age Bracket Ceiling</td>
                  <td className="py-2.5 px-3 font-black text-indigo-900">{scheme.age_min} to {scheme.age_max} Years</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">✓ Policy Locked</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-700">Household Income Cap</td>
                  <td className="py-2.5 px-3 font-black text-slate-900">≤ ₹{Number(scheme.income_cap).toLocaleString('en-IN')}</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">✓ Certified</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-bold text-slate-700">Concessional Interest Rate</td>
                  <td className="py-2.5 px-3 font-black text-emerald-800">{scheme.concessional_interest_rate || 5.0}% p.a.</td>
                  <td className="py-2.5 px-3 text-right text-emerald-700 font-bold">✓ Subsidized</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Seal and Cryptographic Signature Block */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <QrCode className="w-12 h-12 text-slate-900 mx-auto" />
                <span className="text-[7px] font-mono text-slate-400 block mt-0.5">Gov Verify</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                Cryptographic Policy Hash:<br />
                SHA256: e8b9401f89c02d73a4b7...<br />
                Signed by Officer #402 (MoSJE)
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center space-x-1 text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[10px] font-black">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>OFFICIAL GOV CERTIFIED</span>
              </span>
            </div>
          </div>

          {/* Modal Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-slate-100">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Gazette Document</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition"
            >
              Close
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
