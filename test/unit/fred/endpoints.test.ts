import { describe, expect, test, jest, beforeEach, afterEach } from "@jest/globals";
import {
  fredCategoryGet,
  fredCategoryChildren,
  fredCategoryRelated,
  fredCategorySeries,
  fredCategoryTags,
  fredCategoryRelatedTags,
} from "../../../src/fred/categories.api.js";
import {
  fredReleases,
  fredReleasesDates,
  fredRelease,
  fredReleaseDates,
  fredReleaseSeries,
  fredReleaseSources,
  fredReleaseTags,
  fredReleaseRelatedTags,
  fredReleaseTables,
} from "../../../src/fred/releases.api.js";
import { fredSources, fredSource, fredSourceReleases } from "../../../src/fred/sources.api.js";
import { fredTags, fredRelatedTags, fredTagsSeries } from "../../../src/fred/tags.api.js";
import {
  fredSeries,
  fredSeriesCategories,
  fredSeriesRelease,
  fredSeriesTags,
  fredSeriesObservations,
  fredSeriesUpdates,
  fredSeriesVintageDates,
  fredSeriesSearch,
  fredSeriesSearchTags,
  fredSeriesSearchRelatedTags,
} from "../../../src/fred/series.api.js";
import { geoFredShapes, geoFredSeriesGroup, geoFredRegionalData } from "../../../src/fred/maps.api.js";
import { fredV2ReleaseObservations } from "../../../src/fred/v2.api.js";

describe("Full endpoint API modules", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    const oldApiKey = process.env.FRED_API_KEY;
    process.env.FRED_API_KEY = "test-api-key";
    (global as any).__OLD_FRED_API_KEY__ = oldApiKey;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
      text: async () => "ok",
    } as any);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.FRED_API_KEY = (global as any).__OLD_FRED_API_KEY__;
    delete (global as any).__OLD_FRED_API_KEY__;
  });

  test("invokes all endpoint wrappers at least once", async () => {
    // Categories
    await fredCategoryGet();
    await fredCategoryGet(0);
    await fredCategoryChildren(1);
    await fredCategoryRelated(1);
    await fredCategorySeries(1);
    await fredCategoryTags(1);
    await fredCategoryRelatedTags(1);

    // Releases
    await fredReleases();
    await fredReleasesDates();
    await fredRelease(10);
    await fredReleaseDates(10);
    await fredReleaseSeries(10);
    await fredReleaseSources(10);
    await fredReleaseTags(10);
    await fredReleaseRelatedTags(10);
    await fredReleaseTables(10);

    // Series
    await fredSeries("GDP");
    await fredSeriesCategories("GDP");
    await fredSeriesObservations("GDP", { limit: 1 });
    await fredSeriesRelease("GDP");
    await fredSeriesSearch({ search_text: "gdp" });
    await fredSeriesSearchTags({ series_search_text: "gdp" });
    await fredSeriesSearchRelatedTags({ tag_names: "gdp" });
    await fredSeriesTags("GDP");
    await fredSeriesUpdates({ limit: 1 });
    await fredSeriesVintageDates("GDP");

    // Sources
    await fredSources();
    await fredSource(1);
    await fredSourceReleases(1);

    // Tags
    await fredTags({ search_text: "gdp" });
    await fredRelatedTags({ tag_names: "gdp" });
    await fredTagsSeries({ tag_names: "gdp" });

    // GeoFRED (Maps)
    await geoFredShapes({ shape: "state" });
    await geoFredSeriesGroup("WIPCPI");
    await geoFredRegionalData({ series_group: "WIPCPI", region_type: "state" });

    // FRED API v2
    await fredV2ReleaseObservations(10);

    expect(global.fetch).toHaveBeenCalled();
  });
});

