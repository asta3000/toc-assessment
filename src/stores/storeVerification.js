import { create } from "zustand";

const initial = {
  id: null,
  organizationId: null,
  organization: null,
  yearId: null,
  year: null,
  assessmentId: null,
  assessment: null,
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
