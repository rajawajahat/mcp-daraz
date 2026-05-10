const BASE_URLS: Record<string, string> = {
  PK: "https://api.daraz.pk/rest",
  BD: "https://api.daraz.com.bd/rest",
  LK: "https://api.daraz.lk/rest",
  NP: "https://api.daraz.com.np/rest",
  MM: "https://api.daraz.com.mm/rest",
};

export function getBaseUrl(country: string): string {
  const url = BASE_URLS[country.toUpperCase()];
  if (!url) {
    throw new Error(
      `Unsupported country code: "${country}". Valid codes: ${Object.keys(BASE_URLS).join(", ")}`
    );
  }
  return url;
}

export function generateTimestamp(): string {
  return Date.now().toString();
}

export function formatOrderIds(ids: string[]): string {
  return ids.join(",");
}
