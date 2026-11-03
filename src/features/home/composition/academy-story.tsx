import type { ReactNode } from "react";
import styles from "./academy-story.module.css";

/** The portrait join belongs to document flow. Moving either entire surface
 * detaches its shared geometry; the sections animate only authored content. */
export function AcademyStory({ about, founder, seam }: { about: ReactNode; founder: ReactNode; seam: ReactNode }) {
  return <div className={styles.story}>
    {about}
    {seam}
    {founder}
  </div>;
}
