import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  FlatList,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import {
  awardPoint,
  nextRound,
  resetRound,
  setLastRoute,
} from "../store/gameSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";   /* ⬅ добавили */
import { useLanguage } from "./i18n/LanguageContext"; 

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ScoreAwardScreen() {
  const { t }    = useLanguage();                               // 🆕
  const insets   = useSafeAreaInsets();
  const dispatch = useDispatch();
  const router   = useRouter();

  const teams  = useSelector((s: any) => s.game.teams);
  const scores = useSelector((s: any) => s.game.scores);

  const [selectedTeamIndex, setSelectedTeamIndex] = useState<number | null>(null);
  const listRef    = useRef<FlatList>(null);
  const translateX = useRef(new Animated.Value(0)).current;

  /* reset selection on focus */
  useFocusEffect(
    useCallback(() => {
      setSelectedTeamIndex(null);
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
      return () => {};
    }, [])
  );

  /* ─── навігація ─── */
  const handleMenu = () => { dispatch(setLastRoute("/score-award")); router.push("/"); };

  const handleAwardPoint = () => {
    if (selectedTeamIndex === null) {
      Alert.alert(t("scoreAward.errorT"), t("scoreAward.errorMsg"));     // 🆕
      return;
    }
    dispatch(awardPoint(selectedTeamIndex));
    dispatch(nextRound());
    dispatch(resetRound());
    router.push("/round-intro");
  };

  const handleBack = () => {
    Animated.timing(translateX,{ toValue: SCREEN_WIDTH, duration: 300, useNativeDriver: true })
            .start(() => router.push({ pathname: "/game-screen", params: { restore: "true" } }));
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => g.dx > 20,
    onPanResponderMove: Animated.event([null, { dx: translateX }], { useNativeDriver: false }),
    onPanResponderRelease: (_, g) =>
      g.dx > 50 ? handleBack() : Animated.spring(translateX,{ toValue: 0, useNativeDriver: true }).start(),
  });

  /* ─── рендер команди ─── */
  const renderTeamItem = ({ item, index }: { item: string; index: number }) => {
    const isSelected = index === selectedTeamIndex;
    return (
      <TouchableOpacity
        style={[styles.teamItem, isSelected && styles.teamItemSelected]}
        onPress={() => setSelectedTeamIndex(index)}
      >
        <Text style={styles.teamItemText}>
          {item} ({t("scoreAward.points", { p: scores[index] ?? 0 })})
        </Text>
      </TouchableOpacity>
    );
  };

  /* ─── UI ─── */
  return (
    <ImageBackground source={require("../assets/images/imege6.jpg")} style={styles.background} resizeMode="cover">
      <Animated.View style={[styles.overlay, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>
        <View style={{ height: insets.top }} />

        {/* header */}
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
              <Text style={styles.menuButtonText}>{t("scoreAward.menu")}</Text> {/* 🆕 */}
            </TouchableOpacity>
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{t("scoreAward.header")}</Text>     {/* 🆕 */}
          </View>

          <View style={styles.headerSide}>
            <TouchableOpacity style={styles.backIconButton} onPress={handleBack}>
              <Feather name="chevron-left" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* список */}
        <View style={styles.content}>
          <Text style={styles.title}>{t("scoreAward.question")}</Text>           {/* 🆕 */}

          <FlatList
            ref={listRef}
            data={teams}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderTeamItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Award button */}
        <TouchableOpacity style={styles.awardBtn} onPress={handleAwardPoint}>
          <Text style={styles.awardBtnText}>{t("scoreAward.award")}</Text>       {/* 🆕 */}
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
    backgroundColor: "rgba(255, 0, 0, 0.7)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  headerSide:   { width: 70, alignItems: "center", justifyContent: "center", height: "100%" },
  headerCenter: { flex: 1, alignItems: "center", justifyContent: "center" },

  menuButton:     { paddingHorizontal: 10, paddingVertical: 5 },
  menuButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  headerTitle:    { fontSize: 20, color: "#fff", fontWeight: "bold" },
  backIconButton: { padding: 5 },

  /* контент */
  content:       { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  title:         { fontSize: 18, color: "#fff", marginBottom: 15, textAlign: "center" },
  listContent:   { paddingBottom: 100 },

  teamItem: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  teamItemSelected: { backgroundColor: "rgba(255,255,255,0.4)" },
  teamItemText:     { fontSize: 16, color: "#fff" },

  /* кнопка Award */
  awardBtn: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
    width: "80%",
    alignSelf: "center",
    alignItems: "center",
  },
  awardBtnText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
