import { join } from 'path';

export const deleteFiles = async (files: string[]) => {
  const pathToFiles = process.env['PATH_TO_FILES'];
  if (!pathToFiles) {
    console.error('PATH_TO_FILES is not set');
    return null;
  }

  await Promise.all(
    files.map(async (file) => {
      if (!file) {
        return null;
      }

      const path = join(pathToFiles, file);

      try {
        const file = Bun.file(path);
        await file.delete();
      } catch (error) {
        console.error(`Error deleting ${file}\n${error}`);
        return null;
      }
    }),
  );
};
