# mcp-daraz

[![npm](https://img.shields.io/npm/v/mcp-daraz?logo=npm&logoColor=white&color=cb3837)](https://www.npmjs.com/package/mcp-daraz)
[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e?logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Node >=18](https://img.shields.io/badge/node-%3E%3D18-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MCP](https://img.shields.io/badge/MCP-compatible-6B46C1?logo=anthropic&logoColor=white)](https://modelcontextprotocol.io)
[![Version](https://img.shields.io/badge/version-1.0.0-0ea5e9?logo=semanticrelease&logoColor=white)](https://github.com/rajawajahat/mcp-daraz/releases/tag/v1.0.0)

A [Model Context Protocol](https://modelcontextprotocol.io) server that connects AI agents to the Daraz Seller API. Manage your entire store — products, orders, shipments, and payouts — from Claude Desktop, Cursor, Cline, or any MCP-compatible agent using plain English.

> Sandbox mode by default. Bring your own seller credentials. No secrets bundled.

---

## Table of contents

- [Overview](#overview)
- [Tools](#tools)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Integrations](#integrations)
- [Multi-country support](#multi-country-support)
- [How request signing works](#how-request-signing-works)
- [Security](#security)
- [Error reference](#error-reference)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Daraz sellers across Pakistan, Bangladesh, Sri Lanka, Nepal, and Myanmar manage their stores manually — switching tabs to track orders, downloading shipping labels one at a time, and checking payouts on a separate screen. The Daraz Seller API has existed for years, but using it directly requires navigating a gated PDF, implementing Alibaba's HMAC-SHA256 signing scheme, and decoding XML product payloads.

mcp-daraz abstracts all of that. It gives any MCP-compatible agent a stable, fully typed interface to Daraz so you can describe what you need in natural language and the server handles the cryptography, HTTP, and field mapping.

---

## Tools

28 tools across 5 categories.

### Products

| Tool | Description |
| ---- | ----------- |
| `get_products` | List products with status, keyword, and date filters |
| `get_product` | Retrieve full details for a product by item ID |
| `create_product` | Create a listing with images, SKU, price, and dimensions |
| `update_product` | Update name, description, or images on an existing product |
| `update_price_quantity` | Bulk-update price and stock across up to 50 SKUs |
| `get_category_tree` | Fetch the full category hierarchy for your market |
| `get_category_attributes` | Get required and optional fields for a specific category |
| `get_brands` | Search available brands by name |

### Orders

| Tool | Description |
| ---- | ----------- |
| `get_orders` | List orders filtered by status, date range, and sort order |
| `get_order` | Retrieve full details for a single order |
| `get_order_items` | Item-level breakdown for one or more orders |
| `set_status_to_packed` | Mark items as packed with a shipping provider and tracking number |
| `set_status_to_ready_to_ship` | Trigger courier pickup and move the order to RTS status |
| `set_status_to_cancelled` | Cancel an order item with a reason code |
| `get_failure_reasons` | Retrieve valid cancellation reason codes |

### Shipment

| Tool | Description |
| ---- | ----------- |
| `get_shipment_providers` | List available courier providers for your store |
| `get_document` | Download a shipping label, invoice, carrier manifest, or payment list |
| `set_invoice_number` | Attach a custom invoice number to an order item |
| `get_tracking_info` | Fetch live tracking status for a shipment |

### Finance

| Tool | Description |
| ---- | ----------- |
| `get_seller` | Retrieve seller profile, shop name, and account status |
| `get_payout_status` | Check settlement status for a date range |
| `get_transaction_details` | Itemised transaction history with type filtering |
| `get_transaction_types` | List all transaction type codes available as filters |

### Images & QC

| Tool | Description |
| ---- | ----------- |
| `upload_image` | Upload a product image from a public URL |
| `migrate_image` | Migrate a single external image to the Daraz CDN |
| `migrate_images` | Bulk-migrate up to 10 external images in one call |
| `set_images` | Set or replace all images on an existing SKU |
| `get_qc_status` | Check quality control status for one or more seller SKUs |

---

## Quick start

**Option 1 — npx (no install required)**

Add this to your MCP client config and you're ready to go:

```json
{
  "mcpServers": {
    "daraz": {
      "command": "npx",
      "args": ["-y", "mcp-daraz"],
      "env": {
        "DARAZ_APP_KEY": "your_app_key",
        "DARAZ_APP_SECRET": "your_app_secret",
        "DARAZ_ACCESS_TOKEN": "your_access_token",
        "DARAZ_COUNTRY": "PK",
        "DARAZ_SANDBOX": "true"
      }
    }
  }
}
```

**Option 2 — clone and build**

```bash
git clone https://github.com/rajawajahat/mcp-daraz.git
cd mcp-daraz
npm install
cp .env.example .env
npm run build
```

Verify everything is working:

```bash
npm run test:unit   # 21 tests, no credentials required
npm run build       # must complete with zero TypeScript errors
```

---

## Configuration

Copy `.env.example` to `.env` and fill in your Daraz Seller Center credentials:

```env
DARAZ_APP_KEY=       # Numeric app key from Seller Center
DARAZ_APP_SECRET=    # Long alphanumeric secret
DARAZ_ACCESS_TOKEN=  # OAuth access token
DARAZ_COUNTRY=PK     # PK | BD | LK | NP | MM
DARAZ_SANDBOX=true   # true = sandbox (default) | false = production
```

| Variable | Required | Notes |
| -------- | -------- | ----- |
| `DARAZ_APP_KEY` | Yes | Numeric — from Seller Center API Test Tool |
| `DARAZ_APP_SECRET` | Yes | Alphanumeric — never commit this value |
| `DARAZ_ACCESS_TOKEN` | Yes | OAuth token — expires, refresh via Seller Center |
| `DARAZ_COUNTRY` | Yes | Determines which regional API endpoint is used |
| `DARAZ_SANDBOX` | No | Defaults to `true` — set `false` for production |

### Getting credentials

1. Log in to [Daraz Seller Center](https://sellercenter.daraz.pk)
2. Go to **Store → API Test Tool**
3. Click **Show** to reveal your App Key, App Secret, and Access Token

Takes about two minutes. No approval process is required for sandbox access.

---

## Integrations

### Claude Desktop

Locate your config file:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add the following entry:

```json
{
  "mcpServers": {
    "daraz": {
      "command": "node",
      "args": ["/absolute/path/to/mcp-daraz/dist/index.js"],
      "env": {
        "DARAZ_APP_KEY": "your_app_key",
        "DARAZ_APP_SECRET": "your_app_secret",
        "DARAZ_ACCESS_TOKEN": "your_access_token",
        "DARAZ_COUNTRY": "PK",
        "DARAZ_SANDBOX": "true"
      }
    }
  }
}
```

Restart Claude Desktop. You can then use prompts like:

> "Show me all pending orders from the last 7 days"

> "Mark order #987654321 as ready to ship via Leopards, tracking LP123456"

### Cursor, Cline, and other MCP clients

The server uses stdio transport and is compatible with any MCP client — Cursor, Cline, Continue, Zed, Windsurf, and custom agents built on the [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk).

Point the client at `node /path/to/dist/index.js` and supply the same environment variables listed above.

Example prompts:

```
List all pending orders from the last 3 days
Update the price of SKU SHOES-001 to PKR 3500 and set quantity to 25
Mark order #987654321 as ready to ship via Leopards with tracking LP123456
Download the shipping label for order items 111, 222, and 333
What is my payout status for April 2026?
Show me all products with missing images
Get QC status for SKUs: SHIRT-RED-M, SHIRT-RED-L, SHIRT-RED-XL
```

---

## Multi-country support

Set `DARAZ_COUNTRY` to target any supported market. No code changes are required — the server resolves the correct API endpoint at startup.

| Country | Code | API Endpoint |
| ------- | ---- | ------------ |
| Pakistan | `PK` | `api.daraz.pk` |
| Bangladesh | `BD` | `api.daraz.com.bd` |
| Sri Lanka | `LK` | `api.daraz.lk` |
| Nepal | `NP` | `api.daraz.com.np` |
| Myanmar | `MM` | `api.daraz.com.mm` |

---

## How request signing works

Daraz uses the Alibaba Open Platform HMAC-SHA256 signing scheme on every API request:

```
1. Collect all parameters: app_key, access_token, timestamp, method, and any API-specific params
2. Sort parameters alphabetically by key
3. Concatenate as: API_METHOD + key1value1key2value2... (no separators)
4. Prepend the API path: /rest + concatenated_string
5. HMAC-SHA256(full_string, APP_SECRET) → uppercase hex = sign
```

Every outgoing request is automatically signed with `app_key`, `access_token`, `timestamp`, `sign_method=sha256`, and the computed `sign`. If Daraz returns error code `27` (invalid timestamp), the client retries once with a fresh timestamp.

The signing implementation lives in `src/utils/sign.ts` and is small enough to audit in under a minute. Unit tests with known inputs and expected outputs are in `tests/unit/sign.test.ts`.

---

## Security

- **No bundled secrets.** Credentials are read exclusively from environment variables and are never hardcoded or logged.
- **No credential exposure in tool output.** Tools return API data only. Credentials are never echoed back in any response.
- **Sandbox by default.** Production mode requires explicitly setting `DARAZ_SANDBOX=false`, preventing accidental writes to live data.
- **Stdio transport.** The server has no network listener and communicates only with the parent MCP client process over stdin/stdout.
- **Audit-friendly signing.** The signing logic is isolated in a single file (`src/utils/sign.ts`) and relies solely on Node.js built-in `crypto` — no vendored cryptography.
- **Zod validation on every input.** All tool parameters are validated before any API call is made.

To report a security issue, please open a private GitHub advisory rather than a public issue.

---

## Error reference

| Code | Meaning |
| ---- | ------- |
| `0` | Success |
| `1` | Invalid request parameters |
| `2` | Invalid session — refresh your access token |
| `3` | API method does not exist |
| `4` | Seller not found |
| `7` | Insufficient permissions for this resource |
| `21` | Rate limit exceeded — reduce request frequency |
| `27` | Invalid timestamp — auto-retried once |
| `1000` | Daraz system error — try again later |

---

## Roadmap

- Webhook support for real-time order status notifications
- Bulk order CSV export
- Product performance analytics
- Multi-store support (multiple seller accounts)
- Automatic token refresh before expiry
- Automated GitHub releases
- mcp-leopards integration for direct courier booking from order data

---

## Contributing

Issues and pull requests are welcome. Before opening a PR:

- Do not include real seller credentials in bug reports — use placeholders such as `DARAZ_APP_KEY=test_key`
- Keep new tools framework-agnostic so the server remains usable from any MCP client
- Run `npm run test:unit` — all 21 tests must pass
- Run `npm run build` — zero TypeScript errors
- New tools must include Zod input validation and a mock fixture in `tests/mocks/responses.ts`

---

## License

[MIT](LICENSE) — not affiliated with or endorsed by Daraz, Alibaba Group, or any of their subsidiaries.
