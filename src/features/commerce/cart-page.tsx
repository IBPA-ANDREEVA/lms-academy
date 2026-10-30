import Link from "next/link";
import { PageContainer } from "@/features/public-shell";
import { CartSection } from "./sections/cart-section";
import styles from "./commerce.module.css";

export function CartPage() {
  return <main id="main-content" className={styles.page}><PageContainer size="content">
    <div className={styles.cartColumn}>
      <Link className={styles.back} href="/courses">← Продолжить выбор курсов</Link>
      <h1 className={styles.title}>Корзина</h1>
      <CartSection />
    </div>
  </PageContainer></main>;
}
