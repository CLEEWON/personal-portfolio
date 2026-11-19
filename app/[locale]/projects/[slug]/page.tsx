import { getProjectBySlug, getProjectSlugs } from "@/lib/mdx";
import { getDictionary } from "@/lib/dictionary";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAlternates, locales, type Locale } from "@/lib/seo";

// Pre-render semua halaman project (per locale) pas build time
export async function generateStaticParams() {
  const params: { locale: Locale; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = getProjectSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug, locale);

  if (!project) {
    return {
      title: locale === "id" ? "Proyek Tidak Ditemukan" : "Project Not Found",
    };
  }

  return {
    title: `${project.meta.title ?? slug} — Charlee`,
    description: project.meta.description,
    alternates: getAlternates(locale, `/projects/${slug}`),
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  const project = getProjectBySlug(slug, locale);

  // Kalau slug nggak ketemu di content/<locale>/, langsung 404 —
  // jangan biarin halaman kosong atau nge-render apa-apa secara diam-diam
  if (!project) {
    notFound();
  }

  const dict = (await getDictionary(locale)) as any;
  const labels = dict?.projects?.drawer ?? {};
  const { meta, content } = project;

  return (
    <article className="py-10 max-w-3xl mx-auto">
      <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
        {meta.title}
      </h1>

      {meta.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={meta.image}
          alt={meta.title ?? slug}
          className="w-full rounded-xl mb-6"
        />
      )}

      {meta.description && (
        <p className="text-brand-text/70 text-lg mb-6">{meta.description}</p>
      )}

      {meta.tech && meta.tech.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-semibold mb-2">{labels.techStack}</p>
          <div className="flex flex-wrap gap-2">
            {meta.tech.map((t: string) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-sm font-medium"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 mb-10">
        {meta.liveUrl && (
          <a
            href={meta.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-brand-purple text-white font-medium"
          >
            {labels.viewLive}
          </a>
        )}
        {meta.githubUrl && (
          <a
            href={meta.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg border border-brand-purple text-brand-purple font-medium"
          >
            {labels.sourceCode}
          </a>
        )}
      </div>

      {/* CATATAN: ini masih render teks mentah dari body MDX (whitespace-pre-wrap).
          Belum ada markdown renderer, jadi heading/bold/list di body .mdx
          belum bakal ke-render sebagai format, cuma teks polos.
          Kalau mau itu jalan beneran, tambahin library kayak react-markdown nanti. */}
      <div className="prose prose-invert whitespace-pre-wrap text-brand-text/80">
        {content}
      </div>
    </article>
  );
}
