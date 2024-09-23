import { create } from "zustand";
import { findUser } from "../apiActions/findUser";
import { saveUser } from "../apiActions/saveUser";

const useUserStore = create((set, get) => ({
  id: window?.Telegram?.WebApp?.initDataUnsafe?.user?.id ? "" + window?.Telegram?.WebApp?.initDataUnsafe?.user?.id : "123",
  user: null,
  position: [],
  closestChest: null,
  avatar_src: "/models/user1.glb",
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
  setAvatarSrc: (src) => {
    set({ avatar_src: src });
  },
}));

export default useUserStore;
