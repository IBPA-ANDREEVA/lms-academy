"use client";
import { useState } from "react";
import { SelectField } from "@/components/ui/form-controls";
import { CatalogState } from "@/features/catalog/components/catalog-state";

export function CatalogStatesPreview() {
  const [state, setState] = useState("empty");
  return <>
    <SelectField label="Состояние каталога — демонстрация" value={state} onChange={event => setState(event.target.value)}>
      <option value="empty">Нет опубликованных курсов</option>
      <option value="mini">Нет опубликованных мини-курсов</option>
      <option value="filtered">Нет совпадений</option>
      <option value="unavailable">Временно недоступен</option>
      <option value="loading">Загрузка</option>
    </SelectField>
    <CatalogState status={state === "unavailable" || state === "loading" ? state : "empty"} mini={state === "mini"} filtered={state === "filtered"} onReset={() => setState("empty")} />
  </>;
}
