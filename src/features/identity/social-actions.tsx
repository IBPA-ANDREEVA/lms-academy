import styles from "./auth-modal.module.css";

export function SocialActions() {
  return (
    <div className={styles.socialBlock}>
      <div className={styles.divider}><span>или</span></div>
      <div className={styles.socialButtons}>
        <button type="button" disabled aria-label="Продолжить с Google — скоро">
          Google <small>Скоро</small>
        </button>
        <button type="button" disabled aria-label="Продолжить с Apple — скоро">
          Apple <small>Скоро</small>
        </button>
      </div>
    </div>
  );
}
