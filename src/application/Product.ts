import { ProductDto, loadProduct, loadProducts } from "../infrastructure/ProductApi";

export interface ProductModel extends ProductDto { }

export const getProducts = loadProducts;

export const getProduct = loadProduct;