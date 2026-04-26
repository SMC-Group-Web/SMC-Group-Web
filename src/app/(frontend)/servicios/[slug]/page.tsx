import type { Metadata } from "next";
import config from "@payload-config";
import { getPayload } from "payload";
import { notFound } from "next/navigation";
import type { MediaType } from "@/lib/types";
import ServicioDetail from "@/components/servicios/ServicioDetail";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "services",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    select: { title: true, slug: true, summary: true, seo: true, image: true, category: true },
  });

  const service = result.docs[0];
  if (!service) return {};

  type SeoGroup = { titulo?: string; descripcion?: string; imagen?: MediaType; noIndex?: boolean } | null;
  const seo = (service.seo as SeoGroup) ?? null;

  const title = seo?.titulo || `${service.title}${service.category ? ` — ${service.category}` : ""} | SMC GROUP`;
  const description = seo?.descripcion || (service.summary as string | null) || `Servicio de ${service.title} — SMC GROUP Lima, Perú.`;

  const img = service.image && typeof service.image === "object" ? (service.image as MediaType) : null;
  const ogImage = seo?.imagen?.url || img?.url || null;

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
  const services = await payload.find({
    collection: "services",
    limit: 200,
    select: { slug: true },
  });
  return services.docs.map((s) => ({ slug: s.slug as string }));
}

export const revalidate = 3600;

export default async function ServicioDetailPage({ params }: Props) {
  const { slug } = await params;
  const payload = await getPayload({ config });

  const result = await payload.find({
    collection: "services",
    where: { slug: { equals: slug }, isActive: { equals: true } },
    limit: 1,
    depth: 1,
  });

  const service = result.docs[0];
  if (!service) notFound();

  const image =
    service.image && typeof service.image === "object"
      ? (service.image as MediaType)
      : null;

  type GalleryItem = { image: unknown; caption?: string | null };
  const galleryItems = ((service.gallery || []) as GalleryItem[])
    .filter((g) => g.image && typeof g.image === "object")
    .map((g) => {
      const img = g.image as MediaType;
      return { url: img.url ?? "", alt: img.alt ?? null, caption: g.caption ?? null };
    });

  return (
    <ServicioDetail
      title={service.title}
      slug={service.slug as string}
      category={(service.category as string | null) ?? null}
      summary={(service.summary as string | null) ?? null}
      description={(service.description as string | null) ?? null}
      features={((service.features || []) as { text: string }[])}
      image={image ? { url: image.url ?? "", alt: image.alt ?? null } : null}
      gallery={galleryItems}
      ctaLink={(service.ctaLink as string | null) ?? null}
    />
  );
}
