import { describe, expect, it } from "vitest";
import crypto from "crypto";
import { verifyHmacSignature, verifyApiKey, checkRateLimit, sanitizeString, isValidTier, getAlertPriority } from "./webhooks";

const TEST_SECRET = "test_secret_key_for_hmac_verification_12345";

describe("HMAC-SHA256 Signature Verification", () => {
  it("verifies a valid HMAC signature with sha256= prefix", () => {
    const payload = JSON.stringify({ customer: "Test", amountCents: 3900, tier: "Starter" });
    const signature = "sha256=" + crypto.createHmac("sha256", TEST_SECRET).update(payload).digest("hex");
    expect(verifyHmacSignature(payload, signature, TEST_SECRET)).toBe(true);
  });

  it("verifies a valid HMAC signature without sha256= prefix", () => {
    const payload = JSON.stringify({ customer: "Test", amountCents: 3900, tier: "Starter" });
    const signature = crypto.createHmac("sha256", TEST_SECRET).update(payload).digest("hex");
    expect(verifyHmacSignature(payload, signature, TEST_SECRET)).toBe(true);
  });

  it("rejects an invalid signature", () => {
    const payload = JSON.stringify({ customer: "Test", amountCents: 3900, tier: "Starter" });
    const wrongSignature = "sha256=" + crypto.createHmac("sha256", "wrong_secret").update(payload).digest("hex");
    expect(verifyHmacSignature(payload, wrongSignature, TEST_SECRET)).toBe(false);
  });

  it("rejects a tampered payload", () => {
    const originalPayload = JSON.stringify({ customer: "Test", amountCents: 3900, tier: "Starter" });
    const tamperedPayload = JSON.stringify({ customer: "Hacker", amountCents: 999999, tier: "Vault" });
    const signature = "sha256=" + crypto.createHmac("sha256", TEST_SECRET).update(originalPayload).digest("hex");
    expect(verifyHmacSignature(tamperedPayload, signature, TEST_SECRET)).toBe(false);
  });

  it("rejects empty signature", () => {
    const payload = JSON.stringify({ customer: "Test" });
    expect(verifyHmacSignature(payload, "", TEST_SECRET)).toBe(false);
  });

  it("rejects empty secret", () => {
    const payload = JSON.stringify({ customer: "Test" });
    const signature = "sha256=" + crypto.createHmac("sha256", TEST_SECRET).update(payload).digest("hex");
    expect(verifyHmacSignature(payload, signature, "")).toBe(false);
  });

  it("rejects malformed hex in signature", () => {
    const payload = JSON.stringify({ customer: "Test" });
    expect(verifyHmacSignature(payload, "sha256=not_valid_hex_zzzz", TEST_SECRET)).toBe(false);
  });
});

describe("API Key Verification", () => {
  it("verifies a valid X-Api-Key header", () => {
    const req = { headers: { "x-api-key": TEST_SECRET } } as any;
    expect(verifyApiKey(req, TEST_SECRET)).toBe(true);
  });

  it("verifies a valid Authorization Bearer header", () => {
    const req = { headers: { authorization: `Bearer ${TEST_SECRET}` } } as any;
    expect(verifyApiKey(req, TEST_SECRET)).toBe(true);
  });

  it("rejects an invalid API key", () => {
    const req = { headers: { "x-api-key": "wrong_key" } } as any;
    expect(verifyApiKey(req, TEST_SECRET)).toBe(false);
  });

  it("rejects missing credentials", () => {
    const req = { headers: {} } as any;
    expect(verifyApiKey(req, TEST_SECRET)).toBe(false);
  });

  it("rejects empty secret", () => {
    const req = { headers: { "x-api-key": TEST_SECRET } } as any;
    expect(verifyApiKey(req, "")).toBe(false);
  });
});

describe("Rate Limiting", () => {
  it("allows requests within the limit", () => {
    const testIp = `test-ip-${Date.now()}-${Math.random()}`;
    expect(checkRateLimit(testIp)).toBe(true);
    expect(checkRateLimit(testIp)).toBe(true);
    expect(checkRateLimit(testIp)).toBe(true);
  });

  it("allows different IPs independently", () => {
    const ip1 = `ip1-${Date.now()}-${Math.random()}`;
    const ip2 = `ip2-${Date.now()}-${Math.random()}`;
    expect(checkRateLimit(ip1)).toBe(true);
    expect(checkRateLimit(ip2)).toBe(true);
  });
});

describe("Input Sanitization", () => {
  it("trims whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("truncates to max length", () => {
    const long = "a".repeat(500);
    expect(sanitizeString(long, 200).length).toBe(200);
  });

  it("returns empty string for non-string input", () => {
    expect(sanitizeString(123)).toBe("");
    expect(sanitizeString(null)).toBe("");
    expect(sanitizeString(undefined)).toBe("");
  });

  it("handles empty strings", () => {
    expect(sanitizeString("")).toBe("");
  });
});

describe("Tier Validation", () => {
  it("accepts all valid tiers", () => {
    expect(isValidTier("Starter")).toBe(true);
    expect(isValidTier("Growth")).toBe(true);
    expect(isValidTier("Pro")).toBe(true);
    expect(isValidTier("Elite")).toBe(true);
    expect(isValidTier("Enterprise")).toBe(true);
    expect(isValidTier("Vault")).toBe(true);
  });

  it("rejects invalid tiers", () => {
    expect(isValidTier("starter")).toBe(false);
    expect(isValidTier("STARTER")).toBe(false);
    expect(isValidTier("Free")).toBe(false);
    expect(isValidTier("")).toBe(false);
  });
});

describe("Alert Priority", () => {
  it("returns critical for Vault tier", () => {
    expect(getAlertPriority("Vault")).toBe("critical");
  });

  it("returns high for Enterprise tier", () => {
    expect(getAlertPriority("Enterprise")).toBe("high");
  });

  it("returns standard for all other tiers", () => {
    expect(getAlertPriority("Starter")).toBe("standard");
    expect(getAlertPriority("Growth")).toBe("standard");
    expect(getAlertPriority("Pro")).toBe("standard");
    expect(getAlertPriority("Elite")).toBe("standard");
  });
});
