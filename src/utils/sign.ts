import { createHmac } from "crypto";

export function generateSign(
  apiPath: string,
  params: Record<string, string>,
  appSecret: string
): string {
  const sorted = Object.keys(params)
    .sort()
    .map((key) => `${key}${params[key]}`)
    .join("");

  const fullString = `${apiPath}${sorted}`;
  const hmac = createHmac("sha256", appSecret);
  hmac.update(fullString);
  return hmac.digest("hex").toUpperCase();
}
