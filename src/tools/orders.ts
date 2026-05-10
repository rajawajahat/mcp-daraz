import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DarazClient } from "../client.js";
import { formatOrderIds } from "../utils/helpers.js";
import { wrapTool } from "../utils/tool-response.js";

export function registerOrderTools(server: McpServer, client: DarazClient): void {
  server.tool(
    "get_orders",
    "Fetch orders from your Daraz store with filters",
    {
      created_after: z.string().describe("ISO date e.g. 2024-01-01T00:00:00+05:00"),
      created_before: z.string().optional().describe("ISO date upper bound"),
      status: z
        .enum(["pending", "ready_to_ship", "delivered", "returned", "shipped", "failed", "canceled"])
        .optional()
        .describe("Filter by order status"),
      offset: z.number().default(0).describe("Pagination offset"),
      limit: z.number().min(1).max(100).default(20).describe("Number of orders to return"),
      sort_by: z.enum(["created_at", "updated_at"]).optional().describe("Sort field"),
      sort_direction: z.enum(["ASC", "DESC"]).optional().describe("Sort direction"),
      update_before: z.string().optional().describe("Filter by update date"),
      update_after: z.string().optional().describe("Filter by update date"),
    },
    async (params) => {
      return wrapTool(async () => {
        const apiParams: Record<string, string> = {
          method: "sellercenter.order.list",
          created_after: params.created_after,
          offset: String(params.offset),
          limit: String(params.limit),
        };
        if (params.created_before) apiParams.created_before = params.created_before;
        if (params.status) apiParams.status = params.status;
        if (params.sort_by) apiParams.sort_by = params.sort_by;
        if (params.sort_direction) apiParams.sort_direction = params.sort_direction;
        if (params.update_before) apiParams.update_before = params.update_before;
        if (params.update_after) apiParams.update_after = params.update_after;
        return client.get("sellercenter.order.list", apiParams);
      });
    }
  );

  server.tool(
    "get_order",
    "Get full details of a single order by order ID",
    {
      order_id: z.string().describe("Daraz order ID"),
    },
    async (params) => {
      return wrapTool(() =>
        client.get("sellercenter.order.get", {
          method: "sellercenter.order.get",
          order_id: params.order_id,
        })
      );
    }
  );

  server.tool(
    "get_order_items",
    "Get item details for one or more orders",
    {
      order_ids: z.array(z.string()).min(1).describe("Array of order IDs"),
    },
    async (params) => {
      return wrapTool(() =>
        client.get("sellercenter.order.items.get", {
          method: "sellercenter.order.items.get",
          order_id_list: formatOrderIds(params.order_ids),
        })
      );
    }
  );

  server.tool(
    "set_status_to_packed",
    "Mark order items as packed and ready for pickup",
    {
      order_item_ids: z.array(z.string()).min(1).describe("Array of order item IDs"),
      shipping_provider: z.string().describe("Shipping provider e.g. Daraz Express, Leopards"),
      tracking_number: z.string().describe("Tracking number from courier"),
    },
    async (params) => {
      return wrapTool(() => {
        const payload = {
          Request: {
            OrderItems: {
              OrderItem: params.order_item_ids.map((id) => ({
                OrderItemId: id,
                ShippingProvider: params.shipping_provider,
                TrackingNumber: params.tracking_number,
              })),
            },
          },
        };
        return client.post("sellercenter.order.pack", { method: "sellercenter.order.pack" }, payload);
      });
    }
  );

  server.tool(
    "set_status_to_ready_to_ship",
    "Mark order items as ready to ship — triggers courier pickup",
    {
      order_item_ids: z.array(z.string()).min(1).describe("Array of order item IDs"),
      shipping_provider: z.string().describe("Shipping provider name"),
      tracking_number: z.string().describe("Tracking number from courier"),
      serial_number: z.string().optional().describe("Optional serial number"),
    },
    async (params) => {
      return wrapTool(() => {
        const payload = {
          Request: {
            OrderItems: {
              OrderItem: params.order_item_ids.map((id) => ({
                OrderItemId: id,
                ShippingProvider: params.shipping_provider,
                TrackingNumber: params.tracking_number,
                ...(params.serial_number && { SerialNumber: params.serial_number }),
              })),
            },
          },
        };
        return client.post("sellercenter.order.rts", { method: "sellercenter.order.rts" }, payload);
      });
    }
  );

  server.tool(
    "set_status_to_cancelled",
    "Cancel one or more order items with a reason",
    {
      order_item_id: z.string().describe("Order item ID to cancel"),
      reason_id: z.string().describe("Cancellation reason ID from get_failure_reasons"),
      reason_detail: z.string().optional().describe("Additional cancellation detail"),
    },
    async (params) => {
      return wrapTool(async () => {
        const apiParams: Record<string, string> = {
          method: "sellercenter.order.cancel",
          order_item_id: params.order_item_id,
          reason_id: params.reason_id,
        };
        if (params.reason_detail) apiParams.reason_detail = params.reason_detail;
        return client.post("sellercenter.order.cancel", apiParams);
      });
    }
  );

  server.tool(
    "get_failure_reasons",
    "Get valid cancellation reason codes for cancelling orders",
    {},
    async () => {
      return wrapTool(() =>
        client.get("sellercenter.order.failure_reason.get", {
          method: "sellercenter.order.failure_reason.get",
        })
      );
    }
  );
}
