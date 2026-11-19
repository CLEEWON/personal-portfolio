import type { MetadataRoute } from "next";
import { getProjectSlugs } from "@/lib/mdx";

const baseUrl = "https://charleesportfolio.vercel.app";
const locales = ["id", "en"] as const;

// Halaman statis yang beneran punya route sendiri
const staticRoutes = ["", "/projects"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: route === "" ? 1 : 0.8,
      });
    }

    // Sekarang halaman detail [slug] beneran ada, jadi aman dimasukin lagi.
    // Slug ditarik otomatis dari folder content/<locale>/ — bukan hardcode,
    // biar sitemap otomatis update kalau nambah/hapus project.
    const slugs = getProjectSlugs(locale);
    for (const slug of slugs) {
      entries.push({
        url: `${baseUrl}/${locale}/projects/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
