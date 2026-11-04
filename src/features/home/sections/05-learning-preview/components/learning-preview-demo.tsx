"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { publicMotion as motion } from "@/features/public-shell/motion-tokens";
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
  const previousStage = useRef<Stage | null>(null);
  const direction = useRef(1);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)), []);

  useGSAP(() => {
    const panel = demoRef.current?.querySelector<HTMLElement>(`#learning-panel-${stage}`);
    const body = demoRef.current?.querySelector<HTMLElement>(`.${styles.demoBody}`);
    const pickers = demoRef.current?.querySelector<HTMLElement>('[role="tablist"]');
    const curtain = demoRef.current?.querySelector<HTMLElement>(`.${styles.stageCurtain}`);
    const outgoing = previousStage.current ? demoRef.current?.querySelector<HTMLElement>(`#learning-panel-${previousStage.current}`) : null;
    if (!panel || !body || !curtain || !pickers || !outgoing || previousHeight.current === null) return;
    const fromHeight = previousHeight.current;
    const media = gsap.matchMedia();
    let settled = false;
    media.add({ reduce: "(prefers-reduced-motion: reduce)", animate: "(prefers-reduced-motion: no-preference)" }, (context) => {
      if (context.conditions?.reduce || settled) { settled = true; return; }
      const targetHeight = body.getBoundingClientRect().height;
      const sign = direction.current;
      const push = matchMedia("(max-width: 760px)").matches ? 12 : motion.wipePush;
      body.dataset.learningTransition = "true";
      body.dataset.learningDirection = sign > 0 ? "right" : "left";
      const settle = () => {
        settled = true;
        delete body.dataset.learningTransition;
        for (const target of [body, panel, outgoing, curtain, pickers]) {
          for (const property of ["height", "width", "transform", "visibility", "display", "position", "inset"]) target.style.removeProperty(property);
        }
      };
      // Keep the outgoing real panel visible until the wipe covers it. Hidden
      // panels remain inert; local photos, comments and form state survive.
      const padding = getComputedStyle(body).padding;
      gsap.set(outgoing, { display: "block", position: "absolute", inset: padding, width: "auto", x: 0 });
      gsap.set(panel, { visibility: "hidden" });
      const timeline = gsap.timeline({ onComplete: settle })
        .fromTo(body, { height: fromHeight }, { height: targetHeight, duration: motion.wipeCover + motion.wipeReveal, ease: motion.transitionEase }, 0)
        .fromTo(curtain, { xPercent: -sign * 100, x: 0 }, { xPercent: 0, duration: motion.wipeCover, ease: motion.transitionEase }, 0)
        .to(outgoing, { x: sign * push, duration: motion.wipeCover, ease: motion.transitionEase }, 0)
        .to(pickers, { x: sign * push, duration: motion.wipeCover, ease: motion.transitionEase }, 0)
        .fromTo(pickers, { x: -sign * push }, { x: 0, duration: motion.wipeReveal, ease: motion.ease, immediateRender: false }, motion.wipeCover)
        .set(outgoing, { display: "none" }, motion.wipeCover)
        .set(panel, { visibility: "visible" }, motion.wipeCover)
        .to(curtain, { xPercent: sign * 100, duration: motion.wipeReveal, ease: motion.ease }, motion.wipeCover)
        .fromTo(panel, { x: -sign * push }, { x: 0, duration: motion.wipeReveal, ease: motion.ease }, motion.wipeCover);
      const finish = () => { timeline.progress(1); };
      window.addEventListener("resize", finish);
      panel.addEventListener("focusin", finish);
      return () => { window.removeEventListener("resize", finish); panel.removeEventListener("focusin", finish); timeline.kill(); settle(); };
    });
    return () => media.revert();
  }, { scope: demoRef, dependencies: [stage], revertOnUpdate: true });

  function changeStage(next: Stage) {
    if (next === stage) return;
    previousStage.current = stage;
    direction.current = stages.findIndex(item => item.id === next) > stages.findIndex(item => item.id === stage) ? -1 : 1;
    previousHeight.current = demoRef.current?.querySelector(`.${styles.demoBody}`)?.getBoundingClientRect().height ?? null;
    const panel = demoRef.current?.querySelector('[role="tabpanel"][aria-hidden="false"]');
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
    <div className={styles.demo} ref={demoRef} data-home-learning-demo>
      <div className={styles.stageCurtain} data-learning-curtain aria-hidden="true" />
      <noscript><p className={styles.helper}>Сначала изучите урок и материалы, затем выполните практическое задание. На основном курсе куратор проверяет работу и даёт обратную связь. Интерактивный пример доступен с JavaScript.</p><style>{`#learning-preview [role="tablist"], #learning-preview button{display:none!important}`}</style></noscript>
      <div className={styles.tabs} role="tablist" aria-label="Этапы обучения">
        {stages.map((item, index) => (
          <button key={item.id} ref={(node) => { tabsRef.current[index] = node; }} type="button" role="tab" id={`learning-tab-${item.id}`} aria-controls={`learning-panel-${item.id}`} aria-selected={stage === item.id} tabIndex={stage === item.id ? 0 : -1} onClick={() => changeStage(item.id)} onKeyDown={(event) => onTabKeyDown(event, index)}>
            <small>0{index + 1}</small><span className={styles.longLabel}>{item.label}</span><span className={styles.shortLabel}>{["Урок", "Задание", "Ответ"][index]}</span>
          </button>
        ))}
      </div>
      <div className={styles.demoBody} data-stage={stage}>
        <div inert={stage !== "lesson"} aria-hidden={stage !== "lesson"} className={styles.stageContent} role="tabpanel" id="learning-panel-lesson" aria-labelledby="learning-tab-lesson" tabIndex={0}>
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
        </div>
        <div inert={stage !== "assignment"} aria-hidden={stage !== "assignment"} className={styles.stageContent} role="tabpanel" id="learning-panel-assignment" aria-labelledby="learning-tab-assignment" tabIndex={0}>
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
        </div>
        <div inert={stage !== "feedback"} aria-hidden={stage !== "feedback"} className={styles.stageContent} role="tabpanel" id="learning-panel-feedback" aria-labelledby="learning-tab-feedback" tabIndex={0}>
          <p className={styles.status}>ШАГ 03 / ОТВЕТ КУРАТОРА</p>
          <h3>{submitted ? "Работа на доработке" : "Как выглядит обратная связь"}</h3>
          <p>«Хорошее начало. Обратите внимание на симметрию и повторите упражнение, затем отправьте обновлённое фото».</p>
          <div className={styles.feedbackStatus}><strong>Нужна доработка</strong><span>После обратной связи работу можно изменить и отправить снова.</span></div>
          <Button appearance="cut" onClick={() => { setSubmitted(false); changeStage("assignment"); }}>ДОРАБОТАТЬ ЗАДАНИЕ <span aria-hidden="true">→</span></Button>
        </div>
      </div>

    </div>
  );
}
