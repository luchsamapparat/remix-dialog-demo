import { faker } from '@faker-js/faker';
import { remove } from 'lodash-es';
import { ProductDto, products } from './ProductApi';

const { string } = faker;

export type ShoppingCartDto = {
  totalPrice: number;
  items: ShoppingCartItemDto[];
}

export type ShoppingCartItemDto = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

class ShoppingCart implements ShoppingCartDto {
  get totalPrice() {
    return this.#items.reduce(
      (price, item) => price + item.price,
      0
    )
  }

  get items() {
    return this.#items;
  }

  #items: ShoppingCartItemDto[] = [];

  add(productId: ProductDto['id'], quantity: ShoppingCartItemDto['quantity']) {
    const existingItem = this.#items.find(item => item.productId === productId);

    if (existingItem === undefined) {
      const product = products.find(({ id }) => id === productId);

      if (product === undefined) {
        throw new Error(`Unknown product ID ${productId}`);
      }

      this.#items.push({
        id: string.uuid(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity
      })
    } else {
      existingItem.quantity = existingItem.quantity + quantity;
    }
  }

  changeQuantity(itemId: ShoppingCartItemDto['id'], quantity: ShoppingCartItemDto['quantity']) {
    const existingItem = this.#items.find(({ id }) => id === itemId);

    if (existingItem === undefined) {
      throw new Error(`Unknown shopping cart item ID ${itemId}`);
    }

    existingItem.quantity = quantity;



    remove(itemId: ShoppingCartItemDto['id']) {
      remove(this.#items, ({ id }) => id === itemId);
    }
  }

  const shoppingCart = new ShoppingCart();

  export const fetchShoppingCart = async () => ({
    items: shoppingCart.items,
    totalPrice: shoppingCart.totalPrice
  } satisfies ShoppingCartDto);

  export const addToShoppingCart = async (productId: ProductDto['id'], quantity: ShoppingCartItemDto['quantity']) => {
    shoppingCart.add(productId, quantity);
  };

  export const changeShoppingCartItemQuantity = async (itemId: ShoppingCartItemDto['id'], quantity: ShoppingCartItemDto['quantity']) => {
    shoppingCart.changeQuantity(itemId, quantity);
  };

  export const removeShoppingCartItem = async (itemId: ShoppingCartItemDto['id']) => {
    shoppingCart.remove(itemId);
  };