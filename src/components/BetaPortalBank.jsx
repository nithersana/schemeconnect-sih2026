import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, CheckCircle2, QrCode, Download, 
  ArrowRight, Landmark, Clock, FileText, UserCheck, AlertTriangle, 
  Sparkles, Radio, Check, X, Printer, IndianRupee, ExternalLink, Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  PARTICIPATING_BANKS, getBankApplications, 
  updateBankAppStatus, subscribeToBankApplications, createBankApplication 
} from '../utils/bankStore';

export function BetaPortalBank({ 
  referredScheme, 
  betaJWTPayload,
  userProfile, 
  lang = "en", 
  t, 
  onBackToSchemeConnect,
  onOpenSplitDemo,
  onOpenTrioDemo 
}) {
  const isTa = lang === "ta";
  const [activeTab, setActiveTab] = useState(referredScheme ? "apply" : "admin"); // 'banks', 'apply', 'admin', 'certificate'
  const [selectedBank, setSelectedBank] = useState(PARTICIPATING_BANKS[0]);
  const [applications, setApplications] = useState(getBankApplications());
  const [activeAppForCertificate, setActiveAppForCertificate] = useState(null);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState(null);

  // Subscribe to live updates across tabs
  useEffect(() => {
    const unsubscribe = subscribeToBankApplications((updatedApps, meta) => {
      setApplications(updatedApps);
      if (meta?.action === "NEW_APPLICATION_SUBMITTED") {
        setStatusSuccessMsg(`⚡ New application ${meta.appId} received from SchemeConnect!`);
        setTimeout(() => setStatusSuccessMsg(null), 5000);
      } else if (meta?.action === "APPLICATION_STATUS_UPDATED") {
        setStatusSuccessMsg(`✓ Application ${meta.appId} updated to ${meta.newStatus}!`);
        setTimeout(() => setStatusSuccessMsg(null), 5000);
      }
    });
    return unsubscribe;
  }, []);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    const schemeToApply = referredScheme || {
      scheme_id: "NSFDC_MICRO",
      scheme_name: "NSFDC Micro-Credit Finance Scheme",
      sanctioned_amount: 140000,
      concessional_interest_rate: 5.0,
      match_percentage: 100
    };

    const newApp = createBankApplication(schemeToApply, userProfile, selectedBank);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    setActiveTab("admin");
    setStatusSuccessMsg(`Application ${newApp.application_id} queued in Bank Officer Console!`);
    setTimeout(() => setStatusSuccessMsg(null), 4000);
  };

  const handleSanctionLoan = (app) => {
    const updated = updateBankAppStatus(app.application_id, "SANCTIONED");
    setApplications(updated);
    
    // Realtime Beta → SchemeConnect callback via BroadcastChannel
    try {
      const channel = new BroadcastChannel('schemeconnect_sanctions');
      channel.postMessage({
        action: 'LOAN_SANCTIONED',
        appId: app.application_id,
        schemeId: app.scheme_id,
        schemeName: app.scheme_name,
        bankName: app.bank_name,
        sanctionAmount: app.sanction_amount,
        timestamp: new Date().toISOString()
      });
      channel.close();
    } catch (e) {}

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const sanctionedApp = updated.find(a => a.application_id === app.application_id);
    setActiveAppForCertificate(sanctionedApp);
    setActiveTab("certificate");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8 border border-emerald-900/60 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Beta Portal • Partner Bank Credit Sanction Portal
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pre-Verified Welfare-to-Credit Handshake Gateway
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Receives verified digital tokens from SchemeConnect, pre-populates loan applications, and empowers bank branch managers to execute instant digital loan sanctions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenTrioDemo && (
              <button
                onClick={onOpenTrioDemo}
                className="px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black text-xs shadow-lg flex items-center gap-2 transition"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Triple-Portal Ecosystem View</span>
              </button>
            )}

            {onBackToSchemeConnect && (
              <button
                onClick={onBackToSchemeConnect}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-2xl font-bold text-xs transition"
              >
                ← Return to SchemeConnect
              </button>
            )}
          </div>
        </div>

        {/* Portal Tabs Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === "admin" 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bank Officer Sanction Console ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("apply")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === "apply" 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Fast-Track Loan Application Form</span>
          </button>

          <button
            onClick={() => setActiveTab("banks")}
            className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
              activeTab === "banks" 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Participating Banks Directory</span>
          </button>
        </div>

      </div>

      {/* Live Alert Toast */}
      {statusSuccessMsg && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-lg mb-6 flex items-center justify-between text-xs font-bold animate-fadeIn border border-emerald-400">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>{statusSuccessMsg}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">WEBSOCKET LIVE</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. BANK OFFICER SANCTION CONSOLE (/beta-portal/admin)      */}
      {/* ========================================================= */}
      {activeTab === "admin" && (
        <div className="space-y-6 animate-fadeIn">
          
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <Landmark className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-black text-slate-900">
                    Lead Bank Incoming Application Queue
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Applications pre-verified by SchemeConnect AI Matcher. Single-click to sanction and generate legal disbursement letter.
                </p>
              </div>

              <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                {applications.filter(a => a.verification_status === "SANCTIONED").length} Sanctioned • {applications.filter(a => a.verification_status === "PRE_VERIFIED").length} Pending Review
              </span>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">App Ref & Scheme</th>
                    <th className="py-3 px-4">Applicant & Income</th>
                    <th className="py-3 px-4">Sanction Amount</th>
                    <th className="py-3 px-4">eKYC & Match</th>
                    <th className="py-3 px-4">Assigned Bank</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Sanction Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {applications.map((app) => {
                    const isSanctioned = app.verification_status === "SANCTIONED";
                    return (
                      <tr key={app.application_id} className="hover:bg-slate-50 transition">
                        
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[11px] font-black text-blue-700 block">{app.application_id}</span>
                          <span className="font-bold text-slate-900 text-xs">{app.scheme_name}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-black text-slate-900 block">{app.applicant_name} ({app.applicant_age} yrs)</span>
                          <span className="text-slate-500 text-[10px]">Income: ₹{Number(app.annual_income).toLocaleString('en-IN')}/yr</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-black text-emerald-700 text-sm block">
                            ₹{Number(app.sanction_amount).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold">@ {app.interest_rate}% Concessional</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded flex items-center gap-1 w-fit">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>{app.match_score || 100}% Fit Match</span>
                            </span>
                            <div className="flex items-center gap-1 flex-wrap">
                              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                🟢 eKYC Passed
                              </span>
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                🟢 CIBIL: 742 (Prime)
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                          {app.bank_name}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 w-fit ${
                            isSanctioned 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                              : 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                          }`}>
                            {isSanctioned ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                            <span>{app.verification_status}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isSanctioned ? (
                            <button
                              onClick={() => {
                                setActiveAppForCertificate(app);
                                setActiveTab("certificate");
                              }}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1 ml-auto"
                            >
                              <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                              <span>View Certificate</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSanctionLoan(app)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-sm transition flex items-center gap-1.5 ml-auto"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                              <span>Sanction Loan</span>
                            </button>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 2. FAST-TRACK LOAN APPLICATION FORM (/beta-portal/apply)   */}
      {/* ========================================================= */}
      {activeTab === "apply" && (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8 animate-fadeIn">
          
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                SchemeConnect Pre-Verified Handshake
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Fast-Track Concessional Loan Application Form
              </h2>
            </div>
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>100% eKYC Verified</span>
            </span>
          </div>

          <form onSubmit={handleApplySubmit} className="space-y-6">
            
            {/* Scheme Banner */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase">Selected Target Scheme</span>
                  <h3 className="font-black text-slate-900 text-base">
                    {referredScheme?.scheme_name || "NSFDC Micro-Credit Finance Scheme"}
                  </h3>
                  <span className="text-xs text-slate-600">
                    {referredScheme?.ministry || "Ministry of Social Justice & Empowerment (MoSJE)"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sanction Limit</span>
                  <div className="text-base font-black text-blue-700">
                    ₹{Number(referredScheme?.sanctioned_amount || 140000).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Aadhaar eKYC Verified 🟢</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Income Validated (&lt;₹5L) 🟢</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Caste Certificate Synced 🟢</span>
              </div>
            </div>

            {/* Form Fields Pre-filled */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Applicant Legal Name</label>
                <input
                  type="text"
                  value={betaJWTPayload?.applicant_name || userProfile?.name || "Verified Citizen"}
                  readOnly
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-black text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Applicant Age</label>
                <input
                  type="text"
                  value={`${betaJWTPayload?.age || userProfile?.age || "—"} Years`}
                  readOnly
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-black text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Business Sector</label>
                <input
                  type="text"
                  value={betaJWTPayload?.sector || userProfile?.sector || "Micro-Enterprise"}
                  readOnly
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Annual Household Income</label>
                <input
                  type="text"
                  value={`₹${Number(userProfile?.income || 200000).toLocaleString('en-IN')}`}
                  readOnly
                  className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-emerald-800"
                />
              </div>
            </div>

            {/* Bank Branch Selector */}
            <div>
              <label className="block text-xs font-black uppercase text-slate-700 mb-2">
                Select Participating Lead Bank Branch:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PARTICIPATING_BANKS.map((b) => {
                  const isChosen = selectedBank.id === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBank(b)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        isChosen 
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-black text-slate-900 text-xs">{b.name}</span>
                        <span className="text-[10px] font-bold text-emerald-700">{b.npa_status}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{b.branch} • {b.ifsc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-xl transition flex items-center justify-center space-x-2"
              >
                <span>Submit Direct Application to {selectedBank.name} ➔</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>

        </div>
      )}

      {/* ========================================================= */}
      {/* 3. OFFICIAL PDF SANCTION LETTER VIEW                       */}
      {/* ========================================================= */}
      {activeTab === "certificate" && activeAppForCertificate && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl border-2 border-slate-300 shadow-2xl p-6 sm:p-8 animate-fadeIn text-slate-900">
          
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <Building2 className="w-6 h-6 text-slate-900" />
                <span className="text-base font-black uppercase tracking-wider text-slate-900">
                  {activeAppForCertificate.bank_name}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Specialized MSME & Concessional Credit Sanction Division • Government of India Partner
              </p>
            </div>

            {/* QR Code Container */}
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <QrCode className="w-10 h-10 text-slate-900 mx-auto" />
              <span className="text-[8px] font-mono text-slate-500 uppercase block mt-0.5">e-Verified</span>
            </div>
          </div>

          {/* Letter Details */}
          <div className="space-y-4 text-xs">
            
            <div className="flex justify-between items-center text-slate-600">
              <span><b>Letter Ref:</b> {activeAppForCertificate.sanction_letter_id || "SNCT-2026-9912"}</span>
              <span><b>Sanction Date:</b> {new Date().toLocaleDateString('en-IN')}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">To Beneficiary:</span>
              <div className="font-black text-slate-900 text-sm">{activeAppForCertificate.applicant_name} ({activeAppForCertificate.applicant_age} Yrs)</div>
              <div className="text-slate-600">{activeAppForCertificate.district}, Tamil Nadu</div>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-300 space-y-2">
              <div className="text-xs font-black uppercase text-emerald-900 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Official Loan Sanction Confirmation</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                We are pleased to convey the in-principle credit sanction under the <b>{activeAppForCertificate.scheme_name}</b> following SchemeConnect automated rule verification.
              </p>
              
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-bold border-t border-emerald-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">Sanctioned Capital:</span>
                  <span className="text-sm font-black text-emerald-900">₹{Number(activeAppForCertificate.sanction_amount).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Subsidized Interest Rate:</span>
                  <span className="text-sm font-black text-blue-900">{activeAppForCertificate.interest_rate}% p.a.</span>
                </div>
              </div>
            </div>

            {/* Signature Block */}
            <div className="pt-6 mt-4 border-t border-slate-200 flex justify-between items-end">
              <div className="text-[10px] text-slate-400 font-mono">
                Digitally Signed & Certified<br />
                SHA-256: 8f92a1bc7e4d90
              </div>

              <div className="text-right">
                <div className="font-serif italic font-bold text-slate-800 text-sm mb-1">M. Saravanan</div>
                <div className="font-bold text-[10px] text-slate-700">Chief Nodal Credit Manager</div>
                <div className="text-[9px] text-slate-500">{activeAppForCertificate.bank_name}</div>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-6 mt-6 border-t border-slate-100">
            <button
              onClick={() => window.print()}
              className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF Sanction Letter</span>
            </button>

            <button
              onClick={() => setActiveTab("admin")}
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition"
            >
              Back to Queue
            </button>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* 4. PARTICIPATING BANKS DIRECTORY                           */}
      {/* ========================================================= */}
      {activeTab === "banks" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          {PARTICIPATING_BANKS.map((bank) => (
            <div key={bank.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                    {bank.npa_status}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{bank.ifsc}</span>
                </div>
                <h3 className="text-base font-black text-slate-900 mb-1">{bank.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{bank.branch}</p>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1 mb-4">
                  <div className="text-slate-600"><b>Nodal Officer:</b> {bank.lead_officer}</div>
                  <div className="text-emerald-700 font-bold"><b>Special Incentive:</b> {bank.interest_concession}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedBank(bank);
                  setActiveTab("apply");
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <span>Select for Direct Sanction</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
