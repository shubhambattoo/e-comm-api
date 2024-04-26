import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { readFileContents, writeFileContents } from '~/services/fs';
import { Cart, Discount, Order, Product } from '~/types';

export const addOrder = async (req: Request, res: Response) => {
  try {
    const cartFileContent: string = await readFileContents(
      './../fakeDb/cart.json'
    );
    const productsFileContent: string = await readFileContents(
      './../fakeDb/products.json'
    );

    const cart: Cart[] = JSON.parse(cartFileContent);
    const products: Product[] = JSON.parse(productsFileContent);
    const { body: cartBody } = req;

    const product = products.find((p) => p.id === Number(cartBody.item_id));

    if (!product) {
      return res
        .status(400)
        .json({ status: false, message: 'Could not find product' });
    }

    const cart_id = nanoid();

    const finalCart = JSON.stringify([
      ...cart,
      {
        cart_id,
        products: [product],
        quantity: cartBody.quantity,
        cart_price: product.price * cartBody.quantity,
      },
    ]);

    await writeFileContents('./../fakeDb/cart.json', finalCart);

    return res.json({
      success: true,
      cart_id,
      message: 'Item added to cart successfully',
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message ?? 'Something went wrong',
    });
  }
};

export const checkOut = async (req: Request, res: Response) => {
  try {
    const cartFileContent: string = await readFileContents(
      './../fakeDb/cart.json'
    );
    const ordersFileContent: string = await readFileContents(
      './../fakeDb/orders.json'
    );
    const discountFileContent: string = await readFileContents(
      './../fakeDb/discounts.json'
    );
    const nthFileContent: string = await readFileContents(
      './../fakeDb/discountTracker.json'
    );

    const { body: checkoutBody } = req;

    const orders: Order[] = JSON.parse(ordersFileContent);
    const cart: Cart[] = JSON.parse(cartFileContent);
    const discounts: Discount[] = JSON.parse(discountFileContent);
    const nthData: { current_nth: number }[] = JSON.parse(nthFileContent);

    const cartItem = cart.find((c) => c.cart_id === checkoutBody.cart_id);

    if (!cartItem) {
      return res
        .status(400)
        .json({ status: false, message: 'Could not find cart item' });
    }

    const orderId = nanoid();

    const order: Order = {
      orderId,
      items: cartItem.products,
      totalAmount: cartItem.cart_price,
      discountApplied: false,
    };

    if (checkoutBody.discount_code) {
      const discount = discounts.find(
        (d) => d.code === checkoutBody.discount_code
      );

      if (!discount) {
        return res
          .status(400)
          .json({ status: false, message: 'Could not find discount code' });
      }

      if (discount.isUsed) {
        return res
          .status(400)
          .json({ status: false, message: 'Discount code already used' });
      }

      order.discountAmount = order.totalAmount * (discount.value / 100);
      order.totalAmount = order.totalAmount - order.discountAmount;
      order.discountApplied = true;
      order.discountCode = discount.code;

      const writeContents = JSON.stringify(
        discounts.map((d) => ({
          ...d,
          isUsed: d.code === checkoutBody.discount_code,
        }))
      );
      await writeFileContents('./../fakeDb/discounts.json', writeContents);
    }

    const cartContents = JSON.stringify(
      cart.filter((c) => c.cart_id !== checkoutBody.cart_id)
    );
    await writeFileContents('./../fakeDb/cart.json', cartContents);

    const orderContents = JSON.stringify([...orders, order]);
    const nthFileContents = JSON.stringify([
      {
        current_nth: nthData[0].current_nth - 1,
      },
    ]);
    await writeFileContents('./../fakeDb/orders.json', orderContents);
    await writeFileContents(
      './../fakeDb/discountTracker.json',
      nthFileContents
    );

    return res.json({
      success: true,
      message: 'Succesfully placed order',
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message ?? 'Something went wrong',
    });
  }
};

export const getOrderStats = async (req: Request, res: Response) => {
  try {
    const ordersFileContent: string = await readFileContents(
      './../fakeDb/orders.json'
    );
    const discountFileContent: string = await readFileContents(
      './../fakeDb/discounts.json'
    );

    const orders: Order[] = JSON.parse(ordersFileContent);
    const discounts: Discount[] = JSON.parse(discountFileContent);

    const response = {
      total_orders: orders.length,
      discount_codes: discounts,
      total_purchase_amount: 0,
      total_discount_amount: 0,
    };

    response.total_purchase_amount = orders
      .map((o) => o.totalAmount)
      .reduce((a, b) => a + b, 0);

    const val: any[] = orders.map((o) => o.discountAmount).filter(Boolean);

    response.total_discount_amount = val.reduce((a, b) => a + b, 0);

    return res.json({
      success: true,
      stats: response,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message ?? 'Something went wrong',
    });
  }
};
