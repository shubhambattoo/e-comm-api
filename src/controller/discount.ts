import { Request, Response } from 'express';
import { nanoid } from 'nanoid';
import { DISCOUNT_PERCENTAGE, NTHITEM } from '~/constants';
import { readFileContents, writeFileContents } from '~/services/fs';
import { Discount } from '~/types';

export const generateDiscount = async (req: Request, res: Response) => {
  try {
    const nthFileContent: string = await readFileContents(
      './../fakeDb/discountTracker.json'
    );
    const discountFileContent: string = await readFileContents(
      './../fakeDb/discounts.json'
    );

    const nthData: { current_nth: number }[] = JSON.parse(nthFileContent);
    const discounts: Discount[] = JSON.parse(discountFileContent);

    // check if orders have reached the nth item value
    if (nthData[0].current_nth === 0) {
      // generate discount code
      const discount_code = nanoid(8);
      const discount: Discount = {
        code: discount_code,
        isUsed: false,
        value: DISCOUNT_PERCENTAGE,
      };

      const writeContents = JSON.stringify([...discounts, discount]);
      const nthFileContents = JSON.stringify([{ current_nth: NTHITEM }]);

      await writeFileContents('./../fakeDb/discounts.json', writeContents);
      await writeFileContents(
        './../fakeDb/discountTracker.json',
        nthFileContents
      );

      return res.json({ success: true, discount_code });
    }

    res
      .status(400)
      .json({ success: false, message: 'Nth item hasnt been reached yet' });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message ?? 'Something went wrong',
    });
  }
};
