/**
 * Audio trigger configuration for the EthinX Empire OS Dashboard.
 *
 * Maps synthesized audio assets to their respective dashboard event triggers.
 * Audio files are generated via numpy/scipy on the Hetzner VPS and served from CDN.
 */

/** Audio trigger type identifiers */
export type AudioTriggerType = "revenue_ping" | "system_hardened" | "flux_complete";

/** CDN URLs for synthesized audio assets */
export const AUDIO_CDN_URLS: Record<AudioTriggerType, string> = {
  revenue_ping:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663475555141/Mz7RoWCArqbbwBLJz4NArS/revenue_ping_6446c9a8.wav",
  system_hardened:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663475555141/Mz7RoWCArqbbwBLJz4NArS/system_hardened_1162d487.wav",
  flux_complete:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663475555141/Mz7RoWCArqbbwBLJz4NArS/flux_complete_0cadb809.wav",
};

/** Hetzner server paths for audio assets */
export const AUDIO_SERVER_PATHS: Record<AudioTriggerType, string> = {
  revenue_ping: "/var/www/vegas-saas/assets/audio/revenue_ping.wav",
  system_hardened: "/var/www/vegas-saas/assets/audio/system_hardened.wav",
  flux_complete: "/var/www/vegas-saas/assets/audio/flux_complete.wav",
};

/** Dashboard event trigger mapping */
export const AUDIO_TRIGGER_MAP: Record<
  AudioTriggerType,
  { description: string; events: string[] }
> = {
  revenue_ping: {
    description: "High-frequency chime (B5 + harmonic) for revenue events",
    events: [
      "checkout.session.completed",
      "invoice.paid",
      "new_sales_event",
      "upsell_completed",
    ],
  },
  system_hardened: {
    description: "Low industrial thrum (A2 square wave) for security events",
    events: [
      "security.hardened",
      "credential.rotated",
      "firewall.updated",
      "connection.status_change",
    ],
  },
  flux_complete: {
    description: "Ascending frequency sweep (A4→A6) for completion events",
    events: [
      "milestone.completed",
      "phase.transition",
      "deployment.success",
      "task.completed",
    ],
  },
};
