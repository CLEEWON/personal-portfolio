const baseUrl = "https://charleesportfolio.vercel.app";

export const locales = ["id", "en"] as const;
export type Locale = (typeof locales)[number];
const defaultLocale: Locale = "id";

/**
 * Generate object `alternates` (canonical + hreflang) buat dipake di
 * generateMetadata tiap halaman.
 *
 * @param locale - locale halaman yang lagi dibuka (dari params.locale)
 * @param path   - path TANPA prefix locale. Contoh: "" buat home,
 *                 "/projects" buat listing, "/projects/momoyo-hris" buat detail project
 */
export function getAlternates(locale: Locale, path: string = "") {
  const languages: Record<string, string> = {};

  for (const l of locales) {
    languages[l] = `${baseUrl}/${l}${path}`;
  }
  // x-default: versi yang ditampilin kalau bahasa browser user nggak match salah satu locale
  languages["x-default"] = `${baseUrl}/${defaultLocale}${path}`;

  return {
    canonical: `${baseUrl}/${locale}${path}`,
    languages,
  };
}
