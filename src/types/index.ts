export interface Product {
  name: string;
  price: number;
  id: number;
  features: string[];
}

export interface Discount {
  code: string;
  isUsed: boolean;
  value: number;
}

export interface Order {
  orderId: string;
  items: Product[];
  totalAmount: number;
  discountApplied?: boolean;
  discountCode?: string;
  discountAmount?: number;
}

export interface Cart {
  products: Product[];
  quantity: number;
  cart_id: string;
  cart_price: number;
}
