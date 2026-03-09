'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';

import { ImgSlide } from './image-slide';

interface NavigationProps {
  images: string[];
  selectedIndex: number;
  scrollTo: (idx: number) => void;
}

const Navigation: FC<NavigationProps> = ({ images, selectedIndex, scrollTo }) => {
  return (
    <div className="absolute right-0 bottom-4 left-0 flex justify-center gap-2">
      {images.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollTo(index)}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            index === selectedIndex ? 'w-6 bg-fuchsia-700 shadow-md' : 'w-2 bg-fuchsia-700/50',
          )}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

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

        {images.length > 1 && <Navigation images={images} scrollTo={scrollTo} selectedIndex={selectedIndex} />}
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
          <Navigation images={imgsNormalized} scrollTo={scrollTo} selectedIndex={selectedIndex} />
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
