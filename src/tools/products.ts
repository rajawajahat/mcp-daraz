import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { DarazClient } from "../client.js";
import { wrapTool } from "../utils/tool-response.js";

export function registerProductTools(server: McpServer, client: DarazClient): void {
  server.tool(
    "get_products",
    "List all products in your Daraz store with optional filters",
    {
      offset: z.number().default(0).describe("Pagination offset"),
      limit: z.number().min(1).max(100).default(20).describe("Number of products to return"),
      filter: z
        .enum(["all", "inactive", "active", "image-missing", "pending", "sold-out"])
        .optional()
        .describe("Filter products by status"),
      search: z.string().optional().describe("Search products by name"),
      sort_by: z.enum(["created_at", "updated_at", "name"]).optional().describe("Sort field"),
      sort_direction: z.enum(["ASC", "DESC"]).optional().describe("Sort direction"),
      update_before: z.string().optional().describe("Filter by update date (ISO date)"),
      update_after: z.string().optional().describe("Filter by update date (ISO date)"),
      create_before: z.string().optional().describe("Filter by creation date (ISO date)"),
      create_after: z.string().optional().describe("Filter by creation date (ISO date)"),
    },
    async (params) => {
      return wrapTool(async () => {
        const apiParams: Record<string, string> = {
          method: "sellercenter.product.list",
          offset: String(params.offset),
          limit: String(params.limit),
        };
        if (params.filter) apiParams.filter = params.filter;
        if (params.search) apiParams.search = params.search;
        if (params.sort_by) apiParams.sort_by = params.sort_by;
        if (params.sort_direction) apiParams.sort_direction = params.sort_direction;
        if (params.update_before) apiParams.update_before = params.update_before;
        if (params.update_after) apiParams.update_after = params.update_after;
        if (params.create_before) apiParams.create_before = params.create_before;
        if (params.create_after) apiParams.create_after = params.create_after;
        return client.get("sellercenter.product.list", apiParams);
      });
    }
  );

  server.tool(
    "get_product",
    "Get full details of a single product by its Daraz item ID",
    {
      item_id: z.string().describe("Daraz product item ID"),
    },
    async (params) => {
      return wrapTool(() =>
        client.get("sellercenter.product.get", {
          method: "sellercenter.product.get",
          item_id: params.item_id,
        })
      );
    }
  );

  server.tool(
    "create_product",
    "Create a new product listing on your Daraz store",
    {
      name: z.string().describe("Product name"),
      description: z.string().describe("Product description (HTML supported)"),
      primary_category: z.string().describe("Category ID from get_category_tree"),
      brand: z.string().describe("Brand name"),
      seller_sku: z.string().describe("Your unique SKU identifier"),
      price: z.number().describe("Selling price"),
      quantity: z.number().describe("Available stock quantity"),
      package_weight: z.number().describe("Weight in kg"),
      package_length: z.number().describe("Length in cm"),
      package_width: z.number().describe("Width in cm"),
      package_height: z.number().describe("Height in cm"),
      images: z.array(z.string()).max(8).describe("Array of image URLs (max 8)"),
      color_family: z.string().optional().describe("Color family"),
      size: z.string().optional().describe("Size"),
    },
    async (params) => {
      return wrapTool(() => {
        const payload = {
          Request: {
            Product: {
              PrimaryCategory: params.primary_category,
              Attributes: {
                name: params.name,
                description: params.description,
                brand: params.brand,
                ...(params.color_family && { color_family: params.color_family }),
                ...(params.size && { size: params.size }),
              },
              Skus: {
                Sku: [
                  {
                    SellerSku: params.seller_sku,
                    price: params.price,
                    quantity: params.quantity,
                    package_weight: params.package_weight,
                    package_length: params.package_length,
                    package_width: params.package_width,
                    package_height: params.package_height,
                    Images: { Image: params.images },
                  },
                ],
              },
            },
          },
        };
        return client.post("sellercenter.product.create", { method: "sellercenter.product.create" }, payload);
      });
    }
  );

  server.tool(
    "update_product",
    "Update attributes of an existing Daraz product",
    {
      item_id: z.string().describe("Daraz product item ID"),
      name: z.string().optional().describe("New product name"),
      description: z.string().optional().describe("New product description"),
      images: z.array(z.string()).max(8).optional().describe("New image URLs"),
    },
    async (params) => {
      return wrapTool(() => {
        const attributes: Record<string, unknown> = {};
        if (params.name) attributes.name = params.name;
        if (params.description) attributes.description = params.description;

        const payload: Record<string, unknown> = {
          Request: {
            Product: {
              ItemId: params.item_id,
              Attributes: attributes,
              ...(params.images && { Images: { Image: params.images } }),
            },
          },
        };
        return client.post("sellercenter.product.update", { method: "sellercenter.product.update" }, payload);
      });
    }
  );

  server.tool(
    "update_price_quantity",
    "Update price and/or quantity for one or more SKUs",
    {
      skus: z
        .array(
          z.object({
            seller_sku: z.string().describe("Seller SKU identifier"),
            price: z.number().describe("New price"),
            quantity: z.number().describe("New quantity"),
          })
        )
        .min(1)
        .max(50)
        .describe("Array of SKUs to update"),
    },
    async (params) => {
      return wrapTool(() => {
        const payload = {
          Request: {
            Product: {
              Skus: {
                Sku: params.skus.map((sku) => ({
                  SellerSku: sku.seller_sku,
                  Price: sku.price,
                  Quantity: sku.quantity,
                })),
              },
            },
          },
        };
        return client.post(
          "sellercenter.product.price_quantity.update",
          { method: "sellercenter.product.price_quantity.update" },
          payload
        );
      });
    }
  );

  server.tool(
    "get_category_tree",
    "Get the full product category tree for your Daraz country",
    {},
    async () => {
      return wrapTool(() =>
        client.get("sellercenter.category.tree.get", {
          method: "sellercenter.category.tree.get",
        })
      );
    }
  );

  server.tool(
    "get_category_attributes",
    "Get required and optional attributes for a specific category",
    {
      primary_category_id: z.string().describe("Category ID to get attributes for"),
    },
    async (params) => {
      return wrapTool(() =>
        client.get("sellercenter.category.attributes.get", {
          method: "sellercenter.category.attributes.get",
          primary_category_id: params.primary_category_id,
        })
      );
    }
  );

  server.tool(
    "get_brands",
    "Search available brands on Daraz",
    {
      offset: z.number().default(0).describe("Pagination offset"),
      limit: z.number().min(1).max(100).default(100).describe("Number of brands to return"),
      search: z.string().optional().describe("Search brands by name"),
    },
    async (params) => {
      return wrapTool(async () => {
        const apiParams: Record<string, string> = {
          method: "sellercenter.brand.get",
          offset: String(params.offset),
          limit: String(params.limit),
        };
        if (params.search) apiParams.search = params.search;
        return client.get("sellercenter.brand.get", apiParams);
      });
    }
  );
}
