import { z } from 'zod';

export const addToCartBody = z.object({
  item_id: z.string(),
  quantity: z.number(),
});

export const checkoutCart = z.object({
  cart_id: z.string(),
  discount_code: z.string().optional(),
});
