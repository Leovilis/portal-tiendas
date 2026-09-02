// src/components/providers/CartProvider.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { CartItem } from "@/lib/types/cart.types";

const STORAGE_KEY = "portaltiendas:carrito";

interface CartContextValue {
    items: CartItem[];
    cantidadTotal: number;
    subtotal: number;
    agregarItem: (item: Omit<CartItem, "cantidad">, cantidad?: number) => void;
    quitarItem: (productoId: string) => void;
    actualizarCantidad: (productoId: string, cantidad: number) => void;
    vaciarCarrito: () => void;
    hidratado: boolean;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hidratado, setHidratado] = useState(false);

    // Cargar el carrito guardado una vez, en el cliente.
    useEffect(() => {
        try {
            const guardado = window.localStorage.getItem(STORAGE_KEY);
            if (guardado) {
                // Carga única del carrito persistido al montar en el cliente: es
                // necesaria para evitar un mismatch de hidratación SSR/cliente
                // (no se puede leer localStorage durante el render en servidor).
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setItems(JSON.parse(guardado));
            }
        } catch {
            // localStorage no disponible o JSON corrupto: arrancamos con carrito vacío.
        } finally {
            setHidratado(true);
        }
    }, []);

    // Persistir cada cambio, pero solo después de la carga inicial (para no
    // pisar lo guardado con un array vacío antes de hidratar).
    useEffect(() => {
        if (!hidratado) return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Ignorar errores de cuota/almacenamiento.
        }
    }, [items, hidratado]);

    const agregarItem: CartContextValue["agregarItem"] = (item, cantidad = 1) => {
        setItems((prev) => {
            const existente = prev.find((i) => i.productoId === item.productoId);
            if (existente) {
                const nuevaCantidad = Math.min(existente.stock, existente.cantidad + cantidad);
                return prev.map((i) =>
                    i.productoId === item.productoId ? { ...i, cantidad: nuevaCantidad } : i
                );
            }
            return [...prev, { ...item, cantidad: Math.min(item.stock, Math.max(1, cantidad)) }];
        });
    };

    const quitarItem = (productoId: string) => {
        setItems((prev) => prev.filter((i) => i.productoId !== productoId));
    };

    const actualizarCantidad = (productoId: string, cantidad: number) => {
        setItems((prev) =>
            cantidad <= 0
                ? prev.filter((i) => i.productoId !== productoId)
                : prev.map((i) =>
                      i.productoId === productoId
                          ? { ...i, cantidad: Math.min(i.stock, cantidad) }
                          : i
                  )
        );
    };

    const vaciarCarrito = () => setItems([]);

    const cantidadTotal = useMemo(() => items.reduce((acc, i) => acc + i.cantidad, 0), [items]);
    const subtotal = useMemo(
        () => items.reduce((acc, i) => acc + (i.precioOferta ?? i.precio) * i.cantidad, 0),
        [items]
    );

    return (
        <CartContext.Provider
            value={{
                items,
                cantidadTotal,
                subtotal,
                agregarItem,
                quitarItem,
                actualizarCantidad,
                vaciarCarrito,
                hidratado,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart debe usarse dentro de un <CartProvider>");
    }
    return context;
}
