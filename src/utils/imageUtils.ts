export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getValidImageSrc = (src?: string): string => {
  if (!src) return '/images/placeholder.svg';
  if (src.startsWith('/')) return src;
  if (src.startsWith('data:')) return src;
  if (isValidUrl(src)) return src;
  if (src.startsWith('images/')) return `/${src}`;
  return '/images/placeholder.svg';
}; 