import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DarazClient } from "../client.js";
import { wrapTool } from "../utils/tool-response.js";

export function registerFinanceTools(server: McpServer, client: DarazClient): void {
  server.tool(
    "get_seller",
    "Get your Daraz seller profile, shop name, and account status",
    {},
    async () => {
      return wrapTool(() =>
        client.get("sellercenter.seller.get", {
          method: "sellercenter.seller.get",
        })
      );
    }
  );

  server.tool(
    "get_payout_status",
    "Check your Daraz payout/settlement status for a date range",
    {
      created_after: z.string().describe("Start date (ISO format)"),
      created_before: z.string().describe("End date (ISO format)"),
    },
    async (params) => {
      return wrapTool(() =>
        client.get("sellercenter.finance.payout.status.get", {
          method: "sellercenter.finance.payout.status.get",
          created_after: params.created_after,
          created_before: params.created_before,
        })
      );
    }
  );

  server.tool(
    "get_transaction_details",
    "Get detailed financial transaction history",
    {
      start_time: z.string().describe("Start date (ISO format)"),
      end_time: z.string().describe("End date (ISO format)"),
      trans_type: z.string().optional().describe("Filter by transaction type"),
      offset: z.number().default(0).describe("Pagination offset"),
      limit: z.number().min(1).max(100).default(20).describe("Number of transactions to return"),
    },
    async (params) => {
      return wrapTool(async () => {
        const apiParams: Record<string, string> = {
          method: "sellercenter.finance.transaction.detail.get",
          start_time: params.start_time,
          end_time: params.end_time,
          offset: String(params.offset),
          limit: String(params.limit),
        };
        if (params.trans_type) apiParams.trans_type = params.trans_type;
        return client.get("sellercenter.finance.transaction.detail.get", apiParams);
      });
    }
  );

  server.tool(
    "get_transaction_types",
    "Get all available transaction type codes for finance filtering",
    {},
    async () => {
      return wrapTool(() =>
        client.get("sellercenter.finance.transaction.type.get", {
          method: "sellercenter.finance.transaction.type.get",
        })
      );
    }
  );
}
