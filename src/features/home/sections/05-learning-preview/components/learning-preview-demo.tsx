"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import styles from "../learning-preview-section.module.css";

gsap.registerPlugin(useGSAP);

type Stage = "lesson" | "assignment" | "feedback";
type DemoPhoto = { id: string; name: string; url: string };
const stages: { id: Stage; label: string }[] = [
  { id: "lesson", label: "Смотреть урок" },
  { id: "assignment", label: "Сдать домашнее задание" },
  { id: "feedback", label: "Ответ куратора" },
];

export function LearningPreviewDemo() {
  const [stage, setStage] = useState<Stage>("lesson");
  const [photos, setPhotos] = useState<DemoPhoto[]>([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const demoRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<DemoPhoto[]>([]);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const previousHeight = useRef<number | null>(null);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)), []);

  useGSAP(() => {
    const panel = demoRef.current?.querySelector<HTMLElement>('[role="tabpanel"]');
    const body = demoRef.current?.querySelector<HTMLElement>(`.${styles.demoBody}`);
    const curtain = demoRef.current?.querySelector<HTMLElement>(`.${styles.stageCurtain}`);
    if (!panel || !body || !curtain) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      if (previousHeight.current === null) return;
      const targetHeight = body.getBoundingClientRect().height;
      const children = gsap.utils.toArray<HTMLElement>(panel.children);
      body.dataset.learningTransition = "true";
      const timeline = gsap.timeline({ defaults: { ease: "power3.inOut" }, onComplete: () => { delete body.dataset.learningTransition; } });
      timeline.fromTo(body, { height: previousHeight.current }, { height: targetHeight, duration: .52, clearProps: "height" }, 0)
        .fromTo(curtain, { x: 0, xPercent: -105 }, { xPercent: 0, duration: .2 }, 0)
        .to(curtain, { xPercent: 105, duration: .32, clearProps: "transform" }, .2)
        .fromTo(children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .42, stagger: .045, ease: "power3.out", clearProps: "opacity,transform" }, .22);
      const mediaPanel = panel.querySelector(`.${styles.mediaPlaceholder}`);
      if (mediaPanel) timeline.fromTo(mediaPanel, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .5, clearProps: "clipPath" }, .2);
      const settle = () => { timeline.progress(1); };
      window.addEventListener("resize", settle);
      panel.addEventListener("focusin", settle);
      return () => { window.removeEventListener("resize", settle); panel.removeEventListener("focusin", settle); delete body.dataset.learningTransition; };
    });
    return () => media.revert();
  }, { scope: demoRef, dependencies: [stage], revertOnUpdate: true });

  function changeStage(next: Stage) {
    if (next === stage) return;
    previousHeight.current = demoRef.current?.querySelector(`.${styles.demoBody}`)?.getBoundingClientRect().height ?? null;
    const panel = demoRef.current?.querySelector('[role="tabpanel"]');
    if (panel?.contains(document.activeElement)) tabsRef.current[stages.findIndex((item) => item.id === next)]?.focus({ preventScroll: true });
    const tabs = demoRef.current?.querySelector<HTMLElement>('[role="tablist"]');
    const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 80;
    if (tabs && tabs.getBoundingClientRect().top < headerBottom) tabs.scrollIntoView({ block: "start", behavior: "instant" });
    setStage(next);
  }

  function addPhotos(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length !== files.length) setError("Можно добавить только изображения.");
    else setError("");
    const newPhotos = images.map((file) => ({ id: crypto.randomUUID(), name: file.name, url: URL.createObjectURL(file) }));
    setPhotos((current) => [...current, ...newPhotos]);
    event.target.value = "";
  }

  function removePhoto(id: string) {
    const photo = photos.find((item) => item.id === id);
    if (photo) URL.revokeObjectURL(photo.url);
    setPhotos((current) => current.filter((item) => item.id !== id));
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextIndex = event.key === "ArrowRight" ? (index + 1) % stages.length : event.key === "ArrowLeft" ? (index + stages.length - 1) % stages.length : event.key === "Home" ? 0 : event.key === "End" ? stages.length - 1 : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    changeStage(stages[nextIndex].id);
    tabsRef.current[nextIndex]?.focus();
  }

  return (
    <div className={styles.demo} ref={demoRef}>
      <div className={styles.demoHeader}>
        <strong>LMS ACADEMY <span>/ Учебная среда</span></strong>

      </div>
      <noscript><p className={styles.helper}>Сначала изучите урок и материалы, затем выполните практическое задание. На основном курсе куратор проверяет работу и даёт обратную связь. Интерактивный пример доступен с JavaScript.</p><style>{`#learning-preview [role="tablist"], #learning-preview button{display:none!important}`}</style></noscript>
      <div className={styles.tabs} role="tablist" aria-label="Этапы обучения">
        {stages.map((item, index) => (
          <button key={item.id} ref={(node) => { tabsRef.current[index] = node; }} type="button" role="tab" id={`learning-tab-${item.id}`} aria-controls={`learning-panel-${item.id}`} aria-selected={stage === item.id} tabIndex={stage === item.id ? 0 : -1} onClick={() => changeStage(item.id)} onKeyDown={(event) => onTabKeyDown(event, index)}>
            <small>0{index + 1}</small><span className={styles.longLabel}>{item.label}</span><span className={styles.shortLabel}>{["Урок", "Задание", "Ответ"][index]}</span>
          </button>
        ))}
      </div>
      <div className={styles.demoBody} data-stage={stage}>
        <div className={styles.stageCurtain} aria-hidden="true" />
        {stage === "lesson" && <div className={styles.stageContent} role="tabpanel" id="learning-panel-lesson" aria-labelledby="learning-tab-lesson" tabIndex={0}>
        <div className={styles.lessonCard}>
          <div className={styles.mediaPlaceholder} role="img" aria-label="Место для демонстрационного видеоурока">
            <span>ВИДЕОУРОК</span>

          </div>
          <div className={styles.lessonText}>
            <p className={styles.eyebrow}>ПРИМЕР УРОКА</p>
            <h3>Урок и практика</h3>
            <p>В настоящем курсе здесь будут урок и материалы для подготовки к заданию.</p>
          </div>
        </div>
          <p className={styles.status}>ШАГ 01 / ПРОСМОТР УРОКА</p>
          <h3>Сначала изучите материал</h3>

          <Button appearance="cut" onClick={() => changeStage("assignment")}>К ЗАДАНИЮ <span aria-hidden="true">→</span></Button>
        </div>}
        {stage === "assignment" && <div className={styles.stageContent} role="tabpanel" id="learning-panel-assignment" aria-labelledby="learning-tab-assignment" tabIndex={0}>
          <p className={styles.status}>{submitted ? "РАБОТА ГОТОВА К ПРОВЕРКЕ" : "ШАГ 02 / МОЯ РАБОТА"}</p>
          <h3>Практическое задание</h3>
          <p>Добавьте фотографии и комментарий к работе.</p>
          <label className={styles.upload}>
            <span className={styles.plus} aria-hidden="true">+</span>
            <span><strong>Добавить фотографии</strong><small>Предпросмотр фотографий</small></span>
            <input type="file" accept="image/*" multiple onChange={addPhotos} disabled={submitted} />
          </label>
          {error && <p className={styles.error} role="alert">{error}</p>}
          {photos.length > 0 && <ul className={styles.photoList} aria-label="Добавленные фотографии">
            {photos.map((photo) => <li key={photo.id}>
              {/* Blob URLs are local previews; Next image optimization cannot access them. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={`Предпросмотр: ${photo.name}`} />
              <span title={photo.name}>{photo.name}</span>
              {!submitted && <button type="button" onClick={() => removePhoto(photo.id)} aria-label={`Удалить ${photo.name}`}>×</button>}
            </li>)}
          </ul>}
          <label className={styles.commentLabel} htmlFor="learning-comment">КОММЕНТАРИЙ К РАБОТЕ</label>
          <textarea style={{ resize: "none" }} id="learning-comment" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Расскажите, что получилось и что вызвало сложности." rows={3} disabled={submitted} />
          {submitted ? <Button appearance="cut" intent="secondary" onClick={() => changeStage("feedback")}>ПОСМОТРЕТЬ ОТВЕТ <span aria-hidden="true">→</span></Button> : <Button appearance="cut" onClick={() => { setSubmitted(true); changeStage("feedback"); }} disabled={!photos.length && !comment.trim()}>К ОБРАТНОЙ СВЯЗИ <span aria-hidden="true">↗</span></Button>}
          {!submitted && <small className={styles.helper}>Добавьте фото или комментарий, чтобы продолжить.</small>}
        </div>}
        {stage === "feedback" && <div className={styles.stageContent} role="tabpanel" id="learning-panel-feedback" aria-labelledby="learning-tab-feedback" tabIndex={0}>
          <p className={styles.status}>ШАГ 03 / ОТВЕТ КУРАТОРА</p>
          <h3>{submitted ? "Работа на доработке" : "Как выглядит обратная связь"}</h3>
          <p>«Хорошее начало. Обратите внимание на симметрию и повторите упражнение, затем отправьте обновлённое фото».</p>
          <div className={styles.feedbackStatus}><strong>Нужна доработка</strong><span>После обратной связи работу можно изменить и отправить снова.</span></div>
          <Button appearance="cut" onClick={() => { setSubmitted(false); changeStage("assignment"); }}>ДОРАБОТАТЬ ЗАДАНИЕ <span aria-hidden="true">→</span></Button>
        </div>}
      </div>

    </div>
  );
}
