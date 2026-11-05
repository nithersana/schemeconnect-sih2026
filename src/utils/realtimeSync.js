/**
 * Realtime Synchronization Bridge for Alpha Portal & SchemeConnect
 * Supports:
 * 1. HTML5 BroadcastChannel ('alpha_schemes_live_sync') for instant inter-tab websocket simulation
 * 2. Supabase Realtime Client (PostgreSQL Listen/Notify on 'alpha_schemes' table)
 * 3. LocalStorage persistence for multi-window resilience
 */

import { INITIAL_ALPHA_SCHEMES } from '../data/alphaSchemesData';
import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = "alpha_schemes_store_v1";
const CHANNEL_NAME = "alpha_schemes_live_sync";

// Optional Supabase credentials from environment or fallback
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || "https://demo.supabase.co";
const SUPABASE_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy";

let supabaseClient = null;
try {
  if (SUPABASE_URL && SUPABASE_KEY && !SUPABASE_URL.includes("demo.supabase.co")) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
  }
} catch (e) {
  // Supabase fallback active
}

// Broadcast Channel setup
let broadcastChannel = null;
if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
}

/**
 * Loads current schemes from Storage or initial dataset
 */
export function getAlphaSchemes() {
  if (typeof window === "undefined") return INITIAL_ALPHA_SCHEMES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {}
  
  // Initialize storage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ALPHA_SCHEMES));
  return INITIAL_ALPHA_SCHEMES;
}

/**
 * Saves schemes and broadcasts update event
 */
export function saveAndBroadcastSchemes(schemesList, actionMeta = {}) {
  if (typeof window === "undefined") return;

  const payload = {
    schemes: schemesList,
    meta: {
      ...actionMeta,
      timestamp: new Date().toISOString()
    }
  };

  // 1. Save to LocalStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schemesList));

  // 2. Broadcast via BroadcastChannel
  if (broadcastChannel) {
    broadcastChannel.postMessage(payload);
  }

  // 3. Dispatch window event for same-tab reactive components
  window.dispatchEvent(new CustomEvent("alpha_schemes_live_event", { detail: payload }));
}

/**
 * Updates a specific scheme parameter and broadcasts
 */
export function updateAlphaScheme(schemeId, patch, reason = "Admin Parameter Adjustment") {
  const currentSchemes = getAlphaSchemes();
  const updatedSchemes = currentSchemes.map(s => {
    if (s.scheme_id === schemeId) {
      return {
        ...s,
        ...patch,
        updated_at: new Date().toISOString()
      };
    }
    return s;
  });

  saveAndBroadcastSchemes(updatedSchemes, {
    action: "UPDATE_SCHEME",
    schemeId,
    patch,
    reason
  });

  return updatedSchemes;
}

/**
 * Resets schemes back to default benchmark state
 */
export function resetAlphaSchemes() {
  saveAndBroadcastSchemes(INITIAL_ALPHA_SCHEMES, {
    action: "RESET_TO_DEFAULT",
    reason: "Restored initial hackathon benchmark parameters"
  });
  return INITIAL_ALPHA_SCHEMES;
}

/**
 * Quick 1-Click Demo Triggers for Hackathon Judges
 */
export function triggerQuickDemo(demoType) {
  if (demoType === "EXTEND_AGE_40") {
    // Extends NSFDC Micro age_max from 38 -> 40 (Instantly unlocks for 39-yr old user!)
    return updateAlphaScheme("NSFDC_MICRO", { age_max: 40 }, "Extended Maximum Age Ceiling from 38 to 40 Years");
  } else if (demoType === "RESTRICT_AGE_38") {
    // Restricts NSFDC Micro back to 38 (Freezes card)
    return updateAlphaScheme("NSFDC_MICRO", { age_max: 38 }, "Reverted Maximum Age Ceiling back to 38 Years");
  } else if (demoType === "RAISE_MAHILA_INCOME") {
    // Raises Mahila Samridhi income cap to ₹5L & opens to Non-SHG
    return updateAlphaScheme("MAHILA_SAMRIDHI", { 
      shg_membership: "Not Required",
      gender: "All",
      income_cap: 500000 
    }, "Waived SHG requirement & raised income limit to ₹5.00 Lakhs");
  } else if (demoType === "EXPAND_VISHWAKARMA_SECTOR") {
    // Expands PM Vishwakarma to include Street Vendors
    return updateAlphaScheme("PM_VISHWAKARMA", { sector: "Street Vendor" }, "Expanded Target Sector to include Urban Street Vendors");
  }
}

/**
 * Subscribes a React component to live updates
 */
export function subscribeToAlphaChanges(onUpdateCallback) {
  if (typeof window === "undefined") return () => {};

  const handleLiveEvent = (e) => {
    if (e.detail?.schemes) {
      onUpdateCallback(e.detail.schemes, e.detail.meta);
    }
  };

  const handleBroadcastMessage = (e) => {
    if (e.data?.schemes) {
      onUpdateCallback(e.data.schemes, e.data.meta);
    }
  };

  const handleStorageEvent = (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        onUpdateCallback(parsed, { action: "STORAGE_SYNC" });
      } catch (err) {}
    }
  };

  window.addEventListener("alpha_schemes_live_event", handleLiveEvent);
  window.addEventListener("storage", handleStorageEvent);
  if (broadcastChannel) {
    broadcastChannel.addEventListener("message", handleBroadcastMessage);
  }

  // Supabase WebSocket Realtime Subscription (if configured)
  let supabaseSub = null;
  if (supabaseClient) {
    try {
      supabaseSub = supabaseClient
        .channel('public:alpha_schemes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'alpha_schemes' }, (payload) => {
          // Sync with postgres
          const updated = getAlphaSchemes();
          onUpdateCallback(updated, { action: "SUPABASE_POSTGRES_CHANGE", payload });
        })
        .subscribe();
    } catch (e) {}
  }

  // Cleanup
  return () => {
    window.removeEventListener("alpha_schemes_live_event", handleLiveEvent);
    window.removeEventListener("storage", handleStorageEvent);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener("message", handleBroadcastMessage);
    }
    if (supabaseSub && supabaseClient) {
      supabaseClient.removeChannel(supabaseSub);
    }
  };
}
