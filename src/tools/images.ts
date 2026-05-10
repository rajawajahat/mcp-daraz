import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DarazClient } from "../client.js";
import { wrapTool } from "../utils/tool-response.js";

export function registerImageTools(server: McpServer, client: DarazClient): void {
  server.tool(
    "upload_image",
    "Upload a product image to Daraz by providing a public image URL",
    {
      image_url: z.string().describe("Publicly accessible image URL"),
    },
    async (params) => {
      return wrapTool(() =>
        client.post(
          "sellercenter.image.upload",
          { method: "sellercenter.image.upload" },
          { Image: { Url: params.image_url } }
        )
      );
    }
  );

  server.tool(
    "migrate_image",
    "Migrate a single image from an external URL to Daraz CDN",
    {
      url: z.string().describe("External image URL to migrate"),
    },
    async (params) => {
      return wrapTool(() =>
        client.post(
          "sellercenter.image.migrate",
          { method: "sellercenter.image.migrate" },
          { Request: { Image: { Url: params.url } } }
        )
      );
    }
  );

  server.tool(
    "migrate_images",
    "Migrate multiple images from external URLs to Daraz CDN in one call",
    {
      urls: z.array(z.string()).min(1).max(10).describe("Array of external image URLs (max 10)"),
    },
    async (params) => {
      return wrapTool(() =>
        client.post(
          "sellercenter.images.migrate",
          { method: "sellercenter.images.migrate" },
          { Request: { Images: { Image: params.urls.map((url) => ({ Url: url })) } } }
        )
      );
    }
  );

  server.tool(
    "set_images",
    "Set or replace images for an existing product SKU",
    {
      seller_sku: z.string().describe("Seller SKU identifier"),
      images: z.array(z.string()).min(1).max(8).describe("Array of Daraz CDN image URLs (max 8)"),
    },
    async (params) => {
      return wrapTool(() =>
        client.post(
          "sellercenter.product.image.set",
          { method: "sellercenter.product.image.set" },
          {
            Request: {
              Product: {
                Skus: {
                  Sku: [{ SellerSku: params.seller_sku, Images: { Image: params.images } }],
                },
              },
            },
          }
        )
      );
    }
  );

  server.tool(
    "get_qc_status",
    "Check quality control status of product SKUs",
    {
      seller_skus: z.array(z.string()).min(1).describe("Array of seller SKU codes"),
    },
    async (params) => {
      return wrapTool(() =>
        client.get("sellercenter.product.qc_status.get", {
          method: "sellercenter.product.qc_status.get",
          seller_skus: JSON.stringify(params.seller_skus),
        })
      );
    }
  );
}
