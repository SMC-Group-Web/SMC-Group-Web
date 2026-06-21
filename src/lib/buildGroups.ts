export type ImageBlock = {
  url: string;
  alt?: string | null;
  caption?: string | null;
};

export type GalleryGroup =
  | { type: "full"; image: ImageBlock; index: number }
  | { type: "duo"; images: [ImageBlock, ImageBlock]; indices: [number, number] }
  | { type: "trio"; images: [ImageBlock, ImageBlock, ImageBlock]; indices: [number, number, number] };

export function buildGroups(images: ImageBlock[]): GalleryGroup[] {
  const groups: GalleryGroup[] = [];
  let i = 0;
  let cycle = 0;
  while (i < images.length) {
    const rem = images.length - i;
    const pat = cycle % 4;
    if (pat === 0 || rem === 1) {
      groups.push({ type: "full", image: images[i], index: i }); i++;
    } else if (pat === 1 && rem >= 2) {
      groups.push({ type: "duo", images: [images[i], images[i + 1]], indices: [i, i + 1] }); i += 2;
    } else if (pat === 2 || rem === 1) {
      groups.push({ type: "full", image: images[i], index: i }); i++;
    } else if (pat === 3 && rem >= 3) {
      groups.push({ type: "trio", images: [images[i], images[i + 1], images[i + 2]], indices: [i, i + 1, i + 2] }); i += 3;
    } else if (rem >= 2) {
      groups.push({ type: "duo", images: [images[i], images[i + 1]], indices: [i, i + 1] }); i += 2;
    } else {
      groups.push({ type: "full", image: images[i], index: i }); i++;
    }
    cycle++;
  }
  return groups;
}
