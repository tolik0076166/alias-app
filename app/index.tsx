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

import { useLanguage } from "./i18n/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";

/**
 * Главный экран ("/") — меню игры
 */
export default function MainMenuScreen() {
  const { t } = useLanguage();           // 👈 переводчик
  const dispatch = useDispatch();
  const router = useRouter();

  // lastRoute → «Continue»
  const lastRoute = useSelector((state: any) => state.game.lastRoute);
  const hasActiveGame = lastRoute !== null;

  const handleNewGame = () => {
    dispatch(resetGame());
    router.push("/teams");
  };

  const handleContinue = () => {
    if (lastRoute) router.push(lastRoute);
  };

  const handleHowToPlay = () => router.push("/how-to-play");

  return (
    <ImageBackground
      source={require("../assets/images/woman.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* переключатель EN/UK в правом верхнем углу */}
        <LanguageSwitcher />

        <Text style={styles.title}>{t("menu.title")}</Text>

        {hasActiveGame && (
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>{t("menu.continue")}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleNewGame}>
          <Text style={styles.buttonText}>{t("menu.newGame")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.howToPlayBtn]}
          onPress={handleHowToPlay}
        >
          <Text style={styles.buttonText}>{t("menu.howToPlay")}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    color: "#ffcccc",
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
