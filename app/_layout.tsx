import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "../store/store";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

// i18n
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext";

// words & action
import enWords from "../assets/data/words_en.json";
import uaWords from "../assets/data/words_ua.json";
import { loadWords } from "../store/gameSlice";

/* ─────────────────────────── helpers ─────────────────────────── */
function WordsLoader() {
  const { lang } = useLanguage(); // 'en' | 'ua'
  const dispatch = useDispatch();

  useEffect(() => {
    const words = lang === "en" ? enWords : uaWords;
    dispatch(loadWords(words));
  }, [lang, dispatch]);

  return null; // не відображає UI
}

/* ─────────────────────────── layout ──────────────────────────── */
export default function RootLayout() {
  return (
    <Provider store={store}>
      <LanguageProvider>
        <SafeAreaProvider>
          {/* підвантажуємо слова один раз і при зміні мови */}
          <WordsLoader />

          <Stack
            initialRouteName="loading-screen"
            screenOptions={{
              headerShown: false,
              animation: "slide_from_right",
              gestureEnabled: true,
            }}
          >
            {/* 1️⃣ Loading */}
            <Stack.Screen
              name="loading-screen"
              options={{ gestureEnabled: false, animation: "none", headerShown: false }}
            />

            {/* 2️⃣ Home */}
            <Stack.Screen
              name="index"
              options={{ gestureEnabled: false, animation: "none", headerShown: false }}
            />

            {/* 3️⃣ Teams */}
            <Stack.Screen
              name="teams"
              options={{ gestureEnabled: false, animation: "none", headerShown: false }}
            />

            {/* 4️⃣ Game */}
            <Stack.Screen
              name="game-screen"
              options={{ gestureEnabled: false, animation: "slide_from_right", headerShown: false }}
            />

            {/* далі додавайте інші екрани */}
          </Stack>
        </SafeAreaProvider>
      </LanguageProvider>
    </Provider>
  );
}
