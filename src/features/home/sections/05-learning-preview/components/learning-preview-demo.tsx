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

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);
  useEffect(() => () => photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.url)), []);

  useGSAP(() => {
    const panel = demoRef.current?.querySelector('[role="tabpanel"]');
    if (!panel) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(panel, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .3, ease: "power2.out", clearProps: "opacity,transform" });
    });
    return () => media.revert();
  }, { scope: demoRef, dependencies: [stage], revertOnUpdate: true });

  function changeStage(next: Stage) {
    const panel = demoRef.current?.querySelector('[role="tabpanel"]');
    if (panel?.contains(document.activeElement)) tabsRef.current[stages.findIndex((item) => item.id === next)]?.focus({ preventScroll: true });
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
        <span className={styles.demoBadge}>ДЕМО · БЕЗ ОТПРАВКИ</span>
      </div>
      <div className={styles.tabs} role="tablist" aria-label="Этапы обучения">
        {stages.map((item, index) => (
          <button key={item.id} ref={(node) => { tabsRef.current[index] = node; }} type="button" role="tab" id={`learning-tab-${item.id}`} aria-controls={`learning-panel-${item.id}`} aria-selected={stage === item.id} tabIndex={stage === item.id ? 0 : -1} onClick={() => changeStage(item.id)} onKeyDown={(event) => onTabKeyDown(event, index)}>
            <small>0{index + 1}</small><span>{item.label}</span>
          </button>
        ))}
      </div>
      <div className={styles.demoBody}>
        <div className={styles.lessonCard}>
          <div className={styles.mediaPlaceholder} role="img" aria-label="Место для демонстрационного видеоурока">
            <span>ВИДЕОУРОК</span>
            <strong>Демо-видео пока не добавлено</strong>
          </div>
          <div className={styles.lessonText}>
            <p className={styles.eyebrow}>ПРИМЕР УРОКА</p>
            <h3>Урок и практика</h3>
            <p>В настоящем курсе здесь будут урок и материалы для подготовки к заданию.</p>
          </div>
        </div>
        {stage === "lesson" && <div className={styles.stageContent} role="tabpanel" id="learning-panel-lesson" aria-labelledby="learning-tab-lesson" tabIndex={0}>
          <p className={styles.status}>ШАГ 01 / ПРОСМОТР УРОКА</p>
          <h3>Сначала изучите материал</h3>
          <p>Это демонстрация учебной среды. Видеоурок появится здесь после добавления согласованного демоматериала.</p>
          <Button appearance="neoBrutalist" onClick={() => changeStage("assignment")}>К ЗАДАНИЮ <span aria-hidden="true">→</span></Button>
        </div>}
        {stage === "assignment" && <div className={styles.stageContent} role="tabpanel" id="learning-panel-assignment" aria-labelledby="learning-tab-assignment" tabIndex={0}>
          <p className={styles.status}>{submitted ? "ДЕМО-СТАТУС / ОТПРАВЛЕНО" : "ШАГ 02 / МОЯ РАБОТА"}</p>
          <h3>Практическое задание</h3>
          <p>Добавьте фотографии и комментарий, чтобы попробовать процесс отправки работы. Файлы остаются только в этой вкладке.</p>
          <label className={styles.upload}>
            <span className={styles.plus} aria-hidden="true">+</span>
            <span><strong>Добавить фотографии</strong><small>Предпросмотр файлов · деморежим</small></span>
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
          {submitted ? <Button appearance="neoBrutalist" intent="secondary" onClick={() => changeStage("feedback")}>ПОСМОТРЕТЬ ОТВЕТ <span aria-hidden="true">→</span></Button> : <Button appearance="neoBrutalist" onClick={() => { setSubmitted(true); changeStage("feedback"); }} disabled={!photos.length && !comment.trim()}>ИМИТИРОВАТЬ ОТПРАВКУ <span aria-hidden="true">↗</span></Button>}
          {!submitted && <small className={styles.helper}>Добавьте фото или комментарий, чтобы продолжить.</small>}
        </div>}
        {stage === "feedback" && <div className={styles.stageContent} role="tabpanel" id="learning-panel-feedback" aria-labelledby="learning-tab-feedback" tabIndex={0}>
          <p className={styles.status}>ШАГ 03 / ОТВЕТ КУРАТОРА · ПРИМЕР</p>
          <h3>{submitted ? "Работа на доработке" : "Как выглядит обратная связь"}</h3>
          <p>Пример комментария к работе: «Хорошее начало. Обратите внимание на симметрию и повторите упражнение, затем отправьте обновлённое фото».</p>
          <div className={styles.feedbackStatus}><strong>Статус примера: доработка</strong><span>После обратной связи работу можно изменить и отправить снова.</span></div>
          <Button appearance="neoBrutalist" onClick={() => { setSubmitted(false); changeStage("assignment"); }}>ДОРАБОТАТЬ ЗАДАНИЕ <span aria-hidden="true">→</span></Button>
        </div>}
      </div>
      <div className={styles.demoFooter}><strong>ДЕМО · БЕЗ ОТПРАВКИ</strong><span>Ваши файлы и комментарий не сохраняются и никому не передаются.</span></div>
    </div>
  );
}
