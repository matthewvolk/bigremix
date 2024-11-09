import { defer, type MetaFunction } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { client, graphql } from "~/lib/client";
import { Suspense } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "BigRemix" }];
};

export async function loader() {
  const storeName = await getStoreName();
  const categories = getCategories();

  return defer({ storeName, categories });
}

export default function Index() {
  const { storeName, categories } = useLoaderData<typeof loader>();

  return (
    <main className="font-mono">
      <h1>{storeName}</h1>
      <Suspense fallback={"Loading..."}>
        <Await resolve={categories}>
          {(categories) => (
            <ul>
              {categories.map((category) => (
                <li key={category.path}>{category.name}</li>
              ))}
            </ul>
          )}
        </Await>
      </Suspense>
    </main>
  );
}

async function getStoreName() {
  const SettingsQuery = graphql(`
    query SettingsQuery {
      site {
        settings {
          storeName
        }
      }
    }
  `);

  const data = await client.query(SettingsQuery, {});

  return data.data?.site?.settings?.storeName ?? "Placeholder";
}

async function getCategories() {
  const CategoriesQuery = graphql(`
    query CategoriesQuery {
      site {
        categoryTree {
          name
          path
        }
      }
    }
  `);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = await client.query(CategoriesQuery, {});

  return data.data?.site?.categoryTree ?? [];
}
