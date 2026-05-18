import type { Product } from '../Types/Product';

export type CartItem = {
    product: Product;
    quantity: number;
};