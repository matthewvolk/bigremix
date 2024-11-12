import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";
import { client, graphql } from "./lib/client";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

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
          entityId
          name
          path
        }
      }
    }
  `);

  const data = await client.query(CategoriesQuery, {});

  return data.data?.site?.categoryTree ?? [];
}

export async function loader() {
  const storeName = await getStoreName();
  const categories = await getCategories();

  return { storeName, categories };
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { storeName, categories } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="container mx-auto flex min-h-screen flex-col gap-16 px-4 py-10">
        <header className="flex items-center justify-between gap-8">
          <Link to="#" className="hover:underline cursor-not-allowed">
            <h1 className="font-bold text-lg">{storeName}</h1>
          </Link>
          <nav className="overflow-scroll">
            <ul className="flex flex-shrink-0 gap-4">
              {categories.map((category) => (
                <li className="flex-shrink-0" key={category.entityId}>
                  <Link
                    to={`/category/${category.path}`}
                    className="hover:underline cursor-not-allowed"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        {children}
        <footer>
          <p className="flex items-center gap-1">
            <span>&copy; {new Date().getFullYear()}</span>
            <span>{storeName}</span>
          </p>
        </footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
