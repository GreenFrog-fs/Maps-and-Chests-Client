import { create } from "zustand";
import { findUser } from "../apiActions/findUser";
import { saveUser } from "../apiActions/saveUser";

const useUserStore = create((set, get) => ({
  id: window?.Telegram?.WebApp?.initDataUnsafe?.user?.id || 1,
  user: null,
  position: [],
  closestChest: null,
  getUser: async () => {
    const { id } = get();
    try {
      const user = await findUser(id);
      set({ user });
    } catch (error) {
      const user = await saveUser(id);
      set({ user });
    }
  },
  setPosition: (position) => {
    set({ position });
  },
  setClosestChest: (chest) => {
    set({ closestChest: chest });
  },
}));

export default useUserStore;
