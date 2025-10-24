import { create } from "zustand";

const initial = {
  id: null,
  organizationId: null,
  yearId: null,
  assessmentId: null,
  cycle: 0,
  isVerified: false,
  statusId: null,
};

export const useVerificationStore = create((set) => ({
  verification: initial,
  storeVerification: (data) => {
    set(() => ({
      verification: data,
    }));
  },
  clearVerification: () => {
    set(() => ({
      verification: initial,
    }));
  },
}));
