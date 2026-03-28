'use client';

import { Ghost, X } from 'lucide-react';
import Image from 'next/image';
import { FC, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';

import { IMG_FORMATS } from '@/lib/constants/images';

import { Loader } from './loader';

export type ImageUploaderElement = { id: number; src: string; file?: File; uploaded: boolean };

interface ImageUploaderProps {
  images: ImageUploaderElement[];
  isLoading?: boolean;
  isDisabled?: boolean;
  onDrop: (data: File[]) => void;
  onDelete: (img: ImageUploaderElement) => void;
  onBlur?: () => void;
}

export const ImageUploader: FC<ImageUploaderProps> = ({ images, isDisabled, isLoading, onDrop, onDelete, onBlur }) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: Object.fromEntries(IMG_FORMATS.map((item) => [item, []])),
  });

  const pasteFromClipBoardClick = useCallback(async () => {
    if (isDisabled || isLoading) {
      return;
    }
    try {
      const files: File[] = [];
      const clipboardItems = await navigator.clipboard.read();

      for (const item of clipboardItems) {
        const foundType = item.types.find((currType) => currType.startsWith('image/'));
        if (!foundType) {
          continue;
        }

        const blob = await item.getType(foundType);

        const extension = blob.type.split('/')[1];
        const file = new File([blob], `${Math.random().toString(32).replace('.', '')}.${extension}`, {
          type: blob.type,
        });

        files.push(file);
      }
      onDrop(files);
    } catch {
      toast.error('Ошибка чтения из буфера обмена');
    }
  }, [isDisabled, isLoading, onDrop]);

  return (
    <>
      {images.length > 0 && (
        <div className="relative flex flex-wrap gap-4" onBlur={onBlur}>
          {isLoading && <Loader />}

          {images.map((item) => (
            <div key={item.id} className="relative border border-dashed">
              {item.src ? (
                <Image src={item.src} alt="" width={192} height={192} className="size-24 object-contain" quality={85} />
              ) : (
                <div className="flex size-24 items-center justify-center">
                  {!isLoading && <Ghost className="size-6 object-contain" />}
                </div>
              )}

              <button
                type="button"
                disabled={isLoading || isDisabled}
                className="absolute top-1 right-1 cursor-pointer transition-colors hover:text-red-600 disabled:cursor-default"
                onClick={() => onDelete(item)}
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        <div
          {...getRootProps()}
          className="flex cursor-pointer items-center justify-center rounded-b-sm border border-dashed p-6 transition-colors hover:border-fuchsia-700 hover:text-fuchsia-700"
        >
          <input {...getInputProps()} disabled={isLoading || isDisabled} />
          <p className="text-center text-sm">Переместите сюда файлы, или кликните, чтобы выбрать файлы с диска</p>
        </div>

        <div
          className="flex cursor-pointer items-center justify-center rounded-b-sm border border-dashed p-6 transition-colors hover:border-fuchsia-700 hover:text-fuchsia-700"
          onClick={pasteFromClipBoardClick}
        >
          <p className="text-center text-sm">Вставить файл из буфера обмена</p>
        </div>
      </div>
    </>
  );
};
