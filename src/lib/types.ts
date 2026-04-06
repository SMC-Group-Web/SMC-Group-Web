export type MediaType = {
  id?: string | number
  url?: string | null
  alt?: string | null
  filename?: string | null
}

export type GalleryItem = {
  image?: MediaType | number | null
  caption?: string | null
  id?: string | null
}
