import axios from "axios";
import { create } from "zustand";
import { url } from "../constants";

const useShopStore = create((set) => ({
  avatars: [],
  getAvatars: async () => {
    const avatars = await axios.get(`${url}/avatars/all`);
    console.log(avatars);
    set({ avatars: ["user1", "user2", "user3"] });
  },
}));

export default useShopStore;
