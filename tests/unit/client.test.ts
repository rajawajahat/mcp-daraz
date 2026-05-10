import { beforeEach, describe, expect, it, vi } from "vitest";

const mockRequest = vi.fn();

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({ request: mockRequest })),
    isAxiosError: (e: unknown): boolean =>
      typeof e === "object" && e !== null && "isAxiosError" in e &&
      (e as { isAxiosError: boolean }).isAxiosError === true,
  },
}));

import { DarazClient } from "../../src/client.js";
import { DarazAPIError } from "../../src/utils/errors.js";
import {
  GET_SELLER_RESPONSE,
  GET_ORDERS_RESPONSE,
  GET_PRODUCTS_RESPONSE,
} from "../mocks/responses.js";

const CLIENT_CONFIG = {
  appKey: "test_app_key",
  appSecret: "test_app_secret",
  accessToken: "test_access_token",
  country: "PK",
  sandbox: true,
};

function wrap(payload: unknown) {
  return { data: payload };
}

describe("DarazClient", () => {
  let client: DarazClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new DarazClient(CLIENT_CONFIG);
  });

  describe("get()", () => {
    it("returns unwrapped data on success", async () => {
      mockRequest.mockResolvedValueOnce(wrap(GET_SELLER_RESPONSE));

      const result = await client.get("sellercenter.seller.get", {
        method: "sellercenter.seller.get",
      });

      expect(result).toEqual(GET_SELLER_RESPONSE.data);
    });

    it("unwraps data from GET_ORDERS_RESPONSE", async () => {
      mockRequest.mockResolvedValueOnce(wrap(GET_ORDERS_RESPONSE));

      const result = await client.get("sellercenter.order.list", {
        method: "sellercenter.order.list",
        created_after: "2024-01-01T00:00:00+05:00",
        offset: "0",
        limit: "20",
      });

      expect(result).toEqual(GET_ORDERS_RESPONSE.data);
    });

    it("unwraps data from GET_PRODUCTS_RESPONSE", async () => {
      mockRequest.mockResolvedValueOnce(wrap(GET_PRODUCTS_RESPONSE));

      const result = await client.get("sellercenter.product.list", {
        method: "sellercenter.product.list",
        offset: "0",
        limit: "20",
      });

      expect(result).toEqual(GET_PRODUCTS_RESPONSE.data);
    });

    it("throws DarazAPIError on non-zero code", async () => {
      mockRequest.mockResolvedValueOnce(wrap({ code: "2", message: "Invalid session" }));

      await expect(
        client.get("sellercenter.seller.get", { method: "sellercenter.seller.get" })
      ).rejects.toBeInstanceOf(DarazAPIError);
    });

    it("DarazAPIError carries the correct code", async () => {
      mockRequest.mockResolvedValueOnce(wrap({ code: "4", message: "Seller not found" }));

      const error = await client
        .get("sellercenter.seller.get", { method: "sellercenter.seller.get" })
        .catch((e) => e);

      expect(error).toBeInstanceOf(DarazAPIError);
      expect((error as DarazAPIError).code).toBe("4");
    });

    it("retries once on code 27 (invalid timestamp) and succeeds", async () => {
      mockRequest
        .mockResolvedValueOnce(wrap({ code: "27", message: "Invalid timestamp" }))
        .mockResolvedValueOnce(wrap(GET_SELLER_RESPONSE));

      const result = await client.get("sellercenter.seller.get", {
        method: "sellercenter.seller.get",
      });

      expect(result).toEqual(GET_SELLER_RESPONSE.data);
      expect(mockRequest).toHaveBeenCalledTimes(2);
    });

    it("does not retry code 27 more than once", async () => {
      mockRequest
        .mockResolvedValueOnce(wrap({ code: "27", message: "Invalid timestamp" }))
        .mockResolvedValueOnce(wrap({ code: "27", message: "Invalid timestamp" }));

      await expect(
        client.get("sellercenter.seller.get", { method: "sellercenter.seller.get" })
      ).rejects.toBeInstanceOf(DarazAPIError);

      expect(mockRequest).toHaveBeenCalledTimes(2);
    });

    it("retries once on code 21 (rate limit) after a delay", async () => {
      vi.useFakeTimers();
      mockRequest
        .mockResolvedValueOnce(wrap({ code: "21", message: "Rate limit exceeded" }))
        .mockResolvedValueOnce(wrap(GET_ORDERS_RESPONSE));

      const promise = client.get("sellercenter.order.list", {
        method: "sellercenter.order.list",
        created_after: "2024-01-01T00:00:00+05:00",
        offset: "0",
        limit: "20",
      });

      await vi.runAllTimersAsync();
      const result = await promise;

      expect(result).toEqual(GET_ORDERS_RESPONSE.data);
      expect(mockRequest).toHaveBeenCalledTimes(2);
      vi.useRealTimers();
    });

    it("does not retry code 21 more than once", async () => {
      vi.useFakeTimers();
      mockRequest
        .mockResolvedValueOnce(wrap({ code: "21", message: "Rate limit exceeded" }))
        .mockResolvedValueOnce(wrap({ code: "21", message: "Rate limit exceeded" }));

      const promise = client
        .get("sellercenter.order.list", {
          method: "sellercenter.order.list",
          created_after: "2024-01-01T00:00:00+05:00",
          offset: "0",
          limit: "20",
        })
        .catch((e) => e);

      await vi.runAllTimersAsync();
      const error = await promise;

      expect(error).toBeInstanceOf(DarazAPIError);
      expect(mockRequest).toHaveBeenCalledTimes(2);
      vi.useRealTimers();
    });

    it("throws a descriptive error on network failure", async () => {
      const axiosError = Object.assign(new Error("connect ECONNREFUSED"), {
        isAxiosError: true,
        response: undefined,
      });
      mockRequest.mockRejectedValueOnce(axiosError);

      await expect(
        client.get("sellercenter.seller.get", { method: "sellercenter.seller.get" })
      ).rejects.toThrow("Network error: connect ECONNREFUSED");
    });

    it("includes HTTP status code in network error message when available", async () => {
      const axiosError = Object.assign(new Error("Request failed with status code 503"), {
        isAxiosError: true,
        response: { status: 503 },
      });
      mockRequest.mockRejectedValueOnce(axiosError);

      await expect(
        client.get("sellercenter.seller.get", { method: "sellercenter.seller.get" })
      ).rejects.toThrow("Network error: Request failed with status code 503 (HTTP 503)");
    });
  });

  describe("post()", () => {
    it("sends a POST request and returns unwrapped data", async () => {
      const responseData = { order_items: [{ order_item_id: "AAA111" }] };
      mockRequest.mockResolvedValueOnce(wrap({ code: "0", data: responseData }));

      const result = await client.post(
        "sellercenter.order.pack",
        { method: "sellercenter.order.pack" },
        { Request: { OrderItems: {} } }
      );

      expect(result).toEqual(responseData);
      expect(mockRequest).toHaveBeenCalledWith(
        expect.objectContaining({ method: "POST" })
      );
    });
  });
});
