import { create } from "zustand";

const initial = {
  email: "",
  role: "",
  firstname: "",
  lastname: "",
  organizationId: "",
  id: "",
  mobile: "",
  position: "",
  gender: "",
  status: "",
};

export const useUserStore = create((set) => ({
  user: initial,
  storeUser: (data) => {
    set(() => ({
      user: data,
    }));
  },
  clearUser: () => {
    set(() => ({
      user: initial,
    }));
  },
}));
