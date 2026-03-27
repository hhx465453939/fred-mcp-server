import { makeRequest } from "../common/request.js";
import { toMcpTextResponse } from "./utils.js";

type QueryParams = Record<string, string | number | boolean>;

export async function fredCategoryGet(category_id?: number, params: QueryParams = {}) {
  const queryParams: QueryParams = { ...params };
  if (category_id !== undefined) queryParams.category_id = category_id;
  const response = await makeRequest<any>("category", queryParams);
  return toMcpTextResponse(response);
}

export async function fredCategoryChildren(category_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("category/children", { ...params, category_id });
  return toMcpTextResponse(response);
}

export async function fredCategoryRelated(category_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("category/related", { ...params, category_id });
  return toMcpTextResponse(response);
}

export async function fredCategorySeries(category_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("category/series", { ...params, category_id });
  return toMcpTextResponse(response);
}

export async function fredCategoryTags(category_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("category/tags", { ...params, category_id });
  return toMcpTextResponse(response);
}

export async function fredCategoryRelatedTags(category_id: number, params: QueryParams = {}) {
  const response = await makeRequest<any>("category/related_tags", { ...params, category_id });
  return toMcpTextResponse(response);
}

