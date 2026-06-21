import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import { BreadcrumbSchema, ProyectoSchema } from "@/components/seo/JsonLd";

export const revalidate = 3600;
import type { MediaType, GalleryItem } from "@/lib/types";
import { siteConfig } from "@/lib/site";
import ProyectoDetail from "@/components/proyectos/ProyectoDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "projects",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    select: {
      title: true,
      slug: true,
      client: true,
      year: true,
      summary: true,
      seo: true,
      coverImage: true,
    },
  });

  const project = result.docs[0];
  if (!project) return {};

  type SeoGroup = {
    titulo?: string;
    descripcion?: string;
    imagen?: MediaType;
    noIndex?: boolean;
  } | null;
  const seo = (project.seo as SeoGroup) ?? null;

  const title =
    seo?.titulo ||
    `${project.title}${project.client ? ` — ${project.client}` : ""}${project.year ? ` (${project.year})` : ""}`;
  const description =
    seo?.descripcion ||
    (project.summary as string | null) ||
    `Proyecto de ingeniería y construcción: ${project.title}`;

  const cover =
    project.coverImage && typeof project.coverImage === "object"
      ? (project.coverImage as MediaType)
      : null;
  const ogImage = seo?.imagen?.url || cover?.url || null;

  return {
    title,
    description,
    ...(seo?.noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title,
      description,
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
  };
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const projects = await payload.find({
    collection: "projects",
    limit: 200,
    select: { slug: true },
  });
  return projects.docs.map((p) => ({ slug: p.slug as string }));
}

export default async function ProyectoDetailPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "projects",
    where: { slug: { equals: slug }, isActive: { equals: true } },
    limit: 1,
    depth: 1,
  });

  const project = result.docs[0];
  if (!project) notFound();

  const cover =
    project.coverImage && typeof project.coverImage === "object"
      ? (project.coverImage as MediaType)
      : null;

  const galleryItems = ((project.gallery || []) as GalleryItem[])
    .filter((item) => item.image && typeof item.image === "object")
    .map((item) => ({
      image: item.image as MediaType,
      caption: item.caption ?? null,
    }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Inicio", url: siteConfig.website },
          { name: "Proyectos", url: `${siteConfig.website}/proyectos` },
          { name: project.title, url: `${siteConfig.website}/proyectos/${project.slug}` },
        ]}
      />
      <ProyectoSchema
        proyecto={{
          title: project.title,
          slug: project.slug as string,
          description: project.description as string | null,
          client: project.client as string | null,
          year: project.year as number | null,
          coverImageUrl: cover?.url ?? null,
        }}
      />
      <ProyectoDetail
        title={project.title}
        slug={project.slug as string}
        client={(project.client as string | null) ?? null}
        year={(project.year as number | null) ?? null}
        location={(project.location as string | null) ?? null}
        projectType={(project.projectType as string | null) ?? null}
        summary={(project.summary as string | null) ?? null}
        description={(project.description as string | null) ?? null}
        cover={cover ? { url: cover.url ?? "", alt: cover.alt ?? null, caption: (project.coverCaption as string | null) ?? null } : null}
        gallery={galleryItems.map(g => ({ url: g.image.url ?? "", alt: g.image.alt ?? null, caption: g.caption }))}
      />
    </>
  );
}
