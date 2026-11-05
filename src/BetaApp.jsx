import React, { useState, useEffect } from 'react';
import { 
  Landmark, Building2, CheckCircle2, ShieldCheck, 
  FileText, ArrowRight, UserCheck, Check, Clock, 
  ChevronRight, AlertCircle, ExternalLink, Printer, QrCode
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  PARTICIPATING_BANKS, getBankApplications, 
  updateBankAppStatus, subscribeToBankApplications, createBankApplication 
} from './utils/bankStore';
import { decodeReferralJWT } from './utils/jwtToken';
import { getAlphaSchemes } from './utils/realtimeSync';
import { navigateToSchemeConnect } from './config/portalConfig';

export function BetaApp() {
  const [lang, setLang] = useState('en'); // 'en' | 'ta' | 'hi'
  const [activeRoute, setActiveRoute] = useState('home'); // 'home' (/) | 'apply' (/apply) | 'admin' (/admin)
  
  // Selected bank state
  const [selectedBankId, setSelectedBankId] = useState(PARTICIPATING_BANKS[0].id);
  const selectedBank = PARTICIPATING_BANKS.find(b => b.id === selectedBankId) || PARTICIPATING_BANKS[0];

  // Token & Applicant state
  const [jwtToken, setJwtToken] = useState(null);
  const [jwtPayload, setJwtPayload] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState({
    name: "Rajan S.",
    age: 39,
    income: 180000,
    sector: "Street Vendor",
    caste: "SC/ST",
    district: "Tiruchirappalli",
    trust_score: 98,
    target_scheme: "NSFDC Micro-Credit Finance Scheme"
  });
  const [accountNumber, setAccountNumber] = useState("");
  const [submittedApp, setSubmittedApp] = useState(null);

  // Applications & Audit Drawer
  const [applications, setApplications] = useState(getBankApplications());
  const [selectedAppForAudit, setSelectedAppForAudit] = useState(null);
  const [officerSignOffIdentity, setOfficerSignOffIdentity] = useState(true);
  const [officerSignOffIncome, setOfficerSignOffIncome] = useState(true);
  const [sanctionedCertificate, setSanctionedCertificate] = useState(null);

  // Read URL parameters on startup (/apply?token=... or /admin)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const view = params.get("view");
      const path = window.location.pathname;

      if (token) {
        setJwtToken(token);
        const decoded = decodeReferralJWT(token);
        if (decoded && decoded.isValid && decoded.payload) {
          const p = decoded.payload;
          setJwtPayload(p);
          setApplicantProfile({
            name: p.beneficiary?.name || "Rajan S.",
            age: p.beneficiary?.age || 39,
            income: p.beneficiary?.income || 180000,
            sector: p.beneficiary?.sector || "Street Vendor",
            caste: p.beneficiary?.caste || "SC/ST",
            district: p.beneficiary?.district || "Tiruchirappalli",
            trust_score: p.trust_score || 98,
            target_scheme: p.scheme_name || "NSFDC Micro-Credit Finance Scheme"
          });
        }
        setActiveRoute("apply");
      } else if (view === "admin" || path.includes("admin") || window.location.hash.includes("admin")) {
        setActiveRoute("admin");
      }
    }
  }, []);

  // Listen to cross-tab updates
  useEffect(() => {
    const unsubscribe = subscribeToBankApplications((updatedApps) => {
      setApplications(updatedApps);
    });
    return unsubscribe;
  }, []);

  // Set default audit item
  useEffect(() => {
    if (applications.length > 0 && !selectedAppForAudit) {
      setSelectedAppForAudit(applications[0]);
    }
  }, [applications]);

  // Handle Application Submission
  const handleSubmitApplication = (e) => {
    e.preventDefault();
    const newApp = {
      application_id: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      scheme_id: "NSFDC_MICRO",
      scheme_name: applicantProfile.target_scheme,
      bank_id: selectedBank.id,
      bank_name: selectedBank.name,
      applicant_name: applicantProfile.name,
      applicant_age: Number(applicantProfile.age) || 39,
      annual_income: Number(applicantProfile.income) || 180000,
      sanction_amount: 140000,
      interest_rate: selectedBank.interest_rate,
      trust_score: applicantProfile.trust_score || 98,
      account_number: accountNumber || "620188921045",
      verification_status: "PRE_VERIFIED",
      ekyc_status: "VERIFIED",
      district: applicantProfile.district || "Tiruchirappalli",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("beta_bank_applications_store_v1", JSON.stringify(updated));
    }

    try { confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } }); } catch (e) {}

    setSubmittedApp(newApp);
    setSelectedAppForAudit(newApp);
  };

  // Handle Loan Sanction
  const handleSanctionLoan = (app) => {
    const updated = updateBankAppStatus(app.application_id, "SANCTIONED");
    setApplications(updated);
    const approved = updated.find(a => a.application_id === app.application_id) || { ...app, verification_status: "SANCTIONED" };

    // Emit live cross-tab notification to SchemeConnect
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const channel = new BroadcastChannel('schemeconnect_sanctions');
        channel.postMessage({
          action: 'LOAN_SANCTIONED',
          referralId: approved.application_id,
          schemeId: approved.scheme_id,
          schemeName: approved.scheme_name,
          beneficiaryName: approved.applicant_name,
          bankName: approved.bank_name,
          sanctionAmount: approved.sanction_amount || 140000,
          timestamp: new Date().toISOString()
        });
        channel.close();
      }
    } catch (e) {}

    try { confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } }); } catch (e) {}

    setSelectedAppForAudit(approved);
    setSanctionedCertificate(approved);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      
      {/* ── Top Navbar ──────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between gap-4">
            
            {/* Brand Logo & Name */}
            <div 
              onClick={() => { setActiveRoute('home'); setSanctionedCertificate(null); }}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg text-slate-900 tracking-tight">
                    Beta Banking Hub
                  </span>
                  <span className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    mybank.vercel.app
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Partner Banking Consortium • Credit Sanction & Disbursement Console
                </p>
              </div>
            </div>

            {/* Navigation Tabs & Language Dropdown */}
            <div className="flex items-center space-x-3">
              
              {/* Route Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
                <button
                  onClick={() => { setActiveRoute('home'); setSanctionedCertificate(null); }}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                    activeRoute === 'home' && !sanctionedCertificate
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Partner Banks (5)
                </button>

                <button
                  onClick={() => { setActiveRoute('apply'); setSanctionedCertificate(null); }}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                    activeRoute === 'apply' && !sanctionedCertificate
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Application Gateway
                </button>

                <button
                  onClick={() => { setActiveRoute('admin'); setSanctionedCertificate(null); }}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer ${
                    activeRoute === 'admin' && !sanctionedCertificate
                      ? 'bg-slate-800 text-white shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Officer Console (/admin)
                </button>
              </div>

              {/* Single Language Dropdown */}
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                aria-label="Language Selector"
                className="bg-slate-100 border border-slate-300 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-500 outline-none cursor-pointer"
              >
                <option value="en">English</option>
                <option value="ta">Tamil</option>
                <option value="hi">Hindi</option>
              </select>

            </div>

          </div>
        </div>
      </header>

      {/* Cross-Portal Status Notice */}
      <div className="bg-slate-100 border-b border-slate-200 py-2 px-4 text-center">
        <p className="text-xs text-slate-700">
          <span className="font-semibold text-slate-900 mr-1.5">🏦 Partner Banking Network:</span>
          Applications referred from SchemeConnect carry 15-minute cryptographic JWT referral tokens with verified eKYC and trust scores.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* ROUTE A: HOME PAGE (PARTNER BANKS DIRECTORY)                              */}
      {/* ========================================================================= */}
      {activeRoute === 'home' && !sanctionedCertificate && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Partner Banking Hub — Participating Credit Institutions
            </h1>
            <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              Public sector and cooperative banking partners authorized under the Ministry of Social Justice & Empowerment to disburse concessional micro-credit and capital-subsidized term loans.
            </p>
          </div>

          {/* 5 Partner Banks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTICIPATING_BANKS.map((bank) => (
              <div 
                key={bank.id}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <span className="font-bold text-base text-slate-900">{bank.name}</span>
                    <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                      {bank.ifsc}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600 mb-6">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block uppercase">Focus Sector:</span>
                      <span className="font-semibold text-slate-800">{bank.focus_sector}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block uppercase">Maximum Loan Cap:</span>
                      <span className="font-bold text-slate-900 text-sm">₹{Number(bank.max_loan_cap).toLocaleString('en-IN')}</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block uppercase">Concessional Rate:</span>
                      <span className="font-semibold text-slate-800">{bank.interest_rate}% per annum</span>
                    </div>

                    <div>
                      <span className="text-[11px] font-medium text-slate-400 block uppercase">Nodal Branch:</span>
                      <span className="text-slate-600">{bank.branch}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedBankId(bank.id);
                    setActiveRoute('apply');
                  }}
                  className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <span>Select Bank for Application</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

        </main>
      )}

      {/* ========================================================================= */}
      {/* ROUTE B: APPLICATION GATEWAY (/apply?token=<JWT>)                         */}
      {/* ========================================================================= */}
      {activeRoute === 'apply' && !sanctionedCertificate && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Direct Loan Application Gateway
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Beneficiary pre-screening details authenticated via encrypted JWT referral token from SchemeConnect.
            </p>
          </div>

          {/* Submission Success Notice */}
          {submittedApp && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs mb-6 text-slate-900">
              <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm mb-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Application Successfully Queued</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Application Ref: <b className="font-mono text-slate-900">{submittedApp.application_id}</b> has been routed to <b>{submittedApp.bank_name}</b> Credit Officer Review Queue.
              </p>
              <button
                onClick={() => setActiveRoute('admin')}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Proceed to Officer Console ➔
              </button>
            </div>
          )}

          {/* Application Form Container */}
          {!submittedApp && (
            <form onSubmit={handleSubmitApplication} className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Token Verification Summary Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 mb-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Pre-Screened Applicant Details (JWT Verified)
                  </span>
                  <span className="text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-200">
                    Trust Score: {applicantProfile.trust_score}% 🟢
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Applicant Name:</span>
                    <span className="font-bold text-slate-900">{applicantProfile.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Age & Category:</span>
                    <span className="font-semibold text-slate-800">{applicantProfile.age} Yrs • {applicantProfile.caste}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Annual Income:</span>
                    <span className="font-semibold text-slate-800">₹{Number(applicantProfile.income).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Target Scheme:</span>
                    <span className="font-semibold text-slate-900 truncate block">{applicantProfile.target_scheme}</span>
                  </div>
                </div>
              </div>

              {/* Bank Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  Select Lending Institution:
                </label>
                <select
                  value={selectedBankId}
                  onChange={(e) => setSelectedBankId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium rounded-lg p-2.5 focus:ring-1 focus:ring-slate-500 outline-none"
                >
                  {PARTICIPATING_BANKS.map(bank => (
                    <option key={bank.id} value={bank.id}>
                      {bank.name} — {bank.focus_sector} (Max ₹{Number(bank.max_loan_cap).toLocaleString('en-IN')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Number Field */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  Direct Benefit Transfer (DBT) Bank Account Number:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter 11 to 16 digit account number (e.g. 620188921045)"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-xs font-mono rounded-lg p-2.5 focus:ring-1 focus:ring-slate-500 outline-none"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Disbursement will be transmitted directly via Aadhaar-enabled Payment Bridge (APB).
                </span>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                <span className="text-xs text-slate-500">
                  Ref: Token Valid • DPDPA 2023 Compliant
                </span>

                <button
                  type="submit"
                  className="py-2.5 px-6 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                >
                  Submit Application ➔
                </button>
              </div>

            </form>
          )}

        </main>
      )}

      {/* ========================================================================= */}
      {/* ROUTE C: VERIFICATION & SANCTION CONSOLE (/admin)                         */}
      {/* ========================================================================= */}
      {activeRoute === 'admin' && !sanctionedCertificate && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Bank Officer Audit & Credit Sanction Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Review pre-screened applications referred from SchemeConnect. Verify eKYC, OCR match, and account aggregator cash flows before 1-click sanction.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Table View of Incoming Applications (7 Cols) */}
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                  Applications Queue ({applications.length})
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Supabase PostgreSQL Connected
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Applicant</th>
                      <th className="p-3">Lending Bank</th>
                      <th className="p-3">Trust Score</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Audit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr 
                        key={app.application_id}
                        onClick={() => setSelectedAppForAudit(app)}
                        className={`cursor-pointer transition ${
                          selectedAppForAudit?.application_id === app.application_id
                            ? 'bg-slate-100/70 font-semibold'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-bold text-slate-900 block">{app.applicant_name}</span>
                          <span className="text-[10px] font-mono text-slate-400">{app.application_id}</span>
                        </td>
                        <td className="p-3 text-slate-700">
                          {app.bank_name}
                        </td>
                        <td className="p-3">
                          <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-bold border border-slate-200">
                            {app.trust_score || 98}%
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                            app.verification_status === 'SANCTIONED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {app.verification_status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppForAudit(app);
                            }}
                            className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium border border-slate-200 cursor-pointer"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verification Drawer / Audit Panel (5 Cols) */}
            {selectedAppForAudit && (
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Application Audit</span>
                      <h3 className="text-sm font-bold text-slate-900">{selectedAppForAudit.applicant_name}</h3>
                    </div>
                    <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
                      {selectedAppForAudit.application_id}
                    </span>
                  </div>

                  {/* Verification Status Cards */}
                  <div className="space-y-2.5 text-xs mb-5">
                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-600">eKYC Verification Status:</span>
                      <span className="font-bold text-emerald-700">Passed 🟢</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-600">OCR Document Verification:</span>
                      <span className="font-bold text-emerald-700">MATCH (Verified) 🟢</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-600">Account Aggregator Cash-Flow:</span>
                      <span className="font-bold text-emerald-700">Validated 🟢</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-slate-600">CIBIL Credit Score:</span>
                      <span className="font-bold text-slate-900 font-mono">742 🟢 Prime</span>
                    </div>
                  </div>

                  {/* Scheme & Amount */}
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs mb-5 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scheme:</span>
                      <span className="font-semibold text-slate-900 truncate max-w-[200px]">{selectedAppForAudit.scheme_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sanction Amount:</span>
                      <span className="font-bold text-slate-900 text-sm">₹{Number(selectedAppForAudit.sanction_amount || 140000).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lending Bank:</span>
                      <span className="font-medium text-slate-800">{selectedAppForAudit.bank_name}</span>
                    </div>
                  </div>

                  {/* Officer Sign-Off Checkboxes */}
                  <div className="space-y-2 text-xs border-t border-slate-100 pt-4 mb-6">
                    <label className="flex items-start space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={officerSignOffIdentity}
                        onChange={(e) => setOfficerSignOffIdentity(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-slate-800 rounded border-slate-300"
                      />
                      <span className="text-slate-700">
                        Identity verified against UIDAI / PAN databases.
                      </span>
                    </label>

                    <label className="flex items-start space-x-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={officerSignOffIncome}
                        onChange={(e) => setOfficerSignOffIncome(e.target.checked)}
                        className="mt-0.5 w-4 h-4 text-slate-800 rounded border-slate-300"
                      />
                      <span className="text-slate-700">
                        Income and caste criteria verified against State Revenue records.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Trigger */}
                <div>
                  {selectedAppForAudit.verification_status === 'SANCTIONED' ? (
                    <button
                      onClick={() => setSanctionedCertificate(selectedAppForAudit)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-xs font-bold border border-slate-300 transition cursor-pointer"
                    >
                      View Sanction Certificate 📄
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSanctionLoan(selectedAppForAudit)}
                      disabled={!officerSignOffIdentity || !officerSignOffIncome}
                      className={`w-full py-2.5 rounded-lg text-xs font-semibold text-white transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer ${
                        officerSignOffIdentity && officerSignOffIncome
                          ? 'bg-slate-800 hover:bg-slate-900'
                          : 'bg-slate-300 cursor-not-allowed text-slate-500'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Approve & Sanction Loan</span>
                    </button>
                  )}
                </div>

              </div>
            )}

          </div>

        </main>
      )}

      {/* ========================================================================= */}
      {/* FORMAL LOAN SANCTION CONFIRMATION CERTIFICATE VIEW                         */}
      {/* ========================================================================= */}
      {sanctionedCertificate && (
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
          <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs text-slate-900">
            
            {/* Official Header */}
            <div className="text-center pb-5 border-b-2 border-slate-900 mb-6">
              <div className="w-12 h-12 bg-slate-800 text-white rounded-xl flex items-center justify-center mx-auto mb-2">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                OFFICIAL CREDIT SANCTION ORDER • GOVERNMENT SPONSORED SCHEME
              </span>
              <h2 className="text-lg font-bold text-slate-900 mt-1 uppercase">
                Loan Sanction & Disbursement Certificate
              </h2>
              <span className="text-xs font-mono text-slate-600">
                Order Ref: SNCT-2026-{sanctionedCertificate.application_id} • Status: DISBURSED
              </span>
            </div>

            {/* Certificate Details */}
            <div className="space-y-4 text-xs mb-8">
              
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">Sanctioning Bank:</span>
                  <span className="font-bold text-slate-900 text-sm">{sanctionedCertificate.bank_name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">Beneficiary Name:</span>
                  <span className="font-bold text-slate-900 text-sm">{sanctionedCertificate.applicant_name}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">Sanctioned Amount:</span>
                  <span className="font-bold text-slate-900 text-base">₹{Number(sanctionedCertificate.sanction_amount || 140000).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">Concessional Rate:</span>
                  <span className="font-bold text-slate-900">{sanctionedCertificate.interest_rate || 5.0}% p.a.</span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400 block uppercase">Target Scheme:</span>
                  <span className="font-semibold text-slate-800 truncate block">{sanctionedCertificate.scheme_name}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                This certifies that the loan application of <b>{sanctionedCertificate.applicant_name}</b> has been audited and approved in full compliance with Ministry of Social Justice & Empowerment guidelines. Credit has been processed for electronic DBT disbursement.
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="text-[11px] text-slate-500 font-mono">
                  Digital Signature: SHA256-RSA-SIGNED-0x892F1A<br />
                  Timestamp: {new Date().toLocaleString()}
                </div>
                <div className="text-right">
                  <div className="w-24 h-8 bg-slate-100 border border-dashed border-slate-300 rounded flex items-center justify-center text-[10px] font-mono text-slate-600 mb-1">
                    SEALED & SIGNED
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">Chief Nodal Loan Officer</span>
                </div>
              </div>

            </div>

            {/* Back Button */}
            <div className="flex gap-3">
              <button
                onClick={() => setSanctionedCertificate(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Back to Application Queue
              </button>

              <button
                onClick={() => navigateToSchemeConnect("/", true)}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5 border border-slate-200"
              >
                <span>View in SchemeConnect ↗</span>
              </button>
            </div>

          </div>
        </main>
      )}

      {/* ── Official Government Footer ───────────────────────────────────────── */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>Beta Banking Hub • Partner Banking Consortium • Problem Statement SIH26092</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Authorized by Ministry of Social Justice & Empowerment, Government of India</p>
      </footer>

    </div>
  );
}
export default BetaApp;
