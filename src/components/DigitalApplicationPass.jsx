import React from 'react';
import { X, Printer, ShieldCheck, QrCode, CheckCircle2, User, Building2, Calendar, FileText } from 'lucide-react';

export function DigitalApplicationPass({ scheme, profile, onClose }) {
  if (!scheme) return null;

  const appRef = `SC-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto card-shadow border border-slate-200 print:max-w-none print:m-0 print:border-none print:shadow-none">
        
        {/* Pass Action Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-3xl print:hidden">
          <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official Beneficiary Pre-Screening Pass (MoSJE Verified)</span>
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Pass Container */}
        <div className="p-6 sm:p-8 bg-white" id="printable-pass">
          
          {/* Header with National Emblem & Watermark */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold tracking-widest text-slate-500 uppercase">Government of India / State Welfare Portal</span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">SchemeConnect Beneficiary Pass</h2>
              <p className="text-xs text-slate-600 font-medium">Ministry of Social Justice & Empowerment • Pre-Screening Verification</p>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">Application Ref ID</span>
              <span className="text-sm font-black font-mono text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 block">
                {appRef}
              </span>
              <span className="text-[10px] text-slate-500 mt-1 block">Issued: {dateStr}</span>
            </div>
          </div>

          {/* Citizen Details Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Applicant Name</span>
              <span className="font-extrabold text-slate-900">{profile?.name || "Rajan S."}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Age / Gender</span>
              <span className="font-extrabold text-slate-900">{profile?.age || 55} Yrs • {profile?.gender || "Male"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Social Category</span>
              <span className="font-extrabold text-slate-900">{profile?.caste || "SC"}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Annual Income</span>
              <span className="font-extrabold text-emerald-700">₹{profile?.annual_income?.toLocaleString() || "72,000"}</span>
            </div>
          </div>

          {/* Scheme Sanction Summary */}
          <div className="border border-blue-200 bg-blue-50/50 p-5 rounded-2xl mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white uppercase tracking-wider">
                Target Welfare Scheme
              </span>
              <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                {scheme.readiness_score}% Deterministic Eligibility Match
              </span>
            </div>

            <h3 className="text-base font-extrabold text-slate-900 mb-1">{scheme.scheme_name}</h3>
            <p className="text-xs text-slate-600 mb-3">{scheme.ministry}</p>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-blue-200/60">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Sanction / Loan Amount:</span>
                <span className="font-extrabold text-blue-900 text-sm">{scheme.benefit_amount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Government Subsidy Component:</span>
                <span className="font-extrabold text-emerald-800 text-sm">{scheme.subsidy}</span>
              </div>
            </div>
          </div>

          {/* Document Verification Checklist */}
          <div className="mb-6">
            <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Mandatory Physical Verification Checklist for CSC / Bank Officer</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {scheme.documents_required?.map((doc, idx) => (
                <div key={idx} className="p-2 rounded-lg border border-slate-200 flex items-center space-x-2 bg-white">
                  <div className="w-4 h-4 border-2 border-slate-400 rounded flex items-center justify-center text-[10px] font-bold text-slate-700 shrink-0">
                    ✓
                  </div>
                  <span className="text-slate-800 font-medium">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QR Code & CSC Instructions */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider block">Instructions for Field CSC Operator:</span>
              <p className="text-xs text-slate-300 max-w-sm">
                Scan the QR code or quote Ref <strong>{appRef}</strong> on the official portal (<em>{scheme.portal_url}</em>) to bypass manual form filling and submit instant bio-metric enrollment.
              </p>
            </div>
            <div className="w-16 h-16 bg-white p-1.5 rounded-xl shrink-0 flex items-center justify-center">
              <QrCode className="w-full h-full text-slate-900" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
