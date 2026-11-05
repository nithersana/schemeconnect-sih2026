/**
 * Portal Configuration — Decoupled Triple-Portal Architecture
 * Controls URLs, separate-tab inter-portal navigation, and domain detection for:
 * 1. Alpha Portal (Gov): alphagov.vercel.app / alpha.html
 * 2. SchemeConnect (Citizen): schemeconnect.vercel.app / index.html
 * 3. Beta Portal (Bank): mybank.vercel.app / beta.html
 */

// ─── Base URLs ─────────────────────────────────────────────────────────────
const IS_PROD = typeof window !== "undefined" && (
  window.location.hostname.includes("alphagov") ||
  window.location.hostname.includes("mybank") ||
  window.location.hostname.includes("schemeconnect.vercel.app")
);

const CURRENT_ORIGIN = typeof window !== "undefined" ? window.location.origin : "http://localhost:5173";

export const PORTAL_URLS = {
  // Production standalone domains or multi-page HTML / hash fallbacks
  SCHEMECONNECT: IS_PROD ? "https://schemeconnect.vercel.app" : `${CURRENT_ORIGIN}`,
  ALPHA:         IS_PROD ? "https://alphagov.vercel.app" : `${CURRENT_ORIGIN}/alpha.html`,
  BETA:          IS_PROD ? "https://mybank.vercel.app" : `${CURRENT_ORIGIN}/beta.html`,
};

/**
 * Automatically detects which portal should run in the current browser tab
 * based on hostname, pathname, search params, and hash.
 */
export function detectActivePortal() {
  if (typeof window === "undefined") return "schemeconnect";
  
  const host = window.location.hostname.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = window.location.search.toLowerCase();

  // Alpha Portal detection
  if (host.includes("alphagov") || host.includes("alpha.") || path.includes("alpha") || hash.includes("alpha") || search.includes("portal=alpha")) {
    return "alpha";
  }

  // Beta Banking Portal detection
  if (host.includes("mybank") || host.includes("beta.") || host.includes("bank") || path.includes("beta") || hash.includes("beta") || search.includes("portal=beta")) {
    return "beta";
  }

  return "schemeconnect";
}

// ─── Inter-Portal Navigation in Separate Browser Tabs ──────────────────────

/**
 * Open Alpha Portal in a separate browser tab
 * @param {string} schemeId - Optional scheme ID to inspect gazette
 * @param {boolean} openNewTab - Whether to launch in a separate browser tab (default: true)
 */
export function navigateToAlpha(schemeId = "", openNewTab = true) {
  const base = PORTAL_URLS.ALPHA;
  // If multi-page alpha.html or hash fallback
  const separator = base.includes(".html") ? "?" : "/#/";
  const query = schemeId ? `scheme=${schemeId}` : "";
  const url = base.includes(".html") 
    ? `${base}${query ? `?${query}` : ""}` 
    : `${base}${separator}alpha-portal${query ? `?${query}` : ""}`;

  console.log(`[PortalRouter] Launching Alpha Portal (Gov): ${url} [newTab: ${openNewTab}]`);
  if (openNewTab && typeof window !== "undefined") {
    window.open(url, "_blank");
  } else if (typeof window !== "undefined") {
    window.location.href = url;
  }
}

/**
 * Open Beta Portal (Partner Bank) in a separate browser tab with a signed JWT referral token
 * @param {string} jwtToken - Signed 15-min JWT referral token
 * @param {string} referralId - Referral identifier
 * @param {boolean} openNewTab - Whether to launch in a separate browser tab (default: true)
 */
export function navigateToBeta(jwtToken = "", referralId = "", openNewTab = true) {
  const base = PORTAL_URLS.BETA;
  const tokenParam = jwtToken ? `token=${encodeURIComponent(jwtToken)}` : "";
  const refParam = referralId ? `ref=${encodeURIComponent(referralId)}` : "";
  const params = [tokenParam, refParam].filter(Boolean).join("&");

  const url = base.includes(".html")
    ? `${base}${params ? `?${params}` : ""}`
    : `${base}/#/beta-portal${params ? `?${params}` : ""}`;

  console.log(`[PortalRouter] Launching Beta Portal (Bank) with JWT: ${url} [newTab: ${openNewTab}]`);
  if (openNewTab && typeof window !== "undefined") {
    window.open(url, "_blank");
  } else if (typeof window !== "undefined") {
    window.location.href = url;
  }
}

/**
 * Open SchemeConnect Citizen Engine in a separate browser tab
 * @param {string} path - Target path
 * @param {boolean} openNewTab - Whether to open in a new tab
 */
export function navigateToSchemeConnect(path = "/", openNewTab = false) {
  const base = PORTAL_URLS.SCHEMECONNECT;
  const url = `${base}${path ? `#${path}` : ""}`;
  
  console.log(`[PortalRouter] Launching SchemeConnect: ${url} [newTab: ${openNewTab}]`);
  if (openNewTab && typeof window !== "undefined") {
    window.open(url, "_blank");
  } else if (typeof window !== "undefined") {
    window.location.href = url;
  }
}

/**
 * One-Click Demo Action: Launches all 3 portals simultaneously in 3 separate browser tabs!
 */
export function openTriplePortalTabs() {
  if (typeof window === "undefined") return;
  // Tab 1: SchemeConnect (Citizen Intake)
  window.open(PORTAL_URLS.SCHEMECONNECT, "_blank");
  // Tab 2: Alpha Portal (Government Admin)
  window.open(PORTAL_URLS.ALPHA, "_blank");
  // Tab 3: Beta Portal (Bank Sanction Console)
  window.open(PORTAL_URLS.BETA, "_blank");
}

// ─── Consent Session Management (sessionStorage) ────────────────────────────
const CONSENT_KEY = "schemeconnect_consent_granted_v1";

export function hasConsented() {
  try {
    return sessionStorage.getItem(CONSENT_KEY) === "true";
  } catch {
    return false;
  }
}

export function grantConsent() {
  try {
    sessionStorage.setItem(CONSENT_KEY, "true");
  } catch {}
}

export function revokeConsent() {
  try {
    sessionStorage.removeItem(CONSENT_KEY);
  } catch {}
}

// ─── Portal Identities & Visual Theming ──────────────────────────────────────
export const PORTAL_IDENTITY = {
  SCHEMECONNECT: {
    id: "schemeconnect",
    name: "SchemeConnect",
    nameHi: "स्कीमकनेक्ट",
    nameTa: "திட்டங்கள் இணைப்பு",
    domain: "schemeconnect.vercel.app",
    role: "AI Multilingual Discovery & Pre-Screening Engine",
    color: "blue",
    badge: "Citizen Welfare Portal",
  },
  ALPHA: {
    id: "alpha",
    name: "Alpha Portal",
    nameHi: "अल्फा पोर्टल (सरकारी गजट)",
    nameTa: "ஆல்பா போர்டல் (அரசு)",
    domain: "alphagov.vercel.app",
    role: "Government Welfare Policy & Scheme Administration",
    color: "indigo",
    badge: "Official Gov Administration",
  },
  BETA: {
    id: "beta",
    name: "Beta Portal",
    nameHi: "बीटा पोर्टल (बैंक ऋण संस्वीकृति)",
    nameTa: "பீட்டா போர்டல் (வங்கி கடன் அனுமதி)",
    domain: "mybank.vercel.app",
    role: "Partner Bank Credit Sanction Hub",
    color: "emerald",
    badge: "Partner Banking Console",
  },
};
