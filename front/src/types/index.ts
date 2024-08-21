export type User = {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Credentials = {
  email: string;
  password: string;
};

export type Cart = {
  [productId: number]: number;
};

export type Product = {
  id: number;
  name: string;
  price: number;
  imageName: string;
  stockId: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductWithDetails = Product & {
  quantity: number;
  lastOrderedAt?: string;
};

export type Order = {
  id: number; // 注文 ID
  userId: number; // ユーザー ID
  createdAt: string; // 注文の作成日時
  updatedAt: string; // 注文の更新日時
  orderDetails: Array<{
    id: number; // 注文詳細 ID
    productId: number; // 商品 ID
    orderId: number; // 注文 ID
    price: number; // 注文時の商品の価格
    quantity: number; // 注文した商品の数量
    createdAt: string; // 注文詳細の作成日時
    updatedAt: string; // 注文詳細の更新日時
    product: Product;
  }>;
};

export type Orders = Array<{
  id: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  orderDetails: Array<{
    id: number;
    productId: number;
    orderId: number;
    price: number;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    product: Product;
  }>;
}>;
