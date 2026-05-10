# mcp-daraz

[![npm](https://img.shields.io/npm/v/mcp-daraz)](https://www.npmjs.com/package/mcp-daraz)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node >=18](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![MCP](https://img.shields.io/badge/MCP-compatible-purple)](https://modelcontextprotocol.io)
[![status: alpha](https://img.shields.io/badge/status-alpha-orange)]()

An open-source [Model Context Protocol](https://modelcontextprotocol.io) server for **Daraz** — South & Southeast Asia's largest e-commerce platform. Plug it into Claude Desktop, Cursor, Cline, or any MCP-aware agent and let it manage your entire store: list orders, update inventory, mark shipments, download labels, and check payouts — all through the Daraz Seller API.

> Sandbox-by-default. Bring your own seller credentials. No secrets bundled.

---

## Table of contents

- [Why this exists](#why-this-exists)
- [Tools](#tools)
- [Quick start](#quick-start)
- [Configuration](#configuration)
- [Wire it into Claude Desktop](#wire-it-into-claude-desktop)
- [Use it from any MCP client](#use-it-from-any-mcp-client)
- [Multi-country support](#multi-country-support)
- [How signing works](#how-signing-works)
- [Security model](#security-model)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Why this exists

Daraz sellers across Pakistan, Bangladesh, Sri Lanka, Nepal, and Myanmar manage orders manually — tab by tab, copy-pasting tracking numbers, downloading labels one at a time, and checking payouts on a separate finance screen. The Daraz Seller API has existed for years but integrating it means reading a gated PDF, figuring out Alibaba's HMAC-SHA256 signing scheme, and wrestling with XML product payloads.

This MCP gives any agent a stable, typed interface to Daraz so you never have to teach it the signature scheme, field names, or country-specific base URLs again. Prompt your agent in plain English; let the server handle the cryptography and HTTP.

---

## Tools

28 tools across 5 categories.

### Products


| Tool                      | Purpose                                                      |
| ------------------------- | ------------------------------------------------------------ |
| `get_products`            | List store products with status, search, and date filters    |
| `get_product`             | Full details for a single product by item ID                 |
| `create_product`          | Create a new listing with images, SKU, price, and dimensions |
| `update_product`          | Update name, description, or images on an existing product   |
| `update_price_quantity`   | Bulk-update price and stock across up to 50 SKUs at once     |
| `get_category_tree`       | Full category hierarchy for your country                     |
| `get_category_attributes` | Required and optional fields for a specific category         |
| `get_brands`              | Search available brands by name                              |


### Orders


| Tool                          | Purpose                                                         |
| ----------------------------- | --------------------------------------------------------------- |
| `get_orders`                  | List orders filtered by status, date range, and sort order      |
| `get_order`                   | Full details for a single order                                 |
| `get_order_items`             | Item-level breakdown for one or more orders                     |
| `set_status_to_packed`        | Mark items as packed with shipping provider and tracking number |
| `set_status_to_ready_to_ship` | Trigger courier pickup — moves order to RTS status              |
| `set_status_to_cancelled`     | Cancel an order item with a reason code                         |
| `get_failure_reasons`         | Retrieve valid cancellation reason codes                        |


### Shipment


| Tool                     | Purpose                                                             |
| ------------------------ | ------------------------------------------------------------------- |
| `get_shipment_providers` | List available courier providers for your store                     |
| `get_document`           | Download shipping label, invoice, carrier manifest, or payment list |
| `set_invoice_number`     | Attach a custom invoice number to an order item                     |
| `get_tracking_info`      | Live tracking status for a shipment                                 |


### Finance


| Tool                      | Purpose                                          |
| ------------------------- | ------------------------------------------------ |
| `get_seller`              | Seller profile, shop name, and account status    |
| `get_payout_status`       | Settlement status for a date range               |
| `get_transaction_details` | Itemised transaction history with type filtering |
| `get_transaction_types`   | All transaction type codes for use as filters    |


### Images & QC


| Tool             | Purpose                                            |
| ---------------- | -------------------------------------------------- |
| `upload_image`   | Upload a product image by providing a public URL   |
| `migrate_image`  | Migrate a single external image to Daraz CDN       |
| `migrate_images` | Bulk-migrate up to 10 external images in one call  |
| `set_images`     | Set or replace all images on an existing SKU       |
| `get_qc_status`  | Quality control status for one or more seller SKUs |


---

## Quick start

```bash
git clone https://github.com/rajawajahat/mcp-daraz.git
cd mcp-daraz
npm install
cp .env.example .env    # then fill in your credentials
npm run build
npm start
```

The server speaks MCP over stdio, so `npm start` is most useful when launched by an MCP client. To verify the build alone:

```bash
npm run test:unit       # 21 tests, no credentials required
npm run build           # zero TypeScript errors
```

---

## Configuration

Copy `.env.example` to `.env` and fill in your Daraz Seller Center credentials:

```env
DARAZ_APP_KEY=           # Numeric app key from Seller Center
DARAZ_APP_SECRET=        # Long alphanumeric secret
DARAZ_ACCESS_TOKEN=      # OAuth access token
DARAZ_COUNTRY=PK         # PK | BD | LK | NP | MM
DARAZ_SANDBOX=true       # true = sandbox (default), false = production
```

### How to get credentials

1. Login to [Daraz Seller Center](https://sellercenter.daraz.pk)
2. Navigate to **Store → API Test Tool**
3. Click **Show** to reveal your App Key, App Secret, and Access Token

Takes about 2 minutes. No approval process required for sandbox access.


| Variable             | Required | Notes                                            |
| -------------------- | -------- | ------------------------------------------------ |
| `DARAZ_APP_KEY`      | Yes      | Numeric — from Seller Center API Test Tool       |
| `DARAZ_APP_SECRET`   | Yes      | Long alphanumeric — never commit this            |
| `DARAZ_ACCESS_TOKEN` | Yes      | OAuth token — expires, refresh via Seller Center |
| `DARAZ_COUNTRY`      | Yes      | Determines which regional API endpoint is used   |
| `DARAZ_SANDBOX`      | No       | Defaults to `true` — set `false` for production  |


---

## Wire it into Claude Desktop

Add this to `claude_desktop_config.json`:

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

Config file locations:

- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Restart Claude Desktop, then try:

> *"Show me all pending orders from the last 7 days"*

Claude will call `get_orders` with `status: pending` and `created_after` set to 7 days ago and return a formatted list.

Or via npx without cloning:

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

---

## Use it from any MCP client

The server uses stdio transport, so it works with anything that speaks MCP — Cursor, Cline, Continue, Zed, Windsurf, and custom agents built on the [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk).

Point the client at `node /path/to/dist/index.js` and pass the same env vars shown above.

Example prompts that work out of the box:

```
"List all my pending orders from the last 3 days"
"Update the price of SKU SHOES-001 to PKR 3500 and set quantity to 25"
"Mark order #987654321 as ready to ship via Leopards with tracking LP123456"
"Download the shipping label for order items 111, 222, 333"
"What is my payout status for April 2026?"
"Show me all products with missing images"
"Get QC status for SKUs: SHIRT-RED-M, SHIRT-RED-L, SHIRT-RED-XL"
```

---

## Multi-country support

The same credentials work across all Daraz markets. Change `DARAZ_COUNTRY` to switch:


| Country    | Code | API Base URL       |
| ---------- | ---- | ------------------ |
| Pakistan   | `PK` | `api.daraz.pk`     |
| Bangladesh | `BD` | `api.daraz.com.bd` |
| Sri Lanka  | `LK` | `api.daraz.lk`     |
| Nepal      | `NP` | `api.daraz.com.np` |
| Myanmar    | `MM` | `api.daraz.com.mm` |


No code changes required — the server resolves the correct endpoint from `DARAZ_COUNTRY` at startup.

---

## How signing works

Daraz uses the Alibaba Open Platform HMAC-SHA256 signing scheme on every request:

```
1. Collect all params: app_key, access_token, timestamp, method, + any API params
2. Sort params alphabetically by key
3. Concatenate: API_METHOD + key1value1key2value2... (no separators)
4. Prepend the API path: /rest + concatenated_string  
5. HMAC-SHA256(full_string, APP_SECRET) → uppercase hex = sign
```

Every request automatically receives `app_key`, `access_token`, `timestamp`, `sign_method=sha256`, and `sign`. If Daraz returns error code `27` (invalid timestamp), the client auto-retries once with a fresh timestamp.

The signing logic lives in `src/utils/sign.ts` — small enough to audit in under a minute. Unit tests with known inputs and expected outputs are in `tests/unit/sign.test.ts`.

---

## Security model

- **No bundled secrets.** Credentials are read from environment variables only — never hardcoded or logged.
- **No secrets in tool output.** Tools return API data only. Credentials are never echoed back.
- **Sandbox is the default.** Production requires explicitly setting `DARAZ_SANDBOX=false` — accidental production writes are prevented.
- **Stdio transport.** The server has no network listener. It talks only to the parent MCP client process over stdin/stdout.
- **Audit-friendly.** Signing logic is isolated in one file (`src/utils/sign.ts`). No vendored cryptography — uses Node.js built-in `crypto`.
- **Zod validation on all inputs.** Every tool validates its parameters before making any API call.

If you find a security issue, please open a private advisory on GitHub rather than a public issue.

---

## Error codes


| Code   | Meaning                                        |
| ------ | ---------------------------------------------- |
| `0`    | Success                                        |
| `1`    | Invalid request parameters — check your inputs |
| `2`    | Invalid session — refresh your access token    |
| `3`    | API method does not exist                      |
| `4`    | Seller not found                               |
| `7`    | No permission to access this resource          |
| `21`   | Rate limit exceeded — slow down requests       |
| `27`   | Invalid timestamp — auto-retried once          |
| `1000` | Daraz system error — try again later           |


---

## Roadmap

- Webhook support for real-time order status notifications
- Bulk order CSV export tool
- Product performance analytics tool
- Multi-store support (multiple seller accounts)
- Token auto-refresh before expiry
- Published npm package + automated GitHub releases
- mcp-leopards integration for direct courier booking from order data

---

## Contributing

Issues and PRs welcome. A few ground rules:

- Don't paste real seller credentials into bug reports — use placeholder values like `DARAZ_APP_KEY=test_key`
- Keep new tools framework-agnostic; the server must remain usable from any MCP client
- Run `npm run test:unit` before opening a PR — all 21 tests must pass
- Run `npm run build` and confirm zero TypeScript errors before opening a PR
- New tools must include Zod input validation and a mock fixture in `tests/mocks/responses.ts`

---

## License

[MIT](LICENSE). Not affiliated with or endorsed by Daraz, Alibaba Group, or any of their subsidiaries.

