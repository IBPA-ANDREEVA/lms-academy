import { ProductRoute, detailMetadata } from "@/features/course-detail/product-route";
type Props = { params: Promise<{ slug: string }> };
export const instant = false;
export async function generateMetadata({ params }: Props) { return detailMetadata("course", (await params).slug); }
export default async function Page({ params }: Props) { return <ProductRoute kind="course" slug={(await params).slug} />; }
