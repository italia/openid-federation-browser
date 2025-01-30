import it from "../assets/localization/it.json";
import en from "../assets/localization/en.json";

export const getTranslations = (lang: string): Record<string, string> => {
  switch (lang) {
    case "it":
    case "it-IT":
      return it;
    default:
      return en;
  }
};
