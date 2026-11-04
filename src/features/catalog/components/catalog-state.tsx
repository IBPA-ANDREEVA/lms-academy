"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button, ButtonLink } from "@/components/ui/button";
import type { CatalogResult } from "@/server/catalog/contracts";
import styles from "./catalog-state.module.css";

/** Shared by catalog result sections, home discovery and unavailable detail. */
export function CatalogState({ status, mini = false, productType, filtered = false, onReset }: {
  status: CatalogResult["status"] | "loading"; mini?: boolean; productType?: "package"; filtered?: boolean; onReset?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const unavailable = status === "unavailable";
  const loading = status === "loading";
  const packages = productType === "package";
  return <div className={styles.state} role={unavailable ? "alert" : "status"} aria-busy={loading || pending}>
    <h3>{loading ? "Загружаем каталог…" : unavailable ? "Каталог временно недоступен" : filtered ? "По этим фильтрам ничего не найдено" : packages ? "Пакеты готовятся к публикации" : mini ? "Мини-курсы готовятся к публикации" : "Курсы готовятся к публикации"}</h3>
    {!loading && <p>{unavailable ? "Не удалось загрузить программы. Попробуйте ещё раз немного позже." : filtered ? "Измените параметры или сбросьте фильтры." : packages ? "Здесь появятся наборы программ после утверждения состава и условий. Пока можно выбрать отдельный курс." : mini ? "Здесь появятся короткие программы в записи, без куратора и проверки работ." : "Здесь появятся программы после проверки содержания и условий обучения."}</p>}
    <div className={styles.actions}>
      {unavailable && <Button intent="secondary" loading={pending} onClick={() => startTransition(() => router.refresh())}>Попробовать снова</Button>}
      {!loading && !unavailable && filtered && onReset && <Button intent="secondary" onClick={onReset}>Сбросить фильтры</Button>}
      {!loading && <ButtonLink href={mini || packages ? "/courses" : "/mini-courses"} intent="secondary">{mini || packages ? "Смотреть курсы" : "Смотреть мини-курсы"}</ButtonLink>}
    </div>
  </div>;
}
