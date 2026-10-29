import { PageContainer } from "@/features/public-shell";
import { ContactForm } from "./components/contact-form";
import styles from "./contact-section.module.css";

export function ContactSection() {
  return (
    <section data-flow-section id="contact" className={styles.section} aria-labelledby="contact-title">
      <PageContainer size="wide" className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.kicker}>НАПИШИТЕ НАМ</p>
          <h2 id="contact-title" className={styles.heading}><span>ОСТАЛИСЬ</span><span>ВОПРОСЫ?</span></h2>
          <p className={styles.description}>Расскажите, что хотите узнать о курсах и формате обучения.</p>
          <div className={styles.notice}><span aria-hidden="true">✉</span><div><strong>СВЯЗЬ С АКАДЕМИЕЙ</strong><p>Форма готовится к подключению. Данные сейчас не отправляются.</p></div></div>
        </div>
        <ContactForm />
      </PageContainer>
    </section>
  );
}
