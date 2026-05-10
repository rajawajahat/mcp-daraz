import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DarazClient } from "../client.js";
import { formatOrderIds } from "../utils/helpers.js";
import { wrapTool } from "../utils/tool-response.js";

export function registerShipmentTools(server: McpServer, client: DarazClient): void {
  server.tool(
    "get_shipment_providers",
    "List all available shipment/courier providers for your store",
    {},
    async () => {
      return wrapTool(() =>
        client.get("sellercenter.logistics.shipper.list", {
          method: "sellercenter.logistics.shipper.list",
        })
      );
    }
  );

  server.tool(
    "get_document",
    "Download shipping label, invoice, or carrier manifest for orders",
    {
      doc_type: z
        .enum(["invoice", "shippingLabel", "carrierManifest", "paymentList"])
        .describe("Type of document to download"),
      order_item_ids: z.array(z.string()).min(1).describe("Array of order item IDs"),
    },
    async (params) => {
      return wrapTool(() =>
        client.get("sellercenter.order.document.get", {
          method: "sellercenter.order.document.get",
          doc_type: params.doc_type,
          order_item_ids: formatOrderIds(params.order_item_ids),
        })
      );
    }
  );

  server.tool(
    "set_invoice_number",
    "Set a custom invoice number for an order item",
    {
      order_item_id: z.string().describe("Order item ID"),
      invoice_number: z.string().describe("Custom invoice number"),
    },
    async (params) => {
      return wrapTool(() =>
        client.post("sellercenter.order.invoice_number.set", {
          method: "sellercenter.order.invoice_number.set",
          order_item_id: params.order_item_id,
          invoice_number: params.invoice_number,
        })
      );
    }
  );

  server.tool(
    "get_tracking_info",
    "Get shipment tracking information for an order item",
    {
      order_item_id: z.string().describe("Order item ID to track"),
    },
    async (params) => {
      return wrapTool(() =>
        client.get("sellercenter.order.tracking.get", {
          method: "sellercenter.order.tracking.get",
          order_item_id: params.order_item_id,
        })
      );
    }
  );
}
