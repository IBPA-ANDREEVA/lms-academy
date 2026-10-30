import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailPage } from "@/features/course-detail/detail-page";
import { getDetailProduct } from "@/features/course-detail/detail-data";

type Props = { params: Promise<{ slug: string }> };
export const instant = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = getDetailProduct("course", (await params).slug);
  return { title: product?.title ?? "Курс не найден", robots: { index: false, follow: false } };
}

export default async function CourseDetailRoute({ params }: Props) {
  const product = getDetailProduct("course", (await params).slug);
  if (!product) notFound();
  return <DetailPage product={product} />;
}
