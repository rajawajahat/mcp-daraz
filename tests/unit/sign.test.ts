import { createHmac } from "node:crypto";
import { describe, it, expect } from "vitest";
import { generateSign } from "../../src/utils/sign";

describe("generateSign", () => {
  const appSecret = "test_secret_key";

  it("should generate uppercase hex string", () => {
    const sign = generateSign("/rest", { app_key: "123" }, appSecret);
    expect(sign).toMatch(/^[0-9A-F]+$/);
  });

  it("should produce consistent output for same inputs", () => {
    const params = { app_key: "123", timestamp: "1620000000000" };
    const sign1 = generateSign("/rest", params, appSecret);
    const sign2 = generateSign("/rest", params, appSecret);
    expect(sign1).toBe(sign2);
  });

  it("should sort params alphabetically", () => {
    const params1 = { zebra: "1", alpha: "2", middle: "3" };
    const params2 = { alpha: "2", middle: "3", zebra: "1" };
    const sign1 = generateSign("/rest", params1, appSecret);
    const sign2 = generateSign("/rest", params2, appSecret);
    expect(sign1).toBe(sign2);
  });

  it("should include apiPath in signature computation", () => {
    const params = { app_key: "123" };
    const sign1 = generateSign("/rest", params, appSecret);
    const sign2 = generateSign("/other", params, appSecret);
    expect(sign1).not.toBe(sign2);
  });

  it("should handle empty params", () => {
    const sign = generateSign("/rest", {}, appSecret);
    expect(sign).toMatch(/^[0-9A-F]+$/);
    expect(sign.length).toBe(64); // SHA-256 produces 64 hex chars
  });

  it("should handle single param", () => {
    const sign = generateSign("/rest", { method: "sellercenter.seller.get" }, appSecret);
    expect(sign).toMatch(/^[0-9A-F]+$/);
    expect(sign.length).toBe(64);
  });

  it("should produce different signatures for different secrets", () => {
    const params = { app_key: "123" };
    const sign1 = generateSign("/rest", params, "secret1");
    const sign2 = generateSign("/rest", params, "secret2");
    expect(sign1).not.toBe(sign2);
  });

  it("should match known computation for multiple params", () => {
    // Verify the algorithm: apiPath + sorted(key+value pairs)
    // With params { app_key: "123", timestamp: "1620000000000", method: "sellercenter.seller.get" }
    // Sorted: app_key, method, timestamp
    // String: "/restapp_key123methodsellercenter.seller.gettimestamp1620000000000"
    const fullString =
      "/restapp_key123methodsellercenter.seller.gettimestamp1620000000000";
    const expected = createHmac("sha256", appSecret)
      .update(fullString)
      .digest("hex")
      .toUpperCase();

    const sign = generateSign(
      "/rest",
      {
        app_key: "123",
        timestamp: "1620000000000",
        method: "sellercenter.seller.get",
      },
      appSecret
    );
    expect(sign).toBe(expected);
  });
});
