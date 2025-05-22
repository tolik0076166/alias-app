import React, { useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, Stack } from "expo-router";
import { setLastRoute, undoLastAward } from "../store/gameSlice";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "./i18n/LanguageContext";              // 🆕 i18n

const SCREEN_WIDTH = Dimensions.get("window").width;

interface TeamScore { team: string; score: number }

export default function RoundIntroScreen() {
  const { t }       = useLanguage();                               // 🆕
  const insets      = useSafeAreaInsets();
  const dispatch    = useDispatch();
  const router      = useRouter();

  const teams       = useSelector((s: any) => s.game.teams)   as string[];
  const scores      = useSelector((s: any) => s.game.scores)  as number[];
  const roundNumber = useSelector((s: any) => s.game.roundNumber) as number;
  const currentTeam = teams[useSelector((s: any) => s.game.currentTeamIndex)] || "Team X";

  const teamsWithScores: TeamScore[] = useMemo(
    () => teams.map((t, i) => ({ team: t, score: scores[i] ?? 0 })).sort((a, b) => b.score - a.score),
    [teams, scores]
  );

  const listRef   = useRef<FlatList<TeamScore>>(null);
  const translateX= useRef(new Animated.Value(0)).current;

  /* ─── навігація ─── */
  const handleMenu = () => { dispatch(setLastRoute("/round-intro")); router.push("/"); };
  const handleLetsGo = () => router.push("/game-screen");

  const goBackToTeams = () => {
    Animated.timing(translateX,{ toValue: SCREEN_WIDTH, duration: 250, useNativeDriver: true })
            .start(() => router.replace("/teams"));
  };
  const goBackToScoreAward = () => {
    dispatch(undoLastAward());
    Animated.timing(translateX,{ toValue: SCREEN_WIDTH, duration: 250, useNativeDriver: true })
            .start(() => router.back());
  };
  const handleBack = () => roundNumber === 1 ? goBackToTeams() : goBackToScoreAward();

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dx > 20,
    onPanResponderMove: Animated.event([null, { dx: translateX }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) => {
      if (g.dx > 50) handleBack();
      else Animated.spring(translateX,{ toValue: 0, useNativeDriver: true }).start();
    },
  });

  /* ─── UI ─── */
  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />

      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/images/imege6.jpg")}
          style={styles.background}
          resizeMode="cover"
        >
          <Animated.View
            style={[styles.overlay, { transform: [{ translateX }] }]}
            {...panResponder.panHandlers}
          >
            <View style={{ height: insets.top }} />

            {/* ─── Header ─── */}
            <View style={styles.header}>
              <View style={styles.headerSide}>
                <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
                  <Text style={styles.menuButtonText}>{t("roundIntro.menu")}</Text> {/* 🆕 */}
                </TouchableOpacity>
              </View>

              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>{t("roundIntro.title")}</Text>   {/* 🆕 */}
              </View>

              <View style={styles.headerSide}>
                <TouchableOpacity style={styles.backIconButton} onPress={handleBack}>
                  <Feather name="chevron-left" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* ─── list ─── */}
            <View style={styles.listContainer}>
              <FlatList
                ref={listRef}
                data={teamsWithScores}
                keyExtractor={(item) => item.team}
                renderItem={({ item }) => (
                  <View style={styles.scoreItem}>
                    <Text style={styles.teamName}>{item.team}</Text>
                    <Text style={styles.teamPoints}>{item.score}</Text>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* ─── round info ─── */}
            <View style={styles.roundInfo}>
              <Text style={styles.roundText}>{t("roundIntro.round", { num: roundNumber })}</Text> {/* 🆕 */}
              <Text style={styles.subText}>{t("roundIntro.subtitle")}</Text>                       {/* 🆕 */}
              <Text style={styles.currentTeam}>{currentTeam}</Text>
            </View>

            {/* ─── Let's go ─── */}
            <TouchableOpacity style={styles.letsGoBtn} onPress={handleLetsGo}>
              <Text style={styles.letsGoBtnText}>{t("roundIntro.letsGo")}</Text> {/* 🆕 */}
            </TouchableOpacity>
          </Animated.View>
        </ImageBackground>
      </View>
    </>
  );
}

/* ───────────────── styles ───────────────── */
const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },

  /* хедер */
  header: {
    height: 56,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  headerSide: { width: 70, alignItems: "center", justifyContent: "center", height: "100%" },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
  menuButton: { paddingHorizontal: 10, paddingVertical: 5 },
  menuButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  headerTitle: { fontSize: 20, color: "#fff", fontWeight: "bold" },
  backIconButton: { padding: 5 },

  /* список */
  listContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  scoreItem: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  teamName: { fontSize: 16, color: "#fff" },
  teamPoints: { fontSize: 16, color: "#fff", fontWeight: "bold" },

  /* раунд‑инфо */
  roundInfo: { alignItems: "center", marginVertical: 20 },
  roundText: { fontSize: 26, color: "#fff", fontWeight: "bold" },
  subText: { fontSize: 14, color: "#fff", marginTop: 4 },
  currentTeam: { fontSize: 20, color: "#ff0", marginTop: 8, fontWeight: "600" },

  /* кнопка Let's go! */
  letsGoBtn: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 30,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
  },
  letsGoBtnText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
