'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { CarouselNavigation } from '../ui/carousel-navigation';
import { ImgSlide } from './image-slide';

interface ImageSwiperFSProps {
  images: string[];
  startIndex: number;
  onClick: () => void;
}

const ImageSwiperFS: FC<ImageSwiperFSProps> = ({ images, startIndex, onClick }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, startIndex });

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    const newIdx = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIdx);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onSelect();
    }, 0);

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      clearTimeout(timeoutId);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  return createPortal(
    <div
      className="fixed top-0 right-0 bottom-0 left-0 z-50 w-full cursor-zoom-out items-center backdrop-blur-sm backdrop-brightness-50"
      onClick={onClick}
    >
      <div className="group relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {images.map((img) => (
              <ImgSlide image={img} key={img} isFS />
            ))}
          </div>
        </div>

        {images.length > 1 && <CarouselNavigation images={images} scrollTo={scrollTo} selectedIndex={selectedIndex} />}
      </div>
    </div>,
    document.body,
  );
};

interface ImageSwiperProps {
  images: string[];
}

export const ImageSwiper: FC<ImageSwiperProps> = ({ images }) => {
  const [isFS, setIsFS] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    const newIdx = emblaApi.selectedScrollSnap();
    setSelectedIndex(newIdx);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onSelect();
    }, 0);

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      clearTimeout(timeoutId);
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  const imgsNormalized = useMemo(() => {
    return images.length ? images : [''];
  }, [images]);

  useEffect(() => {
    if (isFS) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFS]);

  const canFS = images.length > 0;

  return (
    <>
      <div
        className="group relative cursor-zoom-in"
        onClick={() => {
          if (!canFS) {
            return;
          }

          setIsFS(true);
        }}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {imgsNormalized.map((img) => (
              <ImgSlide image={img} key={img} />
            ))}
          </div>
        </div>

        {imgsNormalized.length > 1 && (
          <CarouselNavigation images={imgsNormalized} scrollTo={scrollTo} selectedIndex={selectedIndex} />
        )}
      </div>

      {isFS && (
        <ImageSwiperFS
          images={imgsNormalized}
          startIndex={selectedIndex}
          onClick={() => {
            setIsFS(false);
          }}
        />
      )}
    </>
  );
};
