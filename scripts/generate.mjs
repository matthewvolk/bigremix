// @ts-check
import "dotenv/config";

import { strict } from "node:assert";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

import { generateSchema, generateOutput } from "@gql.tada/cli-utils";

const ROOT_DIR = join(fileURLToPath(import.meta.url), "..", "..");

const BIGCOMMERCE_STORE_HASH = process.env.BIGCOMMERCE_STORE_HASH;
const BIGCOMMERCE_CHANNEL_ID = process.env.BIGCOMMERCE_CHANNEL_ID;
const BIGCOMMERCE_STOREFRONT_TOKEN = process.env.BIGCOMMERCE_STOREFRONT_TOKEN;

strict(BIGCOMMERCE_STORE_HASH, "BIGCOMMERCE_STORE_HASH is required");
strict(
  BIGCOMMERCE_STOREFRONT_TOKEN,
  "BIGCOMMERCE_STOREFRONT_TOKEN is required",
);

const endpoint = `https://store-${BIGCOMMERCE_STORE_HASH}-${BIGCOMMERCE_CHANNEL_ID}.mybigcommerce.com/graphql`;

await generateSchema({
  input: endpoint,
  headers: {
    Authorization: `Bearer ${BIGCOMMERCE_STOREFRONT_TOKEN}`,
  },
  output: join(ROOT_DIR, "bigcommerce.graphql"),
  tsconfig: undefined,
});

await generateOutput({
  output: undefined,
  tsconfig: undefined,
});
