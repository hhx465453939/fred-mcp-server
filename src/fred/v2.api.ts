import { makeRequestV2 } from "../common/request.js";
import { toMcpTextResponse } from "./utils.js";

type QueryParams = Record<string, string | number | boolean>;

export async function fredV2ReleaseObservations(release_id: number, params: QueryParams = {}) {
  const response = await makeRequestV2<any>("release/observations", { ...params, release_id });
  return toMcpTextResponse(response);
}

