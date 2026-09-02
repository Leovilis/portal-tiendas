// src/components/productos/ProductGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    imagenes: string[];
    nombre: string;
    className?: string;
}

export function ProductGallery({ imagenes, nombre, className }: ProductGalleryProps) {
    const [selected, setSelected] = useState(0);
    const imagenesSeguras = imagenes.length > 0 ? imagenes : ["https://picsum.photos/600/600?random=0"];

    const goTo = (index: number) => {
        setSelected((index + imagenesSeguras.length) % imagenesSeguras.length);
    };

    return (
        <div className={cn("space-y-3", className)}>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted group">
                <Image
                    src={imagenesSeguras[selected]}
                    alt={`${nombre} - imagen ${selected + 1}`}
                    fill
                    priority
                    className="object-cover"
                />

                {imagenesSeguras.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => goTo(selected - 1)}
                            aria-label="Imagen anterior"
                            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => goTo(selected + 1)}
                            aria-label="Imagen siguiente"
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>

                        <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
                            {selected + 1} / {imagenesSeguras.length}
                        </div>
                    </>
                )}
            </div>

            {imagenesSeguras.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {imagenesSeguras.map((img, index) => (
                        <button
                            key={img + index}
                            type="button"
                            onClick={() => setSelected(index)}
                            aria-label={`Ver imagen ${index + 1}`}
                            className={cn(
                                "relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 transition-all",
                                selected === index ? "ring-primary" : "ring-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <Image src={img} alt={`${nombre} miniatura ${index + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
