import Hero from "@/components/Hero"; 
import About from "@/components/About";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Certificates from "@/components/Certificates";
import Projects from "@/components/Projects"; // <-- Import Komponen Projects Baru
import Contact from "@/components/Contact";
import { getAllProjects } from "@/lib/mdx";
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
    id: "Charlee — Web Developer | Portofolio & Proyek Fullstack",
    en: "Charlee — Web Developer | Portfolio & Projects",
  };

  const descriptions: Record<Locale, string> = {
    id: "Portofolio Charlee, Web Developer yang membangun aplikasi web fungsional, interaktif, dan user-centric dengan Laravel 11 & MySQL.",
    en: "Portfolio of Charlee, a Web Developer building functional, interactive, and user-centric web applications with Laravel 11 & MySQL.",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
    alternates: getAlternates(locale, ""),
  };
}

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || "id";
  
  const dict = (await getDictionary(locale)) as any;
  const projects = getAllProjects(locale);
 
  return (
    <div className="space-y-28 pb-20">
      {/* 1. Hero / Home Section */}
      {dict?.hero && <Hero dict={dict.hero} />}

      {/* 2. About Me Section */}
      {dict?.about && <About dict={dict.about} />}

      {/* 3. Skills Section */}
      {dict?.skills && <Skills dict={dict.skills} />}

      {/* 4. Certificates Section */}
      {dict?.certificates && <Certificates dict={dict.certificates} />}

      {/* 5. Experience Section */}
      {dict?.experience && <Experience dict={dict.experience} />}

      {/* 6. Projects Section */}
      {/* Kita passing dict khusus proyek dan array data projects-nya */}
      {dict?.projects && <Projects dict={dict.projects} projects={projects} />}

      {/* 7. Contact Section */}
      {dict?.contact && <Contact dict={dict.contact} />}
    </div>
  );
}