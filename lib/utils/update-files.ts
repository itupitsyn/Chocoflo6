import z from 'zod';

import { itemEditImageArraySchema } from '../schemas/image-schema';
import { deleteFiles } from './delete-files';
import { saveImagesToFiles } from './save-images-to-files';

export const updateFiles = async (images: z.infer<typeof itemEditImageArraySchema>, oldImages?: string[]) => {
  const fileNames: string[] = [];
  const newFiles = images?.filter((item) => 'file' in item) ?? [];

  const result = await saveImagesToFiles(newFiles.map((item) => item.file));
  result?.forEach((item) => {
    if (item.status === 'fulfilled' && item.value) {
      fileNames.push(item.value);
    }
  });

  if (oldImages?.length) {
    const oldFiles = images?.filter((item) => item.uploaded).map((item) => item.src) ?? [];
    const filesToDelete: string[] = [];

    oldImages.forEach((item) => {
      if (!oldFiles.find((fn) => fn === item)) {
        filesToDelete.push(item);
      } else {
        fileNames.push(item);
      }
    });

    deleteFiles(filesToDelete);
  }

  return fileNames;
};
