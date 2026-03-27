import { makeRequest } from "../common/request.js";
import { toMcpTextResponse } from "./utils.js";

type QueryParams = Record<string, string | number | boolean>;

export async function fredReleases(params: QueryParams = {}) {
  const response = await makeRequest<any>("releases", params);
  return toMcpTextResponse(response);
}

export async function fredReleasesDates(params: QueryParams = {}) {
  const response = await makeRequest<any>("releases/dates", params);
  return toMcpTextResponse(response);
}

export async function fredRelease(release_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("release", { ...params, release_id });
  return toMcpTextResponse(response);
}

export async function fredReleaseDates(release_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("release/dates", { ...params, release_id });
  return toMcpTextResponse(response);
}

export async function fredReleaseSeries(release_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("release/series", { ...params, release_id });
  return toMcpTextResponse(response);
}

export async function fredReleaseSources(release_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("release/sources", { ...params, release_id });
  return toMcpTextResponse(response);
}

export async function fredReleaseTags(release_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("release/tags", { ...params, release_id });
  return toMcpTextResponse(response);
}

export async function fredReleaseRelatedTags(release_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("release/related_tags", { ...params, release_id });
  return toMcpTextResponse(response);
}

export async function fredReleaseTables(release_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("release/tables", { ...params, release_id });
  return toMcpTextResponse(response);
}

