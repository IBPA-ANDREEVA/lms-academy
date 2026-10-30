import Link from "next/link";
import { PageContainer } from "@/features/public-shell";
import { CheckoutSection } from "./sections/checkout-section";
import styles from "./commerce.module.css";

export function CheckoutPage() {
  return <main id="main-content" className={styles.page}><PageContainer size="content"><div className={styles.checkoutColumn}>
    <Link className={styles.back} href="/cart">← В корзину</Link>
    <h1 className={`${styles.title} ${styles.checkoutTitle}`}>Оформление<br />заказа</h1>
    <CheckoutSection />
  </div></PageContainer></main>;
}
