import { HeroSection } from "./sections/02-hero/hero-section";
import { AboutSection } from "./sections/03-about/about-section";
import { FounderSection } from "./sections/04-founder/founder-section";
import { LearningPreviewSection } from "./sections/05-learning-preview/learning-preview-section";
import { CoursesSection } from "./sections/06-courses/courses-section";
import { PackagesSection } from "./sections/07-packages/packages-section";
import { MiniCoursesSection } from "./sections/08-mini-courses/mini-courses-section";
import { StartUsaSection } from "./sections/09-start-usa/start-usa-section";
import { ReviewsSection } from "./sections/10-reviews/reviews-section";
import { FaqSection } from "./sections/12-faq/faq-section";
import { ContactSection } from "./sections/11-contact/contact-section";
import { LearningOffersShowcase } from "./learning-offers/learning-offers-showcase";
import { HomeSectionSeam } from "./composition/home-section-seam";
import { AcademyStory } from "./composition/academy-story";
import { HomeEntranceMotion } from "./composition/home-entrance-motion";
import styles from "./home-page.module.css";

export function HomePage() {
  return (
    <HomeEntranceMotion className={styles.main}>
      <HeroSection />
      <HomeSectionSeam variant="hero" />
      <AcademyStory about={<AboutSection />} seam={<HomeSectionSeam variant="portraits" />} founder={<FounderSection />} />
      <HomeSectionSeam variant="learning" />
      <LearningPreviewSection />
      <LearningOffersShowcase panels={[
        <CoursesSection key="courses" />,
        <PackagesSection key="packages" />,
        <MiniCoursesSection key="mini-courses" />,
        <StartUsaSection key="start-usa" />,
      ]} />
      <ReviewsSection />
      <FaqSection />
      <HomeSectionSeam variant="contact" />
      <ContactSection />
    </HomeEntranceMotion>
  );
}
