import axios, { AxiosInstance } from "axios";
import { generateSign } from "./utils/sign.js";
import { generateTimestamp, getBaseUrl } from "./utils/helpers.js";
import { DarazAPIError } from "./utils/errors.js";

interface DarazClientConfig {
  appKey: string;
  appSecret: string;
  accessToken: string;
  country: string;
  sandbox: boolean;
}

export class DarazClient {
  private appKey: string;
  private appSecret: string;
  private accessToken: string;
  private baseUrl: string;
  private http: AxiosInstance;

  constructor(config: DarazClientConfig) {
    this.appKey = config.appKey;
    this.appSecret = config.appSecret;
    this.accessToken = config.accessToken;
    this.baseUrl = getBaseUrl(config.country);
    this.http = axios.create({ timeout: 30000 });
  }

  private buildRequest(
    method: string,
    params: Record<string, string>
  ): { url: string; queryParams: Record<string, string> } {
    const timestamp = generateTimestamp();
    const allParams: Record<string, string> = {
      app_key: this.appKey,
      access_token: this.accessToken,
      timestamp,
      sign_method: "sha256",
      ...params,
    };

    const apiPath = new URL(this.baseUrl).pathname;
    const sign = generateSign(apiPath, allParams, this.appSecret);

    return {
      url: this.baseUrl,
      queryParams: { ...allParams, sign },
    };
  }

  async get(
    method: string,
    params: Record<string, string> = {}
  ): Promise<Record<string, unknown>> {
    return this.request("GET", method, params);
  }

  async post(
    method: string,
    params: Record<string, string> = {},
    body?: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return this.request("POST", method, params, body);
  }

  private async request(
    httpMethod: "GET" | "POST",
    apiMethod: string,
    params: Record<string, string>,
    body?: Record<string, unknown>,
    isRetry = false
  ): Promise<Record<string, unknown>> {
    const { url, queryParams } = this.buildRequest(apiMethod, params);

    const response = await this.http.request({
      method: httpMethod,
      url,
      params: queryParams,
      data: body,
    });

    const data = response.data as Record<string, unknown>;
    const code = String(data.code ?? "0");

    if (code === "27" && !isRetry) {
      return this.request(httpMethod, apiMethod, params, body, true);
    }

    if (code !== "0") {
      throw new DarazAPIError(code, String(data.message ?? "Unknown error"));
    }

    return (data.data ?? data.result ?? data) as Record<string, unknown>;
  }
}
