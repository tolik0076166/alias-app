import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useLocalSearchParams } from "expo-router";
import { endTurn, goBackTurn, setLastRoute } from "../store/gameSlice";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "./i18n/LanguageContext";   

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function GameScreen() {
  const { t }       = useLanguage();                          // 🆕
  const insets      = useSafeAreaInsets();
  const dispatch    = useDispatch();
  const router      = useRouter();
  const { restore } = useLocalSearchParams();

  /* ───── Redux дані ───── */
  const teams            = useSelector((s: any) => s.game.teams);
  const words            = useSelector((s: any) => s.game.words);
  const currentTeamIndex = useSelector((s: any) => s.game.currentTeamIndex);
  const currentWordIndex = useSelector((s: any) => s.game.currentWordIndex);
  const roundTurns       = useSelector((s: any) => s.game.roundTurns);
  const history          = useSelector((s: any) => s.game.history);

  /* ───── derived дані ───── */
  const currentTeam = teams[currentTeamIndex] || t("game.noTeams");         // 🆕
  const currentWord = words[currentWordIndex] || t("game.noWords");         // 🆕

  /* ───── локальний state ───── */
  const [isWordVisible, setIsWordVisible] = useState(true);

  /* підказки Show/Tell беремо з i18n і кешуємо */
  const prompts = useMemo(
    () => [t("game.prompt.show"), t("game.prompt.tell")], [t]
  );
  const [currentPrompt, setCurrentPrompt] = useState(prompts[0]);

  const translateX = useRef(new Animated.Value(0)).current;

  /* ─── ефекти ─── */
  useEffect(() => {
    /* змінюємо підказку при кожному новому слові */
    setCurrentPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  }, [currentWordIndex, prompts]);

  useEffect(() => {
    if (restore === "true" && history.length > 0) dispatch(goBackTurn());
  }, [restore]);

  /* ─── колбеки ─── */
  const handleNext = () => {
    dispatch(endTurn());
    if (roundTurns + 1 >= teams.length) router.push("/score-award");
    else setIsWordVisible(true);
  };

  const handleBack = () => {
    if (currentTeamIndex === 0) return;
    dispatch(goBackTurn());
    setIsWordVisible(true);
  };

  const handleMenu            = () => { dispatch(setLastRoute("/game-screen")); router.push("/"); };
  const toggleWordVisibility  = () => setIsWordVisible(!isWordVisible);
  const isBackAvailable       = currentTeamIndex > 0;

  /* ─── жест «назад» ─── */
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dx > 20 && isBackAvailable,
    onPanResponderMove: Animated.event([null, { dx: translateX }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (g.dx > 50 && isBackAvailable) {
        handleBack();
        Animated.timing(translateX, { toValue: 0, duration: 150, useNativeDriver: true }).start();
      } else {
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true }).start();
      }
    },
  });

  /* ─── UI ─── */
  return (
    <ImageBackground
      source={require("../assets/images/imege6.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <Animated.View
        style={[styles.overlay, { transform: [{ translateX }] }]}
        {...(isBackAvailable ? panResponder.panHandlers : {})}
      >
        <View style={{ height: insets.top }} />

        {/* ─── header ─── */}
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
              <Text style={styles.menuButtonText}>{t("game.menu")}</Text> {/* 🆕 */}
            </TouchableOpacity>
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{currentTeam}</Text>
          </View>

          <View style={styles.headerSide}>
            {isBackAvailable && (
              <TouchableOpacity style={styles.backIconButton} onPress={handleBack}>
                <Feather name="chevron-left" size={28} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ─── word card ─── */}
        <View style={styles.wordContainer}>
          <TouchableOpacity style={styles.card} onPress={toggleWordVisibility}>
            {isWordVisible ? (
              <>
                <Text style={styles.promptText}>{currentPrompt}</Text>
                <Text style={styles.cardText}>{currentWord}</Text>
              </>
            ) : (
              <Image source={require("../assets/images/icon3.jpg")} style={styles.hiddenImage} />
            )}
          </TouchableOpacity>
        </View>

        {/* ─── Next ─── */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{t("game.next")}</Text> {/* 🆕 */}
        </TouchableOpacity>
      </Animated.View>
    </ImageBackground>
  );
}

/* ───────────────── styles ───────────────── */
const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay:    { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },

  /* хедер */
  header: {
    height: 56,
    backgroundColor: "rgba(255,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  headerSide:   { width: 70, alignItems: "center", justifyContent: "center", height: "100%" },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },

  menuButton:     { paddingHorizontal: 10, paddingVertical: 5 },
  menuButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16, textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  headerTitle:    { fontSize: 20, color: "#fff", fontWeight: "bold", textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  backIconButton: { padding: 5 },

  /* карточка */
  wordContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: 250, height: 350,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10, justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 2, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  promptText: { fontSize: 22, color: "#ff0", marginBottom: 10, fontWeight: "bold", textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  cardText:   { fontSize: 36, color: "#fff", textAlign: "center", textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
  hiddenImage:{ flex: 1, width: "100%", height: "100%" },

  /* кнопка Next */
  nextButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
  },
  nextButtonText: { fontSize: 18, color: "#fff", fontWeight: "600", textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
});
