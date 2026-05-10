#!/usr/bin/env node
import "dotenv/config";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { DarazClient } from "./client.js";
import { getBaseUrl } from "./utils/helpers.js";
import { registerProductTools } from "./tools/products.js";
import { registerOrderTools } from "./tools/orders.js";
import { registerShipmentTools } from "./tools/shipment.js";
import { registerFinanceTools } from "./tools/finance.js";
import { registerImageTools } from "./tools/images.js";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require("../package.json") as { version: string };

const appKey = process.env.DARAZ_APP_KEY;
const appSecret = process.env.DARAZ_APP_SECRET;
const accessToken = process.env.DARAZ_ACCESS_TOKEN;
const country = (process.env.DARAZ_COUNTRY ?? "PK").toUpperCase();
const sandbox = process.env.DARAZ_SANDBOX !== "false";

if (!appKey || !appSecret || !accessToken) {
  console.error(
    "Missing required environment variables: DARAZ_APP_KEY, DARAZ_APP_SECRET, DARAZ_ACCESS_TOKEN\n" +
      "  Get them from: Daraz Seller Center -> Store -> API Test Tool"
  );
  process.exit(1);
}

const baseUrl = getBaseUrl(country);

console.error(`
mcp-daraz v${version}
  Country : ${country} -> ${baseUrl}
  Mode    : ${sandbox ? "SANDBOX" : "PRODUCTION"}
  Tools   : 28 tools across 5 categories
`);

const client = new DarazClient({
  appKey,
  appSecret,
  accessToken,
  country,
  sandbox,
});

const server = new McpServer({
  name: "mcp-daraz",
  version,
});

registerProductTools(server, client);
registerOrderTools(server, client);
registerShipmentTools(server, client);
registerFinanceTools(server, client);
registerImageTools(server, client);

async function main(): Promise<void> {
  try {
    await client.get("sellercenter.seller.get", {
      method: "sellercenter.seller.get",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Credential check failed: ${message}`);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
