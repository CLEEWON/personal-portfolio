import type { MetadataRoute } from "next";

const baseUrl = "https://charleesportfolio.vercel.app";
const locales = ["id", "en"];

// Halaman statis yang beneran punya route sendiri — sesuaikan kalau nambah/ganti
const staticRoutes = ["", "/projects"];

// CATATAN: entry per-slug project (/projects/momoyo-hris, dst) sengaja
// DIHAPUS dulu dari sitemap. Soalnya app/[locale]/projects/[slug]/page.tsx
// saat ini masih render listing yang sama kayak /projects (belum ada logic
// buat nampilin 1 project spesifik berdasarkan slug). Submit URL itu ke
// Google sekarang = ngirim sinyal duplicate content.
//
// Begitu halaman detail per-slug beneran jadi (pake params.slug buat
// nyari 1 project & notFound() kalau nggak ketemu), tambahin lagi loop
// project di bawah ini.

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
  }

  return entries;
}
