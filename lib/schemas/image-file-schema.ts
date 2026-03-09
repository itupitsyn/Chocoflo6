import z from 'zod';

export const imageFileSchema = z.custom<File>((val) => {
  return val instanceof File;
}, 'Должен быть объект File');
