import { makeRequestGeoFred } from "../common/request.js";
import { toMcpTextResponse } from "./utils.js";

type QueryParams = Record<string, string | number | boolean>;

/**
 * GeoFRED (Maps API) endpoints live under:
 *   https://api.stlouisfed.org/geofred/
 *
 * Official docs:
 * - Shapes: https://fred.stlouisfed.org/docs/api/geofred/shapes.html
 * - Series Group: https://fred.stlouisfed.org/docs/api/geofred/series_group.html
 * - Regional Data: https://fred.stlouisfed.org/docs/api/geofred/regional_data.html
 */

export async function geoFredShapes(params: QueryParams = {}) {
  const response = await makeRequestGeoFred<any>("shapes", params);
  return toMcpTextResponse(response);
}

export async function geoFredSeriesGroup(series_id: string, params: QueryParams = {}) {
  const response = await makeRequestGeoFred<any>("series/group", { ...params, series_id });
  return toMcpTextResponse(response);
}

export async function geoFredRegionalData(params: QueryParams = {}) {
  const response = await makeRequestGeoFred<any>("regional/data", params);
  return toMcpTextResponse(response);
}

