import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const saveImagesToFiles = async (files: File[]) => {
  const pathToFiles = process.env['PATH_TO_FILES'];
  if (!pathToFiles) {
    console.error('PATH_TO_FILES is not set');
    return null;
  }

  const fileNames = await Promise.allSettled(
    files.map(async (file) => {
      if (!file || file.size === 0) {
        return null;
      }

      const fnParts = file.name.split('.');
      const extension = fnParts[fnParts.length - 1];
      const uniqueName = `${uuidv4()}.${extension}`;
      const path = join(pathToFiles, uniqueName);

      try {
        await Bun.write(path, file);
        return uniqueName;
      } catch (error) {
        console.error(`Error saving ${file.name}\n${error}`);
        return null;
      }
    }),
  );

  return fileNames;
};
