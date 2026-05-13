import { describe, it, expect } from "vitest";
import {
  AUDIO_CDN_URLS,
  AUDIO_SERVER_PATHS,
  AUDIO_TRIGGER_MAP,
} from "../shared/audio";
import type { AudioTriggerType } from "../shared/audio";

// ─── Audio Asset Configuration Tests ─────────────────────────────

describe("Audio CDN URLs", () => {
  const TRIGGER_TYPES: AudioTriggerType[] = [
    "revenue_ping",
    "system_hardened",
    "flux_complete",
  ];

  it("should have CDN URLs for all three trigger types", () => {
    for (const type of TRIGGER_TYPES) {
      expect(AUDIO_CDN_URLS[type]).toBeDefined();
      expect(typeof AUDIO_CDN_URLS[type]).toBe("string");
    }
  });

  it("should have valid HTTPS CDN URLs", () => {
    for (const type of TRIGGER_TYPES) {
      expect(AUDIO_CDN_URLS[type]).toMatch(/^https:\/\//);
    }
  });

  it("should point to CloudFront CDN", () => {
    for (const type of TRIGGER_TYPES) {
      expect(AUDIO_CDN_URLS[type]).toContain("cloudfront.net");
    }
  });

  it("should reference .wav files", () => {
    for (const type of TRIGGER_TYPES) {
      expect(AUDIO_CDN_URLS[type]).toMatch(/\.wav$/);
    }
  });

  it("should have unique URLs for each trigger type", () => {
    const urls = Object.values(AUDIO_CDN_URLS);
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(urls.length);
  });

  it("revenue_ping URL should contain revenue_ping identifier", () => {
    expect(AUDIO_CDN_URLS.revenue_ping).toContain("revenue_ping");
  });

  it("system_hardened URL should contain system_hardened identifier", () => {
    expect(AUDIO_CDN_URLS.system_hardened).toContain("system_hardened");
  });

  it("flux_complete URL should contain flux_complete identifier", () => {
    expect(AUDIO_CDN_URLS.flux_complete).toContain("flux_complete");
  });
});

describe("Audio Server Paths", () => {
  it("should have server paths for all three trigger types", () => {
    expect(AUDIO_SERVER_PATHS.revenue_ping).toBeDefined();
    expect(AUDIO_SERVER_PATHS.system_hardened).toBeDefined();
    expect(AUDIO_SERVER_PATHS.flux_complete).toBeDefined();
  });

  it("should point to /var/www/vegas-saas/assets/audio/ directory", () => {
    for (const path of Object.values(AUDIO_SERVER_PATHS)) {
      expect(path).toMatch(/^\/var\/www\/vegas-saas\/assets\/audio\//);
    }
  });

  it("should reference .wav files", () => {
    for (const path of Object.values(AUDIO_SERVER_PATHS)) {
      expect(path).toMatch(/\.wav$/);
    }
  });
});

// ─── Audio Trigger Mapping Tests ─────────────────────────────────

describe("Audio Trigger Map", () => {
  it("should have mappings for all three trigger types", () => {
    expect(AUDIO_TRIGGER_MAP.revenue_ping).toBeDefined();
    expect(AUDIO_TRIGGER_MAP.system_hardened).toBeDefined();
    expect(AUDIO_TRIGGER_MAP.flux_complete).toBeDefined();
  });

  it("each mapping should have a description and events array", () => {
    for (const mapping of Object.values(AUDIO_TRIGGER_MAP)) {
      expect(mapping.description).toBeDefined();
      expect(typeof mapping.description).toBe("string");
      expect(mapping.description.length).toBeGreaterThan(0);
      expect(Array.isArray(mapping.events)).toBe(true);
      expect(mapping.events.length).toBeGreaterThan(0);
    }
  });

  it("revenue_ping should map to payment/revenue events", () => {
    const events = AUDIO_TRIGGER_MAP.revenue_ping.events;
    expect(events).toContain("checkout.session.completed");
    expect(events).toContain("invoice.paid");
    expect(events).toContain("new_sales_event");
  });

  it("system_hardened should map to security events", () => {
    const events = AUDIO_TRIGGER_MAP.system_hardened.events;
    expect(events).toContain("security.hardened");
    expect(events).toContain("credential.rotated");
    expect(events).toContain("firewall.updated");
  });

  it("flux_complete should map to completion events", () => {
    const events = AUDIO_TRIGGER_MAP.flux_complete.events;
    expect(events).toContain("milestone.completed");
    expect(events).toContain("phase.transition");
    expect(events).toContain("deployment.success");
  });

  it("revenue_ping description should mention chime/B5", () => {
    expect(AUDIO_TRIGGER_MAP.revenue_ping.description.toLowerCase()).toMatch(
      /chime|b5/
    );
  });

  it("system_hardened description should mention industrial/thrum", () => {
    expect(
      AUDIO_TRIGGER_MAP.system_hardened.description.toLowerCase()
    ).toMatch(/industrial|thrum|square/);
  });

  it("flux_complete description should mention sweep/ascending", () => {
    expect(AUDIO_TRIGGER_MAP.flux_complete.description.toLowerCase()).toMatch(
      /sweep|ascending/
    );
  });
});

// ─── Audio Trigger Decision Logic Tests ──────────────────────────

describe("Audio Trigger Decision Logic", () => {
  /**
   * Pure function: given a list of event counts (previous and current),
   * determine if an audio trigger should fire.
   */
  function shouldTriggerOnNewEvents(
    prevCount: number,
    currentCount: number
  ): boolean {
    return prevCount > 0 && currentCount > prevCount;
  }

  /**
   * Pure function: determine if scarcity engine should trigger revenue_ping.
   */
  function shouldTriggerOnScarcityCritical(
    prevSlots: number,
    currentSlots: number
  ): boolean {
    return currentSlots <= 2 && prevSlots > 2;
  }

  /**
   * Pure function: determine if milestone expansion should trigger flux_complete.
   */
  function shouldTriggerOnMilestoneExpand(
    milestoneStatus: "completed" | "in_progress" | "pending",
    wasExpanded: boolean
  ): boolean {
    return !wasExpanded && milestoneStatus === "completed";
  }

  it("should trigger revenue_ping when new events arrive", () => {
    expect(shouldTriggerOnNewEvents(5, 6)).toBe(true);
    expect(shouldTriggerOnNewEvents(10, 15)).toBe(true);
  });

  it("should NOT trigger revenue_ping on initial load (prev=0)", () => {
    expect(shouldTriggerOnNewEvents(0, 8)).toBe(false);
  });

  it("should NOT trigger revenue_ping when count stays the same", () => {
    expect(shouldTriggerOnNewEvents(5, 5)).toBe(false);
  });

  it("should NOT trigger revenue_ping when count decreases", () => {
    expect(shouldTriggerOnNewEvents(10, 8)).toBe(false);
  });

  it("should trigger revenue_ping when scarcity hits critical (<=2)", () => {
    expect(shouldTriggerOnScarcityCritical(3, 2)).toBe(true);
    expect(shouldTriggerOnScarcityCritical(5, 1)).toBe(true);
  });

  it("should NOT trigger when scarcity stays above critical", () => {
    expect(shouldTriggerOnScarcityCritical(5, 3)).toBe(false);
    expect(shouldTriggerOnScarcityCritical(4, 4)).toBe(false);
  });

  it("should NOT trigger when scarcity was already critical", () => {
    expect(shouldTriggerOnScarcityCritical(2, 1)).toBe(false);
    expect(shouldTriggerOnScarcityCritical(1, 2)).toBe(false);
  });

  it("should trigger flux_complete when expanding a completed milestone", () => {
    expect(shouldTriggerOnMilestoneExpand("completed", false)).toBe(true);
  });

  it("should NOT trigger flux_complete for in-progress milestones", () => {
    expect(shouldTriggerOnMilestoneExpand("in_progress", false)).toBe(false);
  });

  it("should NOT trigger flux_complete for pending milestones", () => {
    expect(shouldTriggerOnMilestoneExpand("pending", false)).toBe(false);
  });

  it("should NOT trigger flux_complete when milestone was already expanded", () => {
    expect(shouldTriggerOnMilestoneExpand("completed", true)).toBe(false);
  });
});

// ─── Audio Asset Integrity Tests ─────────────────────────────────

describe("Audio Asset Integrity", () => {
  it("should have exactly 3 CDN URLs", () => {
    expect(Object.keys(AUDIO_CDN_URLS)).toHaveLength(3);
  });

  it("should have exactly 3 server paths", () => {
    expect(Object.keys(AUDIO_SERVER_PATHS)).toHaveLength(3);
  });

  it("should have exactly 3 trigger mappings", () => {
    expect(Object.keys(AUDIO_TRIGGER_MAP)).toHaveLength(3);
  });

  it("CDN URLs, server paths, and trigger map should have matching keys", () => {
    const cdnKeys = Object.keys(AUDIO_CDN_URLS).sort();
    const pathKeys = Object.keys(AUDIO_SERVER_PATHS).sort();
    const mapKeys = Object.keys(AUDIO_TRIGGER_MAP).sort();
    expect(cdnKeys).toEqual(pathKeys);
    expect(cdnKeys).toEqual(mapKeys);
  });

  it("all event strings in trigger map should be non-empty", () => {
    for (const mapping of Object.values(AUDIO_TRIGGER_MAP)) {
      for (const event of mapping.events) {
        expect(event.length).toBeGreaterThan(0);
        expect(event).not.toMatch(/^\s+$/);
      }
    }
  });

  it("no duplicate events across different trigger types", () => {
    const allEvents: string[] = [];
    for (const mapping of Object.values(AUDIO_TRIGGER_MAP)) {
      allEvents.push(...mapping.events);
    }
    const uniqueEvents = new Set(allEvents);
    expect(uniqueEvents.size).toBe(allEvents.length);
  });
});
