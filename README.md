# mcp-daraz 🛍️

**The first MCP server for Daraz** — manage your entire store from
your AI agent. Works across 🇵🇰 Pakistan · 🇧🇩 Bangladesh · 🇱🇰 Sri Lanka · 🇳🇵 Nepal · 🇲🇲 Myanmar

## The Problem
Daraz sellers manually check orders, update inventory, track payouts,
and manage shipments across multiple tabs every day. No AI tooling exists.

## The Solution
Describe what you want. The agent does it.

> "Show me all pending orders from the last 7 days"
> "Update SKU XYZ price to 2500 and set quantity to 50"
> "Mark order #12345 as ready to ship via Leopards, tracking TRK789"
> "What's my payout status for this month?"

## Tools (28 total)

### 📦 Products (8)
| Tool | Description |
|------|-------------|
| get_products | List store products with filters |
| get_product | Get single product details |
| create_product | Create new listing |
| update_product | Update product attributes |
| update_price_quantity | Bulk price/stock update |
| get_category_tree | Browse category hierarchy |
| get_category_attributes | Get category fields |
| get_brands | Search available brands |

### 🛒 Orders (7)
| Tool | Description |
|------|-------------|
| get_orders | List orders with status filter |
| get_order | Get single order details |
| get_order_items | Get items for multiple orders |
| set_status_to_packed | Mark as packed |
| set_status_to_ready_to_ship | Trigger courier pickup |
| set_status_to_cancelled | Cancel with reason |
| get_failure_reasons | Get cancellation reason codes |

### 🚚 Shipment (4)
| Tool | Description |
|------|-------------|
| get_shipment_providers | List available couriers |
| get_document | Download label/invoice/manifest |
| set_invoice_number | Set custom invoice number |
| get_tracking_info | Track shipment status |

### 💰 Finance (4)
| Tool | Description |
|------|-------------|
| get_seller | Get seller profile & status |
| get_payout_status | Check settlement status |
| get_transaction_details | View transaction history |
| get_transaction_types | Get transaction type codes |

### 🖼️ Images & QC (5)
| Tool | Description |
|------|-------------|
| upload_image | Upload image by URL |
| migrate_image | Migrate single image to CDN |
| migrate_images | Bulk image migration |
| set_images | Set images for a SKU |
| get_qc_status | Check product QC status |

## Setup

### 1. Get Credentials
1. Login to [Daraz Seller Center](https://sellercenter.daraz.pk)
2. Go to **Store → API Test Tool**
3. Copy your **App Key**, **App Secret**, and **Access Token**
   (Takes 2 minutes, completely free)

### 2. Install
```bash
npx mcp-daraz
```

### 3. Configure Claude Desktop
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

### 4. Configure Claude Code
```bash
DARAZ_APP_KEY=xxx DARAZ_APP_SECRET=xxx DARAZ_ACCESS_TOKEN=xxx npx mcp-daraz
```

## Multi-Country Support
Same credentials work across all Daraz markets — just change DARAZ_COUNTRY:
- `PK` → Pakistan (api.daraz.pk)
- `BD` → Bangladesh (api.daraz.com.bd)
- `LK` → Sri Lanka (api.daraz.lk)
- `NP` → Nepal (api.daraz.com.np)
- `MM` → Myanmar (api.daraz.com.mm)

## Error Codes
| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Invalid request parameters |
| 2 | Invalid session — refresh token |
| 7 | No permission |
| 21 | Rate limit exceeded |
| 1000 | Daraz system error |

## Roadmap
- [ ] Webhook support for real-time order notifications
- [ ] Bulk order processing (CSV export)
- [ ] Analytics dashboard tool
- [ ] Product performance metrics
- [ ] Multi-store support
- [ ] mcp-leopards integration for direct courier booking

## License
MIT

> Built for Daraz sellers across South & Southeast Asia.
> Inspired by [mcp-jazzcash](https://github.com/tehreem-a/mcp-jazzcash).
