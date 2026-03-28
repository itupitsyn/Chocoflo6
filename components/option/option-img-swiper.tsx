import useEmblaCarousel from 'embla-carousel-react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { CarouselNavigation } from '../ui/carousel-navigation';
import { OptionImgSlide } from './option-img-slide';

interface OptionImgSwiperProps {
  images: string[];
}

export const OptionImgSwiper: FC<OptionImgSwiperProps> = ({ images }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  return (
    <div className="group relative cursor-zoom-in">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {imgsNormalized.map((img) => (
            <OptionImgSlide image={img} key={img} />
          ))}
        </div>
      </div>

      {imgsNormalized.length > 1 && (
        <CarouselNavigation images={imgsNormalized} scrollTo={scrollTo} selectedIndex={selectedIndex} />
      )}
    </div>
  );
};
