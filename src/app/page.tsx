import { HomePage } from "@/features/home";

import { staticMetadata } from "@/lib/seo/metadata";
import { websiteSchema } from "@/lib/seo/structured-data";
import { StructuredData } from "@/features/public-shell/structured-data";
export const metadata = staticMetadata("/");

export default function Home() {
  return <><StructuredData value={websiteSchema()} /><HomePage /></>;
}
