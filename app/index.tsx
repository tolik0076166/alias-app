import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { resetGame } from "../store/gameSlice";

/**
 * Главный экран ("/") — с фоном и гламурным стилем
 */
export default function MainMenuScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Достаём lastRoute из Redux, чтобы показывать «Continue»
  const lastRoute = useSelector((state: any) => state.game.lastRoute);
  const hasActiveGame = lastRoute !== null;

  const handleNewGame = () => {
    // Сброс игры
    dispatch(resetGame());
    // Переходим к выбору команд
    router.push("/teams");
  };

  const handleContinue = () => {
    if (lastRoute) {
      router.push(lastRoute);
    }
  };

  const handleHowToPlay = () => {
    // Либо переходим на экран правил, либо открываем модалку
    // router.push("/how-to-play");
    console.log("Show how to play...");
  };

  return (
    // Фоновое изображение
    <ImageBackground
      source={require("../assets/images/woman.jpg")} // <-- ваш файл
      style={styles.background}
      resizeMode="cover"
    >
      {/* Полупрозрачный тёмный слой поверх картинки */}
      <View style={styles.overlay}>
        <Text style={styles.title}>Alias</Text>

        {hasActiveGame && (
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleNewGame}>
          <Text style={styles.buttonText}>New Game</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.howToPlayBtn]}
          onPress={handleHowToPlay}
        >
          <Text style={styles.buttonText}>How to play</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    // Изображение растягивается на весь экран
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)", // тёмный прозрачный налёт
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    color: "#ffcccc", // светлый красный/розовый
    fontWeight: "bold",
    marginBottom: 50,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  button: {
    backgroundColor: "rgba(255,0,0,0.8)",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginVertical: 10,
    width: "70%",
    alignItems: "center",
  },
  howToPlayBtn: {
    backgroundColor: "rgba(255,0,0,0.6)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
