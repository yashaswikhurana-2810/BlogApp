import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,      // { id, name, email }
      token: null,
      refreshToken: null,

      setAuth: (user, token, refreshToken = null) => set({ user, token, refreshToken }),

      logout: () => set({ user: null, token: null, refreshToken: null }),

      isAuthenticated: () => {
        // Derived value — call inside components
        return false; // base value; use selector in components
      },
    }),
    {
      name: 'blogapp-auth', // localStorage key
      partialize: (state) => ({ user: state.user, token: state.token, refreshToken: state.refreshToken }),
    }
  )
);
