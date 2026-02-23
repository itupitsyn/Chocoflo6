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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImg(getImageUrl(image) || '');
  }, [image]);

  return (
    <div className={cn('relative', isFS ? 'h-svh' : 'h-60')}>
      {img ? (
        <Image
          src={img}
          alt=""
          priority
          fill
          onError={() => {
            setImg('');
          }}
          unoptimized={isFS}
          className={cn('size-full', isFS ? 'object-contain' : 'object-cover')}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-white">
          <Ghost className="size-6 object-contain text-black" />
        </div>
      )}
    </div>
  );
};
