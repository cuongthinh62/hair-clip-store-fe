import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ProductGalleryProps {
  images: string[];
  name: string;
  className?: string;
}

export function ProductGallery({ images, name, className }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const currentImage = images[active] ?? images[0];

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-3xl border border-border/70 bg-cream shadow-soft">
        {currentImage ? (
          <img
            src={currentImage}
            alt={name}
            width={1024}
            height={1024}
            className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="mt-4 flex gap-3">
          {images.map((img, i) => (
            <button
              key={`${img}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              className={cn(
                "h-20 w-20 overflow-hidden rounded-xl border-2 bg-cream transition-all duration-300 sm:h-24 sm:w-24",
                i === active ? "border-rose" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <img
                src={img}
                alt={`${name} - ảnh ${i + 1}`}
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

