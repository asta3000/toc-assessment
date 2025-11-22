import { create } from "zustand";

const initial = {
  id: null,
  name: null,
  abstract: null,
  goal: null,
  content: null,
  statusId: null,
  year: null,
  assessmentId: null,
};

export const useAssessmentStore = create((set) => ({
  assessment: initial,
  storeAssessment: (data) => {
    set(() => ({
      assessment: data,
    }));
  },
  clearAssessment: () => {
    set(() => ({
      assessment: initial,
    }));
  },
}));
