import "dotenv/config";

import { cacheExchange, Client, fetchExchange } from "@urql/core";
import { strict } from "node:assert";
import { initGraphQLTada } from "gql.tada";

import type { introspection } from "bigcommerce-graphql";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  disableMasking: true;
  scalars: {
    DateTime: string;
  };
}>();

const BIGCOMMERCE_STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH;
const BIGCOMMERCE_CHANNEL_ID = process.env.BIGCOMMERCE_CHANNEL_ID;
const BIGCOMMERCE_STOREFRONT_TOKEN = process.env.BIGCOMMERCE_STOREFRONT_TOKEN;

strict(BIGCOMMERCE_STORE_HASH, "BIGCOMMERCE_STORE_HASH is required");
strict(
  BIGCOMMERCE_STOREFRONT_TOKEN,
  "BIGCOMMERCE_STOREFRONT_TOKEN is required",
);

export const client = new Client({
  url: `https://store-${BIGCOMMERCE_STORE_HASH}-${BIGCOMMERCE_CHANNEL_ID}.mybigcommerce.com/graphql`,
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => ({
    headers: {
      Authorization: `Bearer ${BIGCOMMERCE_STOREFRONT_TOKEN}`,
    },

    // @todo implement better cache strategy
    cache: "no-cache",
  }),

  /**
   * requestPolicy overrides cache property in fetchOptions
   */
  requestPolicy: "cache-and-network",
});
