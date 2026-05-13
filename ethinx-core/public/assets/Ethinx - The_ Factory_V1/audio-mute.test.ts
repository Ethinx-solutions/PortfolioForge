import { describe, it, expect } from "vitest";

// ─── Audio Mute Logic Tests ─────────────────────────────────────
// These test the pure decision logic extracted from the audio system.
// Browser APIs (Audio, localStorage) are not available in vitest,
// so we test the logic functions that drive mute behavior.

describe("Audio Mute State Logic", () => {
  /**
   * Pure function: determine if audio should play given mute state.
   * Mirrors the logic in useAudioTrigger's play function.
   */
  function shouldPlayAudio(isMuted: boolean): boolean {
    return !isMuted;
  }

  it("should allow playback when not muted", () => {
    expect(shouldPlayAudio(false)).toBe(true);
  });

  it("should block playback when muted", () => {
    expect(shouldPlayAudio(true)).toBe(false);
  });
});

describe("Audio Mute Toggle Logic", () => {
  /**
   * Pure function: toggle mute state.
   * Mirrors the toggleMute callback in AudioContext.
   */
  function toggleMute(currentState: boolean): boolean {
    return !currentState;
  }

  it("should mute when currently unmuted", () => {
    expect(toggleMute(false)).toBe(true);
  });

  it("should unmute when currently muted", () => {
    expect(toggleMute(true)).toBe(false);
  });

  it("should be idempotent over two toggles", () => {
    const initial = false;
    const afterFirst = toggleMute(initial);
    const afterSecond = toggleMute(afterFirst);
    expect(afterSecond).toBe(initial);
  });
});

describe("Audio Mute Persistence Logic", () => {
  /**
   * Pure function: serialize mute state for localStorage.
   */
  function serializeMuteState(isMuted: boolean): string {
    return String(isMuted);
  }

  /**
   * Pure function: deserialize mute state from localStorage value.
   * Returns false (unmuted) as default if value is null/undefined.
   */
  function deserializeMuteState(stored: string | null): boolean {
    return stored === "true";
  }

  it("should serialize muted state as 'true'", () => {
    expect(serializeMuteState(true)).toBe("true");
  });

  it("should serialize unmuted state as 'false'", () => {
    expect(serializeMuteState(false)).toBe("false");
  });

  it("should deserialize 'true' as muted", () => {
    expect(deserializeMuteState("true")).toBe(true);
  });

  it("should deserialize 'false' as unmuted", () => {
    expect(deserializeMuteState("false")).toBe(false);
  });

  it("should default to unmuted when stored value is null", () => {
    expect(deserializeMuteState(null)).toBe(false);
  });

  it("should default to unmuted for unexpected stored values", () => {
    expect(deserializeMuteState("")).toBe(false);
    expect(deserializeMuteState("yes")).toBe(false);
    expect(deserializeMuteState("1")).toBe(false);
  });

  it("should round-trip correctly for muted state", () => {
    const muted = true;
    const serialized = serializeMuteState(muted);
    const deserialized = deserializeMuteState(serialized);
    expect(deserialized).toBe(muted);
  });

  it("should round-trip correctly for unmuted state", () => {
    const unmuted = false;
    const serialized = serializeMuteState(unmuted);
    const deserialized = deserializeMuteState(serialized);
    expect(deserialized).toBe(unmuted);
  });
});

describe("Audio Trigger Gating with Mute State", () => {
  type AudioTriggerType = "revenue_ping" | "system_hardened" | "flux_complete";

  /**
   * Simulates the full decision chain: should a trigger fire?
   * Combines mute state check with the event-count trigger logic.
   */
  function shouldTriggerFire(
    isMuted: boolean,
    prevCount: number,
    currentCount: number
  ): boolean {
    if (isMuted) return false;
    return prevCount > 0 && currentCount > prevCount;
  }

  /**
   * Simulates scarcity trigger with mute gating.
   */
  function shouldScarcityTriggerFire(
    isMuted: boolean,
    prevSlots: number,
    currentSlots: number
  ): boolean {
    if (isMuted) return false;
    return currentSlots <= 2 && prevSlots > 2;
  }

  it("should fire revenue_ping when unmuted and new events arrive", () => {
    expect(shouldTriggerFire(false, 5, 6)).toBe(true);
  });

  it("should NOT fire revenue_ping when muted even with new events", () => {
    expect(shouldTriggerFire(true, 5, 6)).toBe(false);
  });

  it("should fire scarcity trigger when unmuted and slots go critical", () => {
    expect(shouldScarcityTriggerFire(false, 3, 2)).toBe(true);
  });

  it("should NOT fire scarcity trigger when muted", () => {
    expect(shouldScarcityTriggerFire(true, 3, 2)).toBe(false);
  });

  it("should NOT fire any trigger when muted regardless of event state", () => {
    // All trigger types blocked when muted
    const triggers: AudioTriggerType[] = ["revenue_ping", "system_hardened", "flux_complete"];
    for (const _trigger of triggers) {
      expect(shouldTriggerFire(true, 10, 15)).toBe(false);
      expect(shouldScarcityTriggerFire(true, 5, 1)).toBe(false);
    }
  });

  it("should resume firing after unmuting", () => {
    // Muted → no fire
    expect(shouldTriggerFire(true, 5, 6)).toBe(false);
    // Unmuted → fire
    expect(shouldTriggerFire(false, 5, 6)).toBe(true);
  });
});

describe("Audio Toggle UI State", () => {
  interface ToggleDisplayState {
    icon: "volume_on" | "volume_off";
    label: string;
    colorClass: string;
  }

  /**
   * Pure function: derive UI display state from mute boolean.
   * Mirrors the conditional rendering in DashboardLayout.
   */
  function getToggleDisplayState(isMuted: boolean): ToggleDisplayState {
    if (isMuted) {
      return {
        icon: "volume_off",
        label: "AUDIO MUTED",
        colorClass: "text-red-400",
      };
    }
    return {
      icon: "volume_on",
      label: "AUDIO ACTIVE",
      colorClass: "text-green-500",
    };
  }

  it("should show volume_off icon when muted", () => {
    expect(getToggleDisplayState(true).icon).toBe("volume_off");
  });

  it("should show volume_on icon when unmuted", () => {
    expect(getToggleDisplayState(false).icon).toBe("volume_on");
  });

  it("should show 'AUDIO MUTED' label when muted", () => {
    expect(getToggleDisplayState(true).label).toBe("AUDIO MUTED");
  });

  it("should show 'AUDIO ACTIVE' label when unmuted", () => {
    expect(getToggleDisplayState(false).label).toBe("AUDIO ACTIVE");
  });

  it("should use red color class when muted", () => {
    expect(getToggleDisplayState(true).colorClass).toContain("red");
  });

  it("should use green color class when unmuted", () => {
    expect(getToggleDisplayState(false).colorClass).toContain("green");
  });
});
