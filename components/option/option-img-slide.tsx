'use client';

import { Ghost } from 'lucide-react';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';

import { getImageUrl } from '@/lib/utils';

interface OptionImgSlideProps {
  image: string;
}

export const OptionImgSlide: FC<OptionImgSlideProps> = ({ image }) => {
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
    <div className="relative aspect-square h-30 min-w-0 flex-[0_0_100%]">
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
          className="size-full object-cover"
          sizes="33vw"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-white">
          <Ghost className="size-6 object-contain text-black" />
        </div>
      )}
    </div>
  );
};
