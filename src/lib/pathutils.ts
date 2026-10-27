export function normalizeImagePath(
  imageUrl?: string,
  defaultPath: string = ''
): string {
  if (imageUrl == undefined) {
    return defaultPath;
  }
  return imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
}