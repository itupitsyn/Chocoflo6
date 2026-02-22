'use client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { CSSProperties, FC, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import { cn } from '@/lib/utils';

import { ImgSlide } from './image-slide';

interface ImageSwiperProps {
  images: string[];
}

export const ImageSwiper: FC<ImageSwiperProps> = ({ images }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isFS, setIsFS] = useState(false);

  const imgsNormalized = useMemo(() => {
    return images.length ? images : [''];
  }, [images]);

  const canFS = images.length > 0;

  if (isFS) {
    return createPortal(
      <div
        className="fixed top-0 right-0 bottom-0 left-0 z-50 flex w-full cursor-zoom-out items-center backdrop-blur-sm backdrop-brightness-50"
        onClick={() => {
          setIsFS(false);
        }}
      >
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={5}
          slidesPerView={1}
          initialSlide={activeSlide}
          onActiveIndexChange={(swiper) => setActiveSlide(swiper.activeIndex)}
          style={
            {
              '--swiper-pagination-color': 'var(--color-fuchsia-700)',
            } as CSSProperties
          }
          pagination={{ clickable: true }}
          centeredSlides
          className="flex"
        >
          {imgsNormalized.map((img) => (
            <SwiperSlide key={img} className="!h-full self-stretch">
              <ImgSlide image={img} isFS />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>,
      document.body,
    );
  }

  return (
    <div
      className={cn('w-full', canFS && 'cursor-zoom-in')}
      onClick={() => {
        if (!canFS) {
          return;
        }

        setIsFS(true);
      }}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={5}
        slidesPerView={1}
        onActiveIndexChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        style={
          {
            '--swiper-pagination-color': 'var(--color-fuchsia-700)',
          } as CSSProperties
        }
        pagination={{ clickable: true }}
        centeredSlides
        className="flex"
      >
        {imgsNormalized.map((img) => (
          <SwiperSlide key={img} className="!h-auto self-stretch">
            <ImgSlide image={img} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
