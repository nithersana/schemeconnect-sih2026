/**
 * Beta Portal Token Gateway
 * Decodes incoming JWT referral tokens from SchemeConnect
 * and simulates the pre-filled application handshake.
 */
import React, { useState } from 'react';
import {
  ShieldCheck, CheckCircle2, AlertTriangle, Lock, Landmark,
  Clock, QrCode, FileText, User, IndianRupee, Zap, ArrowRight, X
} from 'lucide-react';
import { verifyAndDecodeReferralJWT } from '../utils/jwtToken';

export function BetaTokenGateway({ referredScheme, userProfile, onTokenAccepted, onDismiss, lang = "en" }) {
  const isTa = lang === "ta";
  const [manualToken, setManualToken] = useState('');
  const [decodedResult, setDecodedResult] = useState(null);
  const [error, setError] = useState(null);

  // Auto-decode if referredScheme already has a JWT token attached
  const autoJWT = referredScheme?._jwtToken;

  const decode = (token) => {
    const result = verifyAndDecodeReferralJWT(token);
    if (!result) {
      setError("Invalid token format.");
      return;
    }
    if (result.isExpired) {
      setError("⚠️ Token has expired. Please re-apply from SchemeConnect.");
      return;
    }
    setError(null);
    setDecodedResult(result);
  };

  const handleManualDecode = () => {
    if (!manualToken.trim()) return;
    decode(manualToken.trim());
  };

  // Use auto-token if available
  React.useEffect(() => {
    if (autoJWT) decode(autoJWT);
  }, [autoJWT]);

  const p = decodedResult?.payload;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-emerald-300 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-6 rounded-t-3xl flex items-start justify-between">
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-1">
              BETA PORTAL — TOKENIZED APPLICATION GATEWAY
            </div>
            <h2 className="text-xl font-black">
              {isTa ? "SchemeConnect JWT டோக்கன் சரிபார்ப்பு" : "SchemeConnect JWT Referral Verification"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isTa ? "15 நிமிட காலாவதி • கையொப்பமிடப்பட்ட eKYC சரிபார்ப்பு" : "15-minute expiry • Cryptographically signed eKYC pre-verification"}
            </p>
          </div>
          <button onClick={onDismiss} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* Manual Token Entry */}
          {!autoJWT && !decodedResult && (
            <div>
              <label className="text-xs font-black text-slate-700 uppercase tracking-wider block mb-2">
                {isTa ? "SchemeConnect JWT டோக்கனை ஒட்டவும்:" : "Paste SchemeConnect JWT Referral Token:"}
              </label>
              <div className="flex gap-2">
                <textarea
                  value={manualToken}
                  onChange={e => setManualToken(e.target.value)}
                  rows={3}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzY2hlbWVjb25uZWN0LmluIi..."
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-2xl text-xs font-mono resize-none focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button
                  onClick={handleManualDecode}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black transition"
                >
                  Decode
                </button>
              </div>
              {error && (
                <div className="mt-2 text-xs text-red-700 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Decoded JWT Result */}
          {decodedResult && p && (
            <div className="space-y-4 animate-fadeIn">

              {/* Token Status Banner */}
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <div>
                    <div className="text-sm font-black text-emerald-900">
                      {isTa ? "JWT டோக்கன் சரிபார்க்கப்பட்டது ✓" : "JWT Token Verified ✓"}
                    </div>
                    <div className="text-[10px] text-emerald-700 font-mono">
                      REF: {p.referral_id} • iss: {p.iss} → aud: {p.aud}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Expires {new Date(p.exp * 1000).toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Pre-filled Applicant Details */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-200">
                  {isTa ? "முன்னரே சரிபார்க்கப்பட்ட விண்ணப்பதாரர் விவரங்கள் (SchemeConnect eKYC)" : "Pre-Verified Applicant Details from SchemeConnect eKYC"}
                </div>
                <div className="p-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Applicant Name</span>
                    <span className="font-black text-slate-900">{p.applicant_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Age / Gender</span>
                    <span className="font-black text-slate-900">{p.applicant_age} Yrs / {p.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Location</span>
                    <span className="font-black text-slate-900">{p.district}, {p.state}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Sector / Category</span>
                    <span className="font-black text-slate-900">{p.sector} / {p.social_category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Annual Income</span>
                    <span className="font-black text-blue-900">₹{Number(p.annual_income).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Match Score</span>
                    <span className="font-black text-emerald-700">{p.match_score}% — {p.scheme_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Sanctioned Amount</span>
                    <span className="font-black text-blue-900 text-sm">₹{Number(p.sanction_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Interest Rate</span>
                    <span className="font-black text-emerald-700">{p.interest_rate}% p.a. (Concessional)</span>
                  </div>
                </div>

                {/* eKYC Verification Flags */}
                <div className="px-4 pb-4 flex flex-wrap gap-1.5">
                  {p.verification_flags?.ekyc_verified && (
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> eKYC Verified 🟢
                    </span>
                  )}
                  {(p.verification_flags?.ocr_status || p.verification_flags?.ocr_verified || p.verification_flags?.ocr_confidence) && (
                    <span className="text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> OCR Decision: {p.verification_flags?.ocr_status || "MATCH"} 🟢
                    </span>
                  )}
                  {p.verification_flags?.udyam_verified && (
                    <span className="text-[10px] font-black bg-indigo-100 text-indigo-800 border border-indigo-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Udyam Validated 🟢
                    </span>
                  )}
                  {p.verification_flags?.aa_cashflow_verified && (
                    <span className="text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> AA Cashflow Verified 🟢
                    </span>
                  )}
                  <span className="text-[10px] font-black bg-purple-100 text-purple-800 border border-purple-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Trust Score: {p.trust_score}%
                  </span>
                </div>
              </div>

              {/* Accept & Pre-fill Application */}
              <button
                onClick={() => onTokenAccepted(p)}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-2xl text-sm font-black transition shadow-xl flex items-center justify-center gap-2"
              >
                <Landmark className="w-5 h-5 text-amber-300" />
                <span>{isTa ? "முன் நிரப்பப்பட்ட விண்ணப்பத்தை ஏற்றுக்கொள்க & தொடர்க ➔" : "Accept Pre-Verified Application & Proceed to Officer Queue ➔"}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
