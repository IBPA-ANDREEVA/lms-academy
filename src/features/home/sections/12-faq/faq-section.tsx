import { PageContainer } from "@/features/public-shell";
import { faqItems } from "./faq-data";
import { FaqItem } from "./faq-item";
import styles from "./faq-section.module.css";
export function FaqSection() {
  return <section id="faq" className={styles.section} aria-labelledby="faq-title">
    <PageContainer reveal="compact" className={styles.layout}>
      <div className={styles.intro}><p className={styles.kicker}>FAQ / ОБ ОБУЧЕНИИ</p><h2 id="faq-title">Частые<br /><span>вопросы.</span></h2><p className={styles.description}>О формате обучения, поддержке куратора и сертификатах. Ответы на вопросы до выбора курса.</p></div>
      <div className={styles.questions}>{faqItems.map((item, index) => <FaqItem key={item.id} {...item} initiallyOpen={index === 0} />)}</div>
    </PageContainer>
  </section>;
}
