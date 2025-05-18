import { create } from "zustand";
import { useEffect } from "react";

interface AuthStore {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  token: null,

  setToken: (token) => {
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("token");
      }
    }
    set({ token });
  },

  clearToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ token: null });
  },
}));

export const useAuthInitializer = () => {
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [setToken]);
};

export default useAuthStore;
