import { describe, expect, it } from "vitest";

describe("WEBHOOK_SECRET environment variable", () => {
  it("should be set and be a valid 64-char hex string", () => {
    const secret = process.env.WEBHOOK_SECRET;
    expect(secret).toBeDefined();
    expect(typeof secret).toBe("string");
    expect(secret!.length).toBe(64);
    expect(/^[0-9a-f]{64}$/.test(secret!)).toBe(true);
  });
});
