import { describe, it, expect } from "vitest";
import { getBaseUrl, generateTimestamp, formatOrderIds } from "../../src/utils/helpers";

describe("getBaseUrl", () => {
  it("should return correct URL for PK", () => {
    expect(getBaseUrl("PK")).toBe("https://api.daraz.pk/rest");
  });

  it("should return correct URL for BD", () => {
    expect(getBaseUrl("BD")).toBe("https://api.daraz.com.bd/rest");
  });

  it("should return correct URL for LK", () => {
    expect(getBaseUrl("LK")).toBe("https://api.daraz.lk/rest");
  });

  it("should return correct URL for NP", () => {
    expect(getBaseUrl("NP")).toBe("https://api.daraz.com.np/rest");
  });

  it("should return correct URL for MM", () => {
    expect(getBaseUrl("MM")).toBe("https://api.daraz.com.mm/rest");
  });

  it("should be case-insensitive", () => {
    expect(getBaseUrl("pk")).toBe("https://api.daraz.pk/rest");
    expect(getBaseUrl("Bd")).toBe("https://api.daraz.com.bd/rest");
  });

  it("should throw for invalid country code", () => {
    expect(() => getBaseUrl("INVALID")).toThrow("Unsupported country code");
    expect(() => getBaseUrl("US")).toThrow("Unsupported country code");
  });
});

describe("generateTimestamp", () => {
  it("should return a string", () => {
    expect(typeof generateTimestamp()).toBe("string");
  });

  it("should return 13-digit string (milliseconds)", () => {
    const ts = generateTimestamp();
    expect(ts).toMatch(/^\d{13}$/);
  });

  it("should return current time approximately", () => {
    const before = Date.now();
    const ts = Number(generateTimestamp());
    const after = Date.now();
    expect(ts).toBeGreaterThanOrEqual(before);
    expect(ts).toBeLessThanOrEqual(after);
  });
});

describe("formatOrderIds", () => {
  it("should join IDs with commas", () => {
    expect(formatOrderIds(["1", "2", "3"])).toBe("1,2,3");
  });

  it("should handle single ID", () => {
    expect(formatOrderIds(["123"])).toBe("123");
  });

  it("should handle empty array", () => {
    expect(formatOrderIds([])).toBe("");
  });
});
