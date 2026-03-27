import { makeRequest } from "../common/request.js";
import { toMcpTextResponse } from "./utils.js";

type QueryParams = Record<string, string | number | boolean>;

export async function fredTags(params: QueryParams = {}) {
  const response = await makeRequest<any>("tags", params);
  return toMcpTextResponse(response);
}

export async function fredRelatedTags(params: QueryParams = {}) {
  const response = await makeRequest<any>("related_tags", params);
  return toMcpTextResponse(response);
}

export async function fredTagsSeries(params: QueryParams = {}) {
  const response = await makeRequest<any>("tags/series", params);
  return toMcpTextResponse(response);
}

