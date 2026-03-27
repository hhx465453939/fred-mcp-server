import { makeRequest } from "../common/request.js";
import { toMcpTextResponse } from "./utils.js";

type QueryParams = Record<string, string | number | boolean>;

export async function fredSeries(series_id: string, params: QueryParams = {}) {
  const response = await makeRequest<any>("series", { ...params, series_id });
  return toMcpTextResponse(response);
}

export async function fredSeriesCategories(series_id: string, params: QueryParams = {}) {
  const response = await makeRequest<any>("series/categories", { ...params, series_id });
  return toMcpTextResponse(response);
}

export async function fredSeriesRelease(series_id: string, params: QueryParams = {}) {
  const response = await makeRequest<any>("series/release", { ...params, series_id });
  return toMcpTextResponse(response);
}

export async function fredSeriesTags(series_id: string, params: QueryParams = {}) {
  const response = await makeRequest<any>("series/tags", { ...params, series_id });
  return toMcpTextResponse(response);
}

export async function fredSeriesObservations(series_id: string, params: QueryParams = {}) {
  const response = await makeRequest<any>("series/observations", { ...params, series_id });
  return toMcpTextResponse(response);
}

export async function fredSeriesUpdates(params: QueryParams = {}) {
  const response = await makeRequest<any>("series/updates", params);
  return toMcpTextResponse(response);
}

export async function fredSeriesVintageDates(series_id: string, params: QueryParams = {}) {
  const response = await makeRequest<any>("series/vintagedates", { ...params, series_id });
  return toMcpTextResponse(response);
}

export async function fredSeriesSearch(params: QueryParams = {}) {
  const response = await makeRequest<any>("series/search", params);
  return toMcpTextResponse(response);
}

export async function fredSeriesSearchTags(params: QueryParams = {}) {
  const response = await makeRequest<any>("series/search/tags", params);
  return toMcpTextResponse(response);
}

export async function fredSeriesSearchRelatedTags(params: QueryParams = {}) {
  const response = await makeRequest<any>("series/search/related_tags", params);
  return toMcpTextResponse(response);
}

