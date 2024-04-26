import express from 'express';
import { validateRequest } from 'zod-express-middleware';
import { generateDiscount } from '~/controller/discount';
import { addOrder, checkOut, getOrderStats } from '~/controller/shoppingCart';
import { addToCartBody, checkoutCart } from '~/validators/cart';

const router = express.Router();

router.route('/discount/generate').post(generateDiscount);
router
  .route('/cart/add')
  .post(validateRequest({ body: addToCartBody }), addOrder);

router
  .route('/cart/checkout')
  .post(validateRequest({ body: checkoutCart }), checkOut);

router.route('/admin/stats').get(getOrderStats);

export default router;
