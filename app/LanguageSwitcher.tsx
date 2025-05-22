import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useLanguage } from "./i18n/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, changeLang } = useLanguage();

  // При каждом нажатии «переключаем» язык
  const toggle = () => changeLang(lang === "en" ? "uk" : "en");

  return (
    <TouchableOpacity onPress={toggle} style={styles.btn}>
      <Text style={styles.text}>{lang === "en" ? "UK" : "EN"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#888",
    alignSelf: "flex-end",
    marginRight: 12,
    marginTop: 6,
  },
  text: { fontWeight: "bold" },
});
