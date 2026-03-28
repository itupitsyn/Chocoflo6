import { FC } from 'react';

import { cn } from '@/lib/utils';

interface NavigationProps {
  images: string[];
  selectedIndex: number;
  scrollTo: (idx: number) => void;
}

export const CarouselNavigation: FC<NavigationProps> = ({ images, selectedIndex, scrollTo }) => {
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
