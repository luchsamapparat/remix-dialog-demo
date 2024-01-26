import { ShoppingCartDto, ShoppingCartItemDto } from "../infrastructure/ShoppingCartApi";

export { addToShoppingCart, changeShoppingCartItemQuantity, fetchShoppingCart as getShoppingCart, removeShoppingCartItem } from '../infrastructure/ShoppingCartApi';

export interface ShoppingCartModel extends ShoppingCartDto { }

export interface ShoppingCartItemModel extends ShoppingCartItemDto { }