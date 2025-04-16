import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Platform,
  StatusBar,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter, Stack } from "expo-router";
import { setLastRoute } from "../store/gameSlice";
import { Feather } from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function RoundIntroScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const teams = useSelector((state: any) => state.game.teams);
  const scores = useSelector((state: any) => state.game.scores);
  const roundNumber = useSelector((state: any) => state.game.roundNumber);
  const currentTeamIndex = useSelector((state: any) => state.game.currentTeamIndex);
  const currentTeam = teams[currentTeamIndex] || "Team X";

  const listRef = useRef<FlatList>(null);
  const translateX = useRef(new Animated.Value(0)).current;

  const handleMenu = () => {
    dispatch(setLastRoute("/round-intro"));
    router.push("/");
  };

  const handleLetsGo = () => {
    router.push("/game-screen");
  };

  const handleBackToTeams = () => {
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      router.replace("/teams");
    });
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dx > 20,
    onPanResponderMove: Animated.event([null, { dx: translateX }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        handleBackToTeams();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          gestureEnabled: false, // ❗ Отключает системный свайп назад
        }}
      />
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
            <View style={styles.notchSpacer} />
            <View style={styles.header}>
              <View style={styles.headerSide}>
                <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
                  <Text style={styles.menuButtonText}>Menu</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.headerCenter}>
                <Text style={styles.headerTitle}>TEAM SCORES</Text>
              </View>

              <View style={styles.headerSide}>
                <TouchableOpacity style={styles.backIconButton} onPress={handleBackToTeams}>
                  <Feather name="chevron-left" size={28} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.listContainer}>
              <FlatList
                ref={listRef}
                style={styles.teamList}
                data={teams}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.scoreItem}>
                    <Text style={styles.teamName}>{item}</Text>
                    <Text style={styles.teamPoints}>{scores[index] || 0}</Text>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
              />
            </View>

            <View style={styles.roundInfo}>
              <Text style={styles.roundText}>Round {roundNumber}</Text>
              <Text style={styles.subText}>get ready to play</Text>
              <Text style={styles.currentTeam}>{currentTeam}</Text>
            </View>

            <TouchableOpacity style={styles.letsGoBtn} onPress={handleLetsGo}>
              <Text style={styles.letsGoBtnText}>Let’s go!</Text>
            </TouchableOpacity>
          </Animated.View>
        </ImageBackground>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  notchSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    backgroundColor: 'transparent',
  },
  header: {
    height: 56,
    backgroundColor: "rgba(255, 0, 0, 0.7)",
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
  menuButton: { paddingHorizontal: 10, paddingVertical: 5 },
  menuButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  backIconButton: { padding: 5 },
  listContainer: {
    maxHeight: "50%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  teamList: { flexGrow: 0 },
  scoreItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  teamName: { fontSize: 18, color: "#fff" },
  teamPoints: { fontSize: 16, color: "#fff" },
  roundInfo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  roundText: {
    fontSize: 24,
    color: "#ffcccc",
    fontWeight: "bold",
  },
  subText: {
    marginTop: 5,
    fontSize: 16,
    color: "#ddd",
  },
  currentTeam: {
    marginTop: 10,
    fontSize: 28,
    color: "#FFA500",
    fontWeight: "600",
  },
  letsGoBtn: {
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
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
