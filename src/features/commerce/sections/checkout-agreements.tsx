import { Checkbox } from "@/components/ui/form-controls";
import styles from "../commerce.module.css";

// No legal href/version exists yet. Disabled controls cannot capture invented consent.
export function CheckoutAgreements() {
  return <section className={styles.formSection} aria-labelledby="agreements-heading">
    <h2 id="agreements-heading">Согласия перед оплатой</h2>
    <p id="legal-unavailable" className={styles.caption}>Документы ещё не опубликованы. Согласия и оплата станут доступны после публикации утверждённых условий.</p>
    <div className={styles.agreements}>
      <Checkbox disabled required checked={false} aria-describedby="legal-unavailable" label="Публичная оферта — документ недоступен" />
      <Checkbox disabled required checked={false} aria-describedby="legal-unavailable" label="Условия возврата — документ недоступен" />
      <Checkbox disabled required checked={false} aria-describedby="legal-unavailable" label="Дисклеймер о лицензии — документ недоступен" />
    </div>
    <p className={styles.caption}>Политика конфиденциальности — документ недоступен.</p>
  </section>;
}
