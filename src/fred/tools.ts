/**
 * MCP Tool Definitions for FRED API
 * 
 * Comprehensive tools for accessing any FRED data
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { searchSeries, FREDSearchOptions } from "./search.js";
import { getSeriesData, FREDSeriesOptions } from "./series.js";
import { browseCategories, getCategorySeries, browseReleases, getReleaseSeries, browseSources } from "./browse.js";
import {
  fredCategoryGet,
  fredCategoryChildren,
  fredCategoryRelated,
  fredCategorySeries,
  fredCategoryTags,
  fredCategoryRelatedTags,
} from "./categories.api.js";
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
} from "./releases.api.js";
import { fredSources, fredSource, fredSourceReleases } from "./sources.api.js";
import { fredTags, fredRelatedTags, fredTagsSeries } from "./tags.api.js";
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
} from "./series.api.js";
import { geoFredShapes, geoFredSeriesGroup, geoFredRegionalData } from "./maps.api.js";
import { fredV2ReleaseObservations } from "./v2.api.js";

/**
 * Schema for FRED search tool
 */
const SEARCH_SCHEMA = {
  search_text: z.string().optional().describe("Text to search for in series titles and descriptions"),
  search_type: z.enum(["full_text", "series_id"]).optional().describe("Type of search to perform"),
  tag_names: z.string().optional().describe("Comma-separated list of tag names to filter by"),
  exclude_tag_names: z.string().optional().describe("Comma-separated list of tag names to exclude"),
  limit: z.number().min(1).max(1000).optional().default(25).describe("Maximum number of results to return"),
  offset: z.number().min(0).optional().default(0).describe("Number of results to skip for pagination"),
  order_by: z.enum([
    "search_rank", "series_id", "title", "units", "frequency", 
    "seasonal_adjustment", "realtime_start", "realtime_end", 
    "last_updated", "observation_start", "observation_end", "popularity"
  ]).optional().describe("Field to order results by"),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order for results"),
  filter_variable: z.enum(["frequency", "units", "seasonal_adjustment"]).optional().describe("Variable to filter by"),
  filter_value: z.string().optional().describe("Value to filter the variable by")
};

/**
 * Schema for FRED series data tool
 */
const SERIES_DATA_SCHEMA = {
  series_id: z.string().describe("The FRED series ID to retrieve data for (e.g., 'GDP', 'UNRATE', 'CPIAUCSL')"),
  observation_start: z.string().optional().describe("Start date for observations in YYYY-MM-DD format"),
  observation_end: z.string().optional().describe("End date for observations in YYYY-MM-DD format"),
  limit: z.number().min(1).max(100000).optional().describe("Maximum number of observations to return"),
  offset: z.number().min(0).optional().describe("Number of observations to skip"),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order of observations by date"),
  units: z.enum([
    "lin", "chg", "ch1", "pch", "pc1", "pca", "cch", "cca", "log"
  ]).optional().describe("Data transformation: lin=levels, chg=change, pch=percent change, log=natural log"),
  frequency: z.enum([
    "d", "w", "bw", "m", "q", "sa", "a", 
    "wef", "weth", "wew", "wetu", "wem", "wesu", "wesa", "bwew", "bwem"
  ]).optional().describe("Frequency aggregation: d=daily, w=weekly, m=monthly, q=quarterly, a=annual"),
  aggregation_method: z.enum(["avg", "sum", "eop"]).optional().describe("Aggregation method: avg=average, sum=sum, eop=end of period"),
  output_type: z.number().min(1).max(4).optional().describe("Output format: 1=observations, 2=observations by vintage, 3=observations by release, 4=initial release only"),
  vintage_dates: z.string().optional().describe("Vintage date or dates in YYYY-MM-DD format")
};

/**
 * Schema for FRED browse tool
 */
const BROWSE_SCHEMA = {
  browse_type: z.enum(["categories", "releases", "sources", "category_series", "release_series"]).describe("Type of browsing to perform"),
  category_id: z.number().optional().describe("Category ID (for categories or category_series)"),
  release_id: z.number().optional().describe("Release ID (for release_series)"),
  limit: z.number().min(1).max(1000).optional().default(50).describe("Maximum number of results"),
  offset: z.number().min(0).optional().default(0).describe("Number of results to skip"),
  order_by: z.string().optional().describe("Field to order by"),
  sort_order: z.enum(["asc", "desc"]).optional().describe("Sort order")
};

const PASSTHROUGH_PARAMS_SCHEMA = z
  .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
  .optional()
  .describe("Additional query parameters to pass through to the underlying FRED endpoint");

/**
 * Registers the simplified FRED tools with the MCP server
 */
export function registerFREDTools(server: McpServer) {
  // Register browse tool for comprehensive navigation
  server.tool(
    "fred_browse",
    "Browse FRED's complete catalog through categories, releases, or sources. Use browse_type='categories' to explore the category tree, 'releases' for data releases, 'sources' for data sources, 'category_series' to get all series in a category, or 'release_series' to get all series in a release.",
    BROWSE_SCHEMA,
    async (input: any) => {
      console.error(`fred_browse called with params: ${JSON.stringify(input)}`);
      
      switch (input.browse_type) {
        case "categories":
          return await browseCategories(input.category_id);
        case "category_series":
          if (!input.category_id) {
            throw new Error("category_id is required for category_series");
          }
          return await getCategorySeries(input.category_id, {
            limit: input.limit,
            offset: input.offset,
            order_by: input.order_by,
            sort_order: input.sort_order
          });
        case "releases":
          return await browseReleases({
            limit: input.limit,
            offset: input.offset,
            order_by: input.order_by,
            sort_order: input.sort_order
          });
        case "release_series":
          if (!input.release_id) {
            throw new Error("release_id is required for release_series");
          }
          return await getReleaseSeries(input.release_id, {
            limit: input.limit,
            offset: input.offset,
            order_by: input.order_by,
            sort_order: input.sort_order
          });
        case "sources":
          return await browseSources({
            limit: input.limit,
            offset: input.offset,
            order_by: input.order_by,
            sort_order: input.sort_order
          });
        default:
          throw new Error(`Invalid browse_type: ${input.browse_type}`);
      }
    }
  );
  
  // Register search tool
  server.tool(
    "fred_search",
    "Search for FRED economic data series by keywords, tags, or filters. Returns matching series with their IDs, titles, and metadata. Use this to find specific series when you know what you're looking for.",
    SEARCH_SCHEMA,
    async (input) => {
      console.error(`fred_search called with params: ${JSON.stringify(input)}`);
      const result = await searchSeries(input as FREDSearchOptions);
      console.error("fred_search complete");
      return result;
    }
  );
  
  // Register series data tool
  server.tool(
    "fred_get_series",
    "Retrieve data for any FRED series by its ID. Supports data transformations, frequency changes, and date ranges.",
    SERIES_DATA_SCHEMA,
    async (input) => {
      console.error(`fred_get_series called with params: ${JSON.stringify(input)}`);
      const result = await getSeriesData(input as FREDSeriesOptions);
      console.error("fred_get_series complete");
      return result;
    }
  );

  // ----------------------------
  // Full FRED API v1 coverage
  // ----------------------------

  // Categories
  server.tool(
    "fred_category_get",
    "fred/category - Get a category. If category_id is omitted, returns the root category.",
    {
      category_id: z.number().optional(),
      params: PASSTHROUGH_PARAMS_SCHEMA,
    },
    async (input: any) => fredCategoryGet(input.category_id, input.params)
  );

  server.tool(
    "fred_category_children",
    "fred/category/children - Get the child categories for a specified parent category.",
    {
      category_id: z.number(),
      params: PASSTHROUGH_PARAMS_SCHEMA,
    },
    async (input: any) => fredCategoryChildren(input.category_id, input.params)
  );

  server.tool(
    "fred_category_related",
    "fred/category/related - Get the related categories for a category.",
    {
      category_id: z.number(),
      params: PASSTHROUGH_PARAMS_SCHEMA,
    },
    async (input: any) => fredCategoryRelated(input.category_id, input.params)
  );

  server.tool(
    "fred_category_series",
    "fred/category/series - Get the series in a category.",
    {
      category_id: z.number(),
      params: PASSTHROUGH_PARAMS_SCHEMA,
    },
    async (input: any) => fredCategorySeries(input.category_id, input.params)
  );

  server.tool(
    "fred_category_tags",
    "fred/category/tags - Get the tags for a category.",
    {
      category_id: z.number(),
      params: PASSTHROUGH_PARAMS_SCHEMA,
    },
    async (input: any) => fredCategoryTags(input.category_id, input.params)
  );

  server.tool(
    "fred_category_related_tags",
    "fred/category/related_tags - Get the related tags for a category.",
    {
      category_id: z.number(),
      params: PASSTHROUGH_PARAMS_SCHEMA,
    },
    async (input: any) => fredCategoryRelatedTags(input.category_id, input.params)
  );

  // Releases
  server.tool(
    "fred_releases",
    "fred/releases - Get all releases of economic data.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredReleases(input.params)
  );

  server.tool(
    "fred_releases_dates",
    "fred/releases/dates - Get release dates for all releases of economic data.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredReleasesDates(input.params)
  );

  server.tool(
    "fred_release",
    "fred/release - Get a release of economic data.",
    { release_id: z.number(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredRelease(input.release_id, input.params)
  );

  server.tool(
    "fred_release_dates",
    "fred/release/dates - Get release dates for a release of economic data.",
    { release_id: z.number(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredReleaseDates(input.release_id, input.params)
  );

  server.tool(
    "fred_release_series",
    "fred/release/series - Get the series on a release of economic data.",
    { release_id: z.number(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredReleaseSeries(input.release_id, input.params)
  );

  server.tool(
    "fred_release_sources",
    "fred/release/sources - Get the sources for a release of economic data.",
    { release_id: z.number(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredReleaseSources(input.release_id, input.params)
  );

  server.tool(
    "fred_release_tags",
    "fred/release/tags - Get the tags for a release.",
    { release_id: z.number(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredReleaseTags(input.release_id, input.params)
  );

  server.tool(
    "fred_release_related_tags",
    "fred/release/related_tags - Get the related tags for a release.",
    { release_id: z.number(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredReleaseRelatedTags(input.release_id, input.params)
  );

  server.tool(
    "fred_release_tables",
    "fred/release/tables - Get the release tables for a given release.",
    { release_id: z.number(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredReleaseTables(input.release_id, input.params)
  );

  // Series
  server.tool(
    "fred_series",
    "fred/series - Get an economic data series (metadata).",
    { series_id: z.string(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSeries(input.series_id, input.params)
  );

  server.tool(
    "fred_series_categories",
    "fred/series/categories - Get the categories for an economic data series.",
    { series_id: z.string(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSeriesCategories(input.series_id, input.params)
  );

  server.tool(
    "fred_series_observations",
    "fred/series/observations - Get the observations (data values) for an economic data series.",
    { series_id: z.string(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSeriesObservations(input.series_id, input.params)
  );

  server.tool(
    "fred_series_release",
    "fred/series/release - Get the release for an economic data series.",
    { series_id: z.string(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSeriesRelease(input.series_id, input.params)
  );

  server.tool(
    "fred_series_search",
    "fred/series/search - Get economic data series that match keywords.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSeriesSearch(input.params)
  );

  server.tool(
    "fred_series_search_tags",
    "fred/series/search/tags - Get the tags for a series search.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSeriesSearchTags(input.params)
  );

  server.tool(
    "fred_series_search_related_tags",
    "fred/series/search/related_tags - Get the related tags for a series search.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSeriesSearchRelatedTags(input.params)
  );

  server.tool(
    "fred_series_tags",
    "fred/series/tags - Get the tags for an economic data series.",
    { series_id: z.string(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSeriesTags(input.series_id, input.params)
  );

  server.tool(
    "fred_series_updates",
    "fred/series/updates - Get economic data series sorted by when observations were updated on the FRED server.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSeriesUpdates(input.params)
  );

  server.tool(
    "fred_series_vintagedates",
    "fred/series/vintagedates - Get the dates in history when a series' data values were revised or new data values were released.",
    { series_id: z.string(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSeriesVintageDates(input.series_id, input.params)
  );

  // Sources
  server.tool(
    "fred_sources",
    "fred/sources - Get all sources of economic data.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSources(input.params)
  );

  server.tool(
    "fred_source",
    "fred/source - Get a source of economic data.",
    { source_id: z.number(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSource(input.source_id, input.params)
  );

  server.tool(
    "fred_source_releases",
    "fred/source/releases - Get the releases for a source.",
    { source_id: z.number(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredSourceReleases(input.source_id, input.params)
  );

  // Tags
  server.tool(
    "fred_tags",
    "fred/tags - Get all tags, search for tags, or get tags by name.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredTags(input.params)
  );

  server.tool(
    "fred_related_tags",
    "fred/related_tags - Get the related tags for one or more tags.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredRelatedTags(input.params)
  );

  server.tool(
    "fred_tags_series",
    "fred/tags/series - Get the series matching tags.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredTagsSeries(input.params)
  );

  // GeoFRED (Maps API)
  server.tool(
    "geofred_shapes",
    "GeoFRED shapes - Fetch GeoJSON shape files for regions.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => geoFredShapes(input.params)
  );

  server.tool(
    "geofred_series_group",
    "GeoFRED series group - Get metadata for a series group by series_id.",
    { series_id: z.string(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => geoFredSeriesGroup(input.series_id, input.params)
  );

  server.tool(
    "geofred_regional_data",
    "GeoFRED regional data - Get cross-sectional regional data for a series group and region type.",
    { params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => geoFredRegionalData(input.params)
  );

  // FRED API v2
  server.tool(
    "fred_v2_release_observations",
    "FRED API v2 - fred/v2/release/observations: Get the observations for all series on a release of economic data.",
    { release_id: z.number(), params: PASSTHROUGH_PARAMS_SCHEMA },
    async (input: any) => fredV2ReleaseObservations(input.release_id, input.params)
  );
}