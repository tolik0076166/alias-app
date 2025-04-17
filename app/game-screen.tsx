import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  Platform,
  StatusBar,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, useLocalSearchParams } from "expo-router";
import { endTurn, goBackTurn, setLastRoute } from "../store/gameSlice";
import { Feather } from "@expo/vector-icons";

const SCREEN_WIDTH = Dimensions.get("window").width;
const prompts = ["Покажи", "Расскажи"];

export default function GameScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { restore } = useLocalSearchParams();

  const teams = useSelector((state: any) => state.game.teams);
  const words = useSelector((state: any) => state.game.words);
  const currentTeamIndex = useSelector((state: any) => state.game.currentTeamIndex);
  const currentWordIndex = useSelector((state: any) => state.game.currentWordIndex);
  const roundTurns = useSelector((state: any) => state.game.roundTurns);
  const history = useSelector((state: any) => state.game.history);

  const currentTeam = teams[currentTeamIndex] || "No teams";
  const currentWord = words[currentWordIndex] || "Слова закончились";

  const [isWordVisible, setIsWordVisible] = useState(true);
  const [currentPrompt, setCurrentPrompt] = useState("Покажи");

  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const newPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(newPrompt);
  }, [currentWordIndex]);

  useEffect(() => {
    if (restore === "true" && history.length > 0) {
      dispatch(goBackTurn());
    }
  }, [restore]);

  const handleNext = () => {
    dispatch(endTurn());
    const newRoundTurns = roundTurns + 1;
    if (newRoundTurns >= teams.length) {
      router.push("/score-award");
    } else {
      setIsWordVisible(true);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    dispatch(goBackTurn());
    setIsWordVisible(true);
  };

  const handleMenu = () => {
    dispatch(setLastRoute("/game-screen"));
    router.push("/");
  };

  const toggleWordVisibility = () => {
    setIsWordVisible(!isWordVisible);
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx > 20,
    onPanResponderMove: Animated.event([null, { dx: translateX }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        handleBack();
        Animated.timing(translateX, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const isFirstTurn = currentTeamIndex === 0 && currentWordIndex === 0 && history.length === 0;

  return (
    <ImageBackground
      source={require("../assets/images/imege6.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <Animated.View
        style={[styles.overlay, { transform: [{ translateX }] }]}
        {...(!isFirstTurn ? panResponder.panHandlers : {})}
      >
        <View style={styles.notchSpacer} />

        <View style={styles.header}>
          <View style={styles.headerSide}>
            <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
              <Text style={styles.menuButtonText}>Menu</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{currentTeam}</Text>
          </View>

          <View style={styles.headerSide}>
            {!isFirstTurn && (
              <TouchableOpacity style={styles.backIconButton} onPress={handleBack}>
                <Feather name="chevron-left" size={28} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.wordContainer}>
          <TouchableOpacity style={styles.card} onPress={toggleWordVisibility}>
            {isWordVisible ? (
              <>
                <Text style={styles.promptText}>{currentPrompt}</Text>
                <Text style={styles.cardText}>{currentWord}</Text>
              </>
            ) : (
              <Image
                source={require("../assets/images/icon3.jpg")}
                style={styles.hiddenImage}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </Animated.View>
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
  },
  notchSpacer: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 50,
    backgroundColor: "transparent",
  },
  header: {
    height: 56,
    backgroundColor: "rgba(255,0,0,0.7)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  headerSide: {
    width: 70,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  menuButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  backIconButton: {
    padding: 5,
  },
  wordContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 250,
    height: 350,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 10,
    padding: 0,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  promptText: {
    fontSize: 22,
    color: "#ff0",
    marginBottom: 10,
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardText: {
    fontSize: 36,
    color: "#fff",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    textAlign: "center",
  },
  hiddenImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  nextButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
