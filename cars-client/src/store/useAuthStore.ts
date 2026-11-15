import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../models/Auth';

interface AuthStore {
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null }),
        }),
        {
            name: 'cars-auth-store',
        },
    ),
);