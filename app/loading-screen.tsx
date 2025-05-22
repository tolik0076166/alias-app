console.log('⏳ Loading mounted');
import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

/**
 * LoadingScreen – полноэкранный экран загрузки.
 * 1. Использует заданное изображение (без правок в самом файле).
 * 2. Закрашивает нижнюю область, где была надпись «Loading…».
 * 3. Отрисовывает аккуратный индикатор (ActivityIndicator) по центру этой области.
 * 4. Через 1,5 с. делает router.replace("/").
 *
 * Замените таймер своей реальной логикой (шрифты, запросы и т.д.).
 */
export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/image7.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Прозрачный оверлей на весь экран (слегка затемняет фон) */}
      <View style={styles.shadowOverlay} />

      {/* Нижняя тёмная плашка закрывает старую надпись */}
      <View style={styles.bottomMask} />

      {/* Индикатор загрузки – строго поверх плашки */}
      <ActivityIndicator style={styles.loader} size="large" color="#FF3737" />
    </ImageBackground>
  
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  shadowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  bottomMask: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  loader: {
    position: "absolute",
    bottom: 60, // по центру плашки
    left: 0,
    right: 0,
  },
});
