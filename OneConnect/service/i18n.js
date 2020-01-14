import I18n from "react-native-i18n";
import en from "../locales/en";
import th from "../locales/th";
import Manager from "./dataManager";
import AsyncStorage from "@react-native-community/async-storage";

I18n.fallbacks = true;

I18n.translations = {
  en,
  th
};

I18n.locale =
  AsyncStorage.getItem("@locale") != null &&
  AsyncStorage.getItem("@locale") == "th"
    ? "th"
    : "en";

export const UpdateLocale = locale => {
  I18n.locale = locale;
};

export const SaveLocale = locale => {
  I18n.locale = locale;
  AsyncStorage.setItem("@locale", locale)
    .then(response => Manager.emitEvent("LANG_U"))
    .catch(error => console.log("locale not saved"));
};

export default I18n;
