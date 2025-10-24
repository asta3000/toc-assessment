import { create } from "zustand";

const initial = {
  language: "mn",
  year: null,
  yearId: null,
};

export const useSystemStore = create((set, get) => ({
  system: initial,
  storeYear: (data) => {
    set(() => ({
      system: {
        ...get().system,
        year: data.year,
        yearId: data.yearId,
      },
    }));
  },
  storeLanguage: (data) => {
    set(() => ({
      system: {
        ...get().system,
        language: data.language,
      },
    }));
  },
  clearSystem: () => {
    set(() => ({
      system: initial,
    }));
  },
}));
