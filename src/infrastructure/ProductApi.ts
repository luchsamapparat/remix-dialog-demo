import { faker } from '@faker-js/faker';

const { commerce, helpers, string } = faker;

export type ProductDto = {
  id: string;
  name: string;
  price: number;
}

export const products = helpers.multiple(
  () => ({
    id: string.uuid(),
    name: commerce.productName(),
    price: parseFloat(commerce.price())
  })
);

export const loadProducts = async () => products;

export const loadProduct = async (id: ProductDto['id']) => {
  const product = products.find(product => product.id === id);

  if (product === undefined) {
    throw new Error(`No product found for ID ${id}`);
  }

  return product;
};