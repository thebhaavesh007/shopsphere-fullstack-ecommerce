export type User = { _id?: string; id?: string; name: string; email: string; role: 'customer'|'admin'; phone?: string; addresses?: any[] };
export type Category = { _id: string; name: string; slug: string; image?: string; description?: string };
export type Product = { _id: string; name: string; description: string; price: number; discountPrice?: number; category: Category; brand?: string; images: string[]; stock: number; ratings: number; reviewsCount: number; isFeatured?: boolean };
export type CartItem = { productId: Product; quantity: number; price: number };
export type Order = { _id: string; items: any[]; paymentMethod: string; paymentStatus: string; orderStatus: string; totalAmount: number; createdAt: string };
