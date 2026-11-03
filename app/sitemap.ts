import { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";

// Required for `output: "export"` (GH Pages build) — otherwise Next treats
// this route as dynamic and the static export fails to collect its data.
export const dynamic = "force-static";

const BASE_URL = site.url;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    ...projects.map((p) => ({ url: `${BASE_URL}/work/${p.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 })),
  ];
}
