import { Button } from "@/components/ui/button";
import styles from "../commerce.module.css";

export function CheckoutPayment() {
  return <>
    <section className={styles.formSection} aria-labelledby="payment-heading">
      <h2 id="payment-heading">Оплата</h2>
      <div className={styles.paymentPlaceholder}>Способ оплаты пока недоступен</div>
      <p id="payment-unavailable" className={styles.caption}>Оплата не подключена. Стоимость не подтверждена, правовые документы не опубликованы. Демонстрационные продукты не создают заказ.</p>
    </section>
    <Button appearance="cut" disabled aria-describedby="payment-unavailable">Оплата недоступна <span aria-hidden="true">→</span></Button>
  </>;
}
