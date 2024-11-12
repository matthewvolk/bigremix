import { defer, type MetaFunction } from "@remix-run/node";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { client, graphql } from "~/lib/client";
import { Suspense } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "BigRemix" }];
};

async function getFeaturedProducts() {
  const FeaturedProductsQuery = graphql(`
    query FeaturedProductsQuery {
      site {
        featuredProducts {
          edges {
            node {
              entityId
              name
              defaultImage {
                url(width: 400)
                altText
              }
              prices {
                price {
                  value
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  `);

  const data = await client.query(FeaturedProductsQuery, {});

  return data.data?.site?.featuredProducts?.edges ?? [];
}

export async function loader() {
  const featuredProducts = getFeaturedProducts();

  return defer({ featuredProducts });
}

export default function Index() {
  const { featuredProducts } = useLoaderData<typeof loader>();

  return (
    <main className="flex-1 space-y-16">
      <section className="space-y-4">
        <Suspense fallback={<p>Loading...</p>}>
          <Await resolve={featuredProducts}>
            {(featuredProducts) => (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {featuredProducts.map((product) => (
                  <li key={product.node.entityId}>
                    <Link
                      className="group flex flex-col gap-2 cursor-not-allowed"
                      to="#"
                    >
                      {product.node.defaultImage ? (
                        <div className="aspect-square">
                          <img
                            alt={product.node.defaultImage.altText}
                            className="h-full w-full object-cover"
                            src={product.node.defaultImage.url}
                          />
                        </div>
                      ) : null}
                      <div>
                        <h3 className="group-hover:underline">
                          {product.node.name}
                        </h3>
                        <p className="group-hover:underline">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: product.node.prices?.price?.currencyCode,
                          }).format(
                            Number(product.node.prices?.price?.value),
                          ) || "Price not available"}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Await>
        </Suspense>
      </section>
    </main>
  );
}
