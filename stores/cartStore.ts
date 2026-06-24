// src/stores/cartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
    id: string;
    productoId: string;
    nombre: string;
    precio: number;
    imagen: string;
    cantidad: number;
    tiendaId: string;
    tiendaNombre: string;
}

interface CartStore {
    items: CartItem[];
    total: number;
    tiendaId: string | null;

    addItem: (item: Omit<CartItem, 'cantidad'> & { cantidad?: number }) => void;
    removeItem: (productoId: string) => void;
    updateQuantity: (productoId: string, cantidad: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
    getTiendaId: () => string | null;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            tiendaId: null,

            addItem: (newItem) => {
                const { items, tiendaId } = get();
                const { productoId, cantidad = 1, tiendaId: itemTiendaId } = newItem;

                // Si es de otra tienda, preguntar si quiere vaciar carrito
                if (tiendaId && tiendaId !== itemTiendaId) {
                    if (!confirm('¿Quieres vaciar el carrito y agregar productos de otra tienda?')) {
                        return;
                    }
                    set({ items: [], tiendaId: null });
                }

                const existingItem = items.find(item => item.productoId === productoId);

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            item.productoId === productoId
                                ? { ...item, cantidad: item.cantidad + cantidad }
                                : item
                        ),
                        tiendaId: tiendaId || itemTiendaId,
                    });
                } else {
                    set({
                        items: [
                            ...items,
                            {
                                ...newItem,
                                cantidad,
                            },
                        ],
                        tiendaId: tiendaId || itemTiendaId,
                    });
                }
            },

            removeItem: (productoId) => {
                set((state) => ({
                    items: state.items.filter(item => item.productoId !== productoId),
                }));
            },

            updateQuantity: (productoId, cantidad) => {
                if (cantidad <= 0) {
                    get().removeItem(productoId);
                    return;
                }
                set((state) => ({
                    items: state.items.map(item =>
                        item.productoId === productoId
                            ? { ...item, cantidad }
                            : item
                    ),
                }));
            },

            clearCart: () => {
                set({ items: [], tiendaId: null });
            },

            getTotal: () => {
                const { items } = get();
                return items.reduce((total, item) => total + item.precio * item.cantidad, 0);
            },

            getItemCount: () => {
                const { items } = get();
                return items.reduce((count, item) => count + item.cantidad, 0);
            },

            getTiendaId: () => {
                return get().tiendaId;
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);