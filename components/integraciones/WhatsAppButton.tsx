// src/components/integraciones/WhatsAppButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface WhatsAppButtonProps {
    numero: string;
    mensaje?: string;
    className?: string;
    floating?: boolean;
}

export function WhatsAppButton({
    numero,
    mensaje = "Hola! Vengo de tu tienda online",
    className,
    floating = false
}: WhatsAppButtonProps) {
    const handleClick = () => {
        const url = `https://wa.me/${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    };

    if (floating) {
        return (
            <Button
                onClick={handleClick}
                className={cn(
                    "fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg",
                    "bg-green-500 hover:bg-green-600 transition-all hover:scale-110",
                    className
                )}
            >
                <MessageCircle className="h-6 w-6" />
            </Button>
        );
    }

    return (
        <Button
            onClick={handleClick}
            className={cn("gap-2 bg-green-500 hover:bg-green-600", className)}
        >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
        </Button>
    );
}