import React from 'react';
import { X, CheckCircle, AlertTriangle, ArrowRight, ShieldCheck, Zap, Scale } from 'lucide-react';

export function SchemeCompareModal({ schemeA, schemeB, lang, onClose, onSelectScheme }) {
  if (!schemeA || !schemeB) return null;

  const getName = (s) => (lang === 'ta' && s.scheme_name_ta ? s.scheme_name_ta : (lang === 'hi' && s.scheme_name_hi ? s.scheme_name_hi : s.scheme_name));

  const rows = [
    { label: "Ministry / Department", a: schemeA.ministry, b: schemeB.ministry },
    { label: "Financial Benefit", a: schemeA.benefit_amount, b: schemeB.benefit_amount, highlight: true },
    { label: "Govt Subsidy / Rate", a: schemeA.subsidy, b: schemeB.subsidy, highlight: true },
    { label: "Target Social Group", a: schemeA.castes?.join(', ') || "All", b: schemeB.castes?.join(', ') || "All" },
    { label: "Max Annual Income", a: `₹${(schemeA.max_annual_income || 300000).toLocaleString()}`, b: `₹${(schemeB.max_annual_income || 300000).toLocaleString()}` },
    { label: "Eligible Occupations", a: schemeA.occupations?.slice(0, 3).join(', ') || "All", b: schemeB.occupations?.slice(0, 3).join(', ') || "All" },
    { label: "Repayment Term", a: schemeA.repayment_period || "36 Months", b: schemeB.repayment_period || "36 Months" },
    { label: "Application Mode", a: schemeA.application_type || "Online / CSC", b: schemeB.application_type || "Online / CSC" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto card-shadow border border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 rounded-t-3xl">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">Side-by-Side Scheme Comparison</h2>
              <p className="text-xs text-slate-500">Compare financial terms, subsidy percentages, and document requirements.</p>
            </div>
          </div>

          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scheme Titles Row */}
        <div className="grid grid-cols-2 gap-4 p-6 bg-slate-50 border-b border-slate-100">
          <div className="bg-white p-4 rounded-2xl border border-blue-200 card-shadow">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 mb-2 inline-block">
              {schemeA.readiness_score}% Match Score
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{getName(schemeA)}</h3>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-purple-200 card-shadow">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 mb-2 inline-block">
              {schemeB.readiness_score}% Match Score
            </span>
            <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{getName(schemeB)}</h3>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="p-6">
          <table className="w-full text-xs">
            <tbody className="divide-y divide-slate-100">
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                  <td className="py-3.5 px-4 font-bold text-slate-400 w-1/4 uppercase tracking-wider text-[10px]">
                    {row.label}
                  </td>
                  <td className={`py-3.5 px-4 w-3/8 ${row.highlight ? 'font-black text-blue-800 text-sm' : 'text-slate-700 font-medium'}`}>
                    {row.a}
                  </td>
                  <td className={`py-3.5 px-4 w-3/8 ${row.highlight ? 'font-black text-purple-800 text-sm' : 'text-slate-700 font-medium'}`}>
                    {row.b}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/70 rounded-b-3xl grid grid-cols-2 gap-4">
          <button
            onClick={() => { onClose(); onSelectScheme(schemeA); }}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
          >
            <span>Proceed with Scheme A</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { onClose(); onSelectScheme(schemeB); }}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
          >
            <span>Proceed with Scheme B</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
