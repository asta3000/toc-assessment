import lodash from "lodash";

import mn from "@/translations/mn.json";
import en from "@/translations/en.json";
import { useSystemStore } from "@/stores/storeSystem";

export const useTranslation = () => {
  const language = useSystemStore((state) => state.system.language);

  return (value) => {
    switch (language) {
      case "mn":
        return lodash.get(mn, value, value);
      case "en":
        return lodash.get(en, value, value);
    }
  };
};
