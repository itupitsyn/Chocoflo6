export const getImageUrl = (fileName: string | null | undefined) => {
  if (!fileName) return null;

  return `/api/images/${fileName}`;
};
