const ERROR_CODES: Record<string, string> = {
  "0": "Success",
  "1": "Request parameter error — check your inputs",
  "2": "Invalid session — refresh your access token",
  "3": "API method does not exist",
  "4": "Seller not found",
  "7": "No permission to access this resource",
  "21": "Rate limit exceeded — slow down requests",
  "27": "Invalid timestamp — will auto-retry",
  "1000": "Daraz system error — try again later",
};

export class DarazAPIError extends Error {
  public code: string;
  public originalMessage: string;

  constructor(code: string, originalMessage: string) {
    const human = ERROR_CODES[code] ?? `Unknown error (code: ${code})`;
    super(`[EP-${code}] ${human} — Raw: ${originalMessage}`);
    this.code = code;
    this.originalMessage = originalMessage;
    this.name = "DarazAPIError";
  }
}

export function getErrorMessage(code: string): string {
  return ERROR_CODES[code] ?? `Unknown error (code: ${code})`;
}
