import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getResourceArticleBySlug, resourceArticles } from "@/data/resourceArticles";
import { PageHero } from "@/components/ui/PageHero";

type ResourceArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return resourceArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ResourceArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getResourceArticleBySlug(slug);

  if (!article) {
    return {
      title: "Resource | BioAxis"
    };
  }

  return {
    title: `${article.title} | BioAxis Resources`,
    description: article.description,
    alternates: {
      canonical: `/resources/${article.slug}`
    }
  };
}

export default async function ResourceArticlePage({ params }: ResourceArticlePageProps) {
  const { slug } = await params;
  const article = getResourceArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <PageHero eyebrow="Resource guide" title={article.title} subtitle={article.description} />
      <article className="mx-auto w-full max-w-4xl px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-10">
          {article.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-2xl font-bold uppercase text-bioaxis-text">{section.heading}</h2>
              <div className="mt-5 grid gap-5 text-base leading-8 text-bioaxis-muted">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-12 grid gap-3 border-t border-bioaxis-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href={article.productHref}
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Related products
          </Link>
          <Link
            href={article.equivalentHref}
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Find equivalent
          </Link>
          <Link
            href={article.sampleHref}
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-line px-5 text-sm font-semibold uppercase text-bioaxis-steel transition hover:border-bioaxis-accent hover:text-bioaxis-accent"
          >
            Request sample
          </Link>
          <Link
            href={article.rfqHref}
            className="inline-flex min-h-11 items-center justify-center border border-bioaxis-accent bg-bioaxis-accent px-5 text-sm font-semibold uppercase text-bioaxis-black transition hover:bg-transparent hover:text-bioaxis-accent"
          >
            Prepare RFQ
          </Link>
        </div>
      </article>
    </>
  );
}
