interface GetImageUrlOptions {
  imageId: string;
  size?: 's' | 'm' | 'l' | 'b' | 'h';
}

export function getImageUrl(imageId: string, size: string = 's'): string {
  return (
    'https://i.imgur.com/' +
    imageId +
    size +
    '.jpg'
  );
}
