export type ImageSize = 's' | 'm' | 'l' | 'b' | 'h';

export function getImageUrl(imageId: string, size: ImageSize = 's'): string {
  return `https://i.imgur.com/${imageId}${size}.jpg`;
}
