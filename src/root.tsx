import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useSearchParams,
} from "@remix-run/react";
import { ShoppingCart } from "./routes/shoppingCart/ShoppingCart";

export default function App() {
  const navigate = useNavigate();
  const [shoppingCartParam] = useSearchParams();

  const openShoppingCartParam = new URLSearchParams(shoppingCartParam);
  openShoppingCartParam.set("shoppingCart", "true");

  const closeShoppingCart = () => {
    const closeShoppingCartParam = new URLSearchParams(shoppingCartParam);
    closeShoppingCartParam.delete("shoppingCart");

    navigate({ search: closeShoppingCartParam.toString() });
  };

  const shoppingCartIsOpen = shoppingCartParam.get("shoppingCart") === "true";

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          Shop
          <nav>
            <Link to={{ search: openShoppingCartParam.toString() }}>
              Shopping Cart
            </Link>
          </nav>
        </header>
        <main>
          <Outlet />
          <ShoppingCart
            open={shoppingCartIsOpen}
            onClose={closeShoppingCart}
          />
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
