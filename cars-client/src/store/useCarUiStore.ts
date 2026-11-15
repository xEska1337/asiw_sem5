import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CarUiStore {
    searchTerm: string;
    showFavoritesOnly: boolean;
    favoriteCarIdsByUser: Record<string, string[]>;

    setSearchTerm: (value: string) => void;
    setShowFavoritesOnly: (value: boolean) => void;
    toggleFavorite: (userId: string, carId: string) => void;
    removeFavorite: (userId: string, carId: string) => void;
    clearFavorites: (userId: string) => void;
}

export const useCarUiStore = create<CarUiStore>()(
    persist(
        (set) => ({
            searchTerm: '',
            showFavoritesOnly: false,
            favoriteCarIdsByUser: {},

            setSearchTerm: (value) => set({ searchTerm: value }),

            setShowFavoritesOnly: (value) => set({ showFavoritesOnly: value }),

            toggleFavorite: (userId, carId) =>
                set((state) => {
                    const current = state.favoriteCarIdsByUser[userId] ?? [];
                    const updated = current.includes(carId)
                        ? current.filter((id) => id !== carId)
                        : [...current, carId];

                    return {
                        favoriteCarIdsByUser: {
                            ...state.favoriteCarIdsByUser,
                            [userId]: updated,
                        },
                    };
                }),

            removeFavorite: (userId, carId) =>
                set((state) => {
                    const current = state.favoriteCarIdsByUser[userId] ?? [];
                    return {
                        favoriteCarIdsByUser: {
                            ...state.favoriteCarIdsByUser,
                            [userId]: current.filter((id) => id !== carId),
                        },
                    };
                }),

            clearFavorites: (userId) =>
                set((state) => ({
                    favoriteCarIdsByUser: {
                        ...state.favoriteCarIdsByUser,
                        [userId]: [],
                    },
                })),
        }),
        {

            name: 'cars-ui-store-v2',
            partialize: (state) => ({
                favoriteCarIdsByUser: state.favoriteCarIdsByUser,
            }),
        },
    ),
);