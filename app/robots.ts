import { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Required for `output: "export"` (GH Pages build) — otherwise Next treats
// this route as dynamic and the static export fails to collect its data.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
