import { makeRequest } from "../common/request.js";
import { toMcpTextResponse } from "./utils.js";

type QueryParams = Record<string, string | number | boolean>;

export async function fredSources(params: QueryParams = {}) {
  const response = await makeRequest<any>("sources", params);
  return toMcpTextResponse(response);
}

export async function fredSource(source_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("source", { ...params, source_id });
  return toMcpTextResponse(response);
}

export async function fredSourceReleases(source_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("source/releases", { ...params, source_id });
  return toMcpTextResponse(response);
}

