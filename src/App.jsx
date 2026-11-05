import React, { useState, useEffect } from 'react';
import { Bot, Landmark, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { FormVerificationPage } from './components/FormVerificationPage';
import { RecommendationsGridPage } from './components/RecommendationsGridPage';
import { AlphaPortalConsole } from './components/AlphaPortalConsole';
import { BetaPortalBank } from './components/BetaPortalBank';
import { BetaTokenGateway } from './components/BetaTokenGateway';
import { SplitDemoView } from './components/SplitDemoView';
import { TripleDemoView } from './components/TripleDemoView';
import { FinancialCalculator } from './components/FinancialCalculator';
import { CenterLocator } from './components/CenterLocator';
import { AdminCMS } from './components/AdminCMS';
import { AiCounselorChat } from './components/AiCounselorChat';
import { ConsentModal } from './components/ConsentModal';
import { AllSchemesCatalog } from './components/AllSchemesCatalog';
import { AlphaApp } from './AlphaApp';
import { BetaApp } from './BetaApp';

import { TRANSLATIONS } from './data/translations';
import { hasConsented, grantConsent, revokeConsent, detectActivePortal } from './config/portalConfig';

export default function App() {
  // ── Standalone Portal Detection for Separate Tabs/Domains ────────────────
  const activePortal = detectActivePortal();
  if (activePortal === 'alpha') {
    return <AlphaApp />;
  }
  if (activePortal === 'beta') {
    return <BetaApp />;
  }

  // ── Language: 'en' | 'ta' | 'hi' ─────────────────────────────────────────
  const [lang, setLang] = useState('en');

  // ── View Router: New Applicant Input Page comes first! ─────────────────────
  const [view, setView] = useState('find-schemes');

  // ── Zero Hardcoded: profile starts null until user fills the form ──────────
  const [currentProfile, setCurrentProfile] = useState(null);

  // ── Consent Gate (sessionStorage backed) ─────────────────────────────────
  const [consentGranted, setConsentGranted] = useState(hasConsented());
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [pendingViewAfterConsent, setPendingViewAfterConsent] = useState(null);

  // ── Beta Portal JWT State ─────────────────────────────────────────────────
  const [referredSchemeForBank, setReferredSchemeForBank] = useState(null);
  const [betaJWTPayload, setBetaJWTPayload] = useState(null);
  const [showJWTGateway, setShowJWTGateway] = useState(false);

  // ── Realtime Cross-Tab Sanction Callback from Beta Bank Portal ───────────
  const [sanctionNotification, setSanctionNotification] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("BroadcastChannel" in window)) return;
    const channel = new BroadcastChannel("schemeconnect_sanctions");
    channel.onmessage = (event) => {
      if (event.data) {
        setSanctionNotification(event.data);
        try { confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } }); } catch {}
        const timer = setTimeout(() => setSanctionNotification(null), 12000);
        return () => clearTimeout(timer);
      }
    };
    return () => channel.close();
  }, []);

  const [fontSize, setFontSize] = useState('base');
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  // ── Consent-gated navigation ──────────────────────────────────────────────
  const navigateTo = (targetView) => {
    if (targetView === 'recommendations' && !consentGranted && currentProfile) {
      setPendingViewAfterConsent(targetView);
      setShowConsentModal(true);
      return;
    }
    setView(targetView);
  };

  // ── Logo / brand click: reset session ─────────────────────────────────────
  const handleLogoClick = () => {
    setCurrentProfile(null);
    revokeConsent();
    setConsentGranted(false);
    setReferredSchemeForBank(null);
    setBetaJWTPayload(null);
    setView('find-schemes');
  };

  // ── Consent Modal handlers ────────────────────────────────────────────────
  const handleConsentAccepted = (consentLang) => {
    grantConsent();
    setConsentGranted(true);
    setShowConsentModal(false);
    if (consentLang && consentLang !== lang) setLang(consentLang);
    setView(pendingViewAfterConsent || 'find-schemes');
    setPendingViewAfterConsent(null);
  };

  const handleConsentDeclined = () => {
    setShowConsentModal(false);
    setPendingViewAfterConsent(null);
    setView('landing');
  };

  // ── Form submitted ─────────────────────────────────────────────────────────
  const handleProfileSubmitted = (profile) => {
    setCurrentProfile(profile);
    try { confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } }); } catch {}
    setView('recommendations');
  };

  // ── Route to Bank (with JWT gateway) ─────────────────────────────────────
  const handleRouteToBank = (scheme) => {
    setReferredSchemeForBank(scheme);
    if (scheme._jwtToken) {
      setShowJWTGateway(true);
    } else {
      try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch {}
      setView('beta-portal');
    }
  };

  const handleJWTTokenAccepted = (jwtPayload) => {
    setBetaJWTPayload(jwtPayload);
    setShowJWTGateway(false);
    try { confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } }); } catch {}
    setView('beta-portal');
  };

  const getFontSizeClass = () => {
    if (fontSize === 'lg') return 'text-lg';
    if (fontSize === 'sm') return 'text-sm';
    return 'text-base';
  };

  // ── Triple-Portal Pitch Views (no consent needed — demo only) ────────────
  if (view === 'demo-trio') {
    return (
      <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${getFontSizeClass()}`}>
        <Navbar lang={lang} setLang={setLang} t={t} view={view} setView={navigateTo}
          isOnline={true} fontSize={fontSize} setFontSize={setFontSize} onLogoClick={handleLogoClick} />
        <TripleDemoView userProfile={currentProfile} lang={lang} t={t}
          onEditProfile={() => navigateTo('find-schemes')} onOpenCalculator={() => navigateTo('calc')}
          onOpenLocator={() => navigateTo('locator')} onOpenCounselor={() => navigateTo('counselor')}
          onRouteToBank={handleRouteToBank} />
      </div>
    );
  }

  if (view === 'demo-split' || view === 'split-demo') {
    return (
      <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${getFontSizeClass()}`}>
        <Navbar lang={lang} setLang={setLang} t={t} view={view} setView={navigateTo}
          isOnline={true} fontSize={fontSize} setFontSize={setFontSize} onLogoClick={handleLogoClick} />
        <SplitDemoView userProfile={currentProfile} lang={lang} t={t}
          onEditProfile={() => navigateTo('find-schemes')} onOpenCalculator={() => navigateTo('calc')}
          onOpenLocator={() => navigateTo('locator')} onOpenCounselor={() => navigateTo('counselor')} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50/70 text-slate-900 flex flex-col ${getFontSizeClass()}`}>

      {/* Consent Modal Overlay */}
      {showConsentModal && (
        <ConsentModal
          initialLang={lang}
          onAccept={handleConsentAccepted}
          onDecline={handleConsentDeclined}
        />
      )}

      {/* JWT Token Gateway Overlay */}
      {showJWTGateway && referredSchemeForBank && (
        <BetaTokenGateway
          referredScheme={referredSchemeForBank}
          userProfile={currentProfile}
          lang={lang}
          onTokenAccepted={handleJWTTokenAccepted}
          onDismiss={() => { setShowJWTGateway(false); setView('beta-portal'); }}
        />
      )}

      {/* Real-time Cross-Tab Sanction Toast */}
      {sanctionNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-950 text-white border-2 border-emerald-500 rounded-3xl p-4 shadow-2xl animate-bounce flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                Cross-Tab Callback (Beta Bank Portal)
              </span>
              <button 
                onClick={() => setSanctionNotification(null)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer ml-2"
              >
                ✕
              </button>
            </div>
            <h4 className="text-sm font-black text-white mt-0.5">
              🎉 Loan Sanction Approved!
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Bank Officer approved <b>{sanctionNotification.schemeName || "Concessional Loan"}</b> for <b>{sanctionNotification.beneficiaryName || "Beneficiary"}</b>.
            </p>
            <div className="mt-2 text-[10px] font-mono text-emerald-300 bg-emerald-950/80 px-2 py-1 rounded-lg border border-emerald-800/60">
              Ref: {sanctionNotification.referralId || "SANCTION-CONFIRMED"} • 100% Disbursed
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar lang={lang} setLang={setLang} t={t} view={view} setView={navigateTo}
        isOnline={true} fontSize={fontSize} setFontSize={setFontSize} onLogoClick={handleLogoClick} />

      <main className="flex-1">

        {/* LANDING PAGE */}
        {(view === 'landing' || view === 'home') && (
          <LandingPage lang={lang} setLang={setLang} t={t}
            onNavigate={navigateTo} />
        )}

        {/* FORM — Applicant Input Page (Comes First!) */}
        {(view === 'find-schemes' || view === 'form') && (
          <FormVerificationPage
            initialProfile={null}
            lang={lang}
            t={t}
            onSubmit={handleProfileSubmitted}
            onBack={() => setView('all-schemes')}
          />
        )}

        {/* ALL SCHEMES CATALOG (Dedicated Separate Section) */}
        {(view === 'all-schemes' || view === 'catalog') && (
          <AllSchemesCatalog
            lang={lang}
            t={t}
            onStartIntake={() => navigateTo('find-schemes')}
            onOpenCalculator={(scheme) => navigateTo('calc')}
            onOpenAlphaPortal={() => navigateTo('alpha-portal')}
          />
        )}

        {/* RECOMMENDATIONS */}
        {(view === 'recommendations' || view === 'feed' || view === 'results') && (
          <RecommendationsGridPage
            userProfile={currentProfile}
            lang={lang}
            t={t}
            onEditProfile={() => setView('find-schemes')}
            onOpenCalculator={() => setView('calc')}
            onOpenLocator={() => setView('locator')}
            onOpenCounselor={() => setView('counselor')}
            onOpenSplitDemo={() => setView('demo-split')}
            onOpenTrioDemo={() => setView('demo-trio')}
            onOpenAdmin={() => setView('alpha-portal')}
            onRouteToBank={handleRouteToBank}
          />
        )}

        {/* ALPHA PORTAL */}
        {view === 'alpha-portal' && (
          <AlphaPortalConsole lang={lang} onOpenSplitDemo={() => setView('demo-split')} />
        )}

        {/* BETA PORTAL */}
        {view === 'beta-portal' && (
          <BetaPortalBank
            referredScheme={referredSchemeForBank}
            betaJWTPayload={betaJWTPayload}
            userProfile={currentProfile}
            lang={lang}
            t={t}
            onBackToSchemeConnect={() => setView('recommendations')}
            onOpenSplitDemo={() => setView('demo-split')}
            onOpenTrioDemo={() => setView('demo-trio')}
          />
        )}

        {/* FINANCIAL CALCULATOR */}
        {view === 'calc' && (
          <div className="py-4">
            <FinancialCalculator
              initialProjectCost={currentProfile?.estimated_cost || null}
              lang={lang}
              t={t}
            />
          </div>
        )}

        {/* GEO-SPATIAL LOCATOR */}
        {view === 'locator' && (
          <div className="py-4">
            <CenterLocator
              lang={lang}
              t={t}
              defaultDistrict={currentProfile?.district || ""}
            />
          </div>
        )}

        {/* AI MITRA COUNSELOR */}
        {view === 'counselor' && (
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm mb-2">
                <Bot className="w-5 h-5" />
                <span>AI Mitra Welfare Counselor</span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-4">
                Conversational Welfare Counselor (English / தமிழ் / हिंदी)
              </h2>
              <AiCounselorChat lang={lang} t={t} isEmbedded={true} currentProfile={currentProfile} />
            </div>
          </div>
        )}

        {/* ADMIN CMS */}
        {view === 'admin' && (
          <AdminCMS lang={lang} t={t} />
        )}

      </main>

      {/* Floating AI Mitra (global) */}
      {view !== 'counselor' && view !== 'demo-split' && view !== 'demo-trio' && (
        <AiCounselorChat lang={lang} t={t} currentProfile={currentProfile} />
      )}

      {/* Footer */}
      {view !== 'demo-split' && view !== 'demo-trio' && (
        <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="font-semibold text-slate-700">
              SchemeConnect · Alpha Portal · Beta Portal — SIH 2026 Triple-Portal Ecosystem
            </span>
            <span>
              Team <strong>TechTitans</strong> (SIH-9E972H) · Saranathan College of Engineering
            </span>
          </div>
        </footer>
      )}

    </div>
  );
}
