import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getProducts } from "src/application/Product";

export const loader = ({ }: LoaderFunctionArgs) => {
  return getProducts();
}

export default function Index() {
  const products = useLoaderData<typeof loader>();

  return (<>
    <h1>Welcome</h1>

    <ul>
      {products.map(product => (
        <li key={product.id}><Link to={`products/${product.id}`}>{product.name}</Link></li>
      ))}
    </ul>
  </>);
}
