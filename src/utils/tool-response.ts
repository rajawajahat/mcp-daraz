import { DarazAPIError, getErrorMessage } from "./errors.js";

type TextContent = { type: "text"; text: string };
type ToolResponse = { content: TextContent[] };

export function toToolResponse(data: unknown): ToolResponse {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

export function toErrorResponse(error: unknown): ToolResponse {
  if (error instanceof DarazAPIError) {
    return {
      content: [
        {
          type: "text",
          text: `Error [${error.code}]: ${getErrorMessage(error.code)}`,
        },
      ],
    };
  }
  const message = error instanceof Error ? error.message : String(error);
  return { content: [{ type: "text", text: `Error: ${message}` }] };
}

export async function wrapTool(fn: () => Promise<unknown>): Promise<ToolResponse> {
  try {
    return toToolResponse(await fn());
  } catch (error) {
    return toErrorResponse(error);
  }
}
