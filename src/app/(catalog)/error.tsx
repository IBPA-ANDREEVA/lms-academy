"use client";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/features/public-shell";
export default function CatalogError({reset}:{error:Error;reset:()=>void}){
 return <main id="main-content"><PageContainer size="content"><section role="alert" style={{paddingBlock:"80px 120px"}}><h1>Не удалось загрузить каталог</h1><p>Попробуйте ещё раз. Выбранные фильтры останутся в адресе страницы.</p><Button appearance="cut" onClick={reset}>Повторить</Button></section></PageContainer></main>
}
