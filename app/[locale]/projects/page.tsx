import { getAllProjects } from "@/lib/mdx";
import ProjectCard from "@/components/ProjectCard";
import { getDictionary } from "@/lib/dictionary";
import type { Metadata } from "next";
import { getAlternates, type Locale } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<Locale, string> = {
    id: "Karya Terbaik — Proyek Web Developer oleh Charlee",
    en: "Featured Works — Charlee's Web Development Projects",
  };

  const descriptions: Record<Locale, string> = {
    id: "Kumpulan proyek Charlee — dari desain antarmuka hingga sistem backend kompleks, dibangun dengan Laravel 11, Next.js, dan Unity.",
    en: "A collection of projects by Charlee — from user interfaces to complex backend systems, built with Laravel 11, Next.js, and Unity.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: getAlternates(locale, "/projects"),
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const dict = (await getDictionary(locale)) as any;
  const projects = getAllProjects(locale);

  return (
    <div className="py-10">
      <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
        {dict?.projects?.title}{" "}
        <span className="text-brand-purple">{dict?.projects?.accent}</span>
      </h1>
      <p className="text-brand-text/60 font-medium mb-10">
        {dict?.projects?.subtitle}
      </p>
      
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}