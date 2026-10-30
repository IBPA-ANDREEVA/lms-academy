import type { Metadata } from "next";
import { CartPage } from "@/features/commerce";
export const metadata: Metadata = { title: "Корзина", robots: { index: false, follow: false } };
export default CartPage;
