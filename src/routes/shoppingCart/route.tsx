
import { getShoppingCart } from "../../application/ShoppingCart";

export function loader() {
  return getShoppingCart();
}
