'use client';

import { Ghost } from 'lucide-react';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

import { cn, getImageUrl } from '@/lib/utils';

interface ImgSlideProps {
  image: string;
  isFS?: boolean;
}

export const ImgSlide: FC<ImgSlideProps> = ({ image, isFS }) => {
  const [img, setImg] = useState<string>(getImageUrl(image) || '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setImg(getImageUrl(image) || '');
    }, 0);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [image]);

  return (
    <div className={cn('relative aspect-square min-w-0 flex-[0_0_100%]', isFS ? 'h-svh' : 'h-60')}>
      {img ? (
        <Image
          src={img}
          alt=""
          priority
          fill
          onError={() => {
            setImg('');
          }}
          quality={85}
          className={cn('size-full', isFS ? 'object-contain' : 'object-cover')}
          sizes={isFS ? '100vw' : '(max-width: 768px) 100vw, 33vw'}
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-white">
          <Ghost className="size-6 object-contain text-black" />
        </div>
      )}
    </div>
  );
};
