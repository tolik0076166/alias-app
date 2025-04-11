import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  FlatList,
  Platform,
  StatusBar,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { Feather } from '@expo/vector-icons';
import {
  awardPoint,
  nextRound,
  resetRound,
  setLastRoute,
} from "../store/gameSlice";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ScoreAwardScreen() {
  const dispatch = useDispatch();
  const router = useRouter();

  const teams = useSelector((state: any) => state.game.teams);
  const scores = useSelector((state: any) => state.game.scores);

  const [selectedTeamIndex, setSelectedTeamIndex] = useState<number | null>(null);
  const listRef = useRef<FlatList>(null);

  const translateX = useRef(new Animated.Value(0)).current;

  const handleMenu = () => {
    dispatch(setLastRoute("/score-award"));
    router.push("/");
  };

  const handleAwardPoint = () => {
    if (selectedTeamIndex === null) {
      Alert.alert("Ошибка", "Выберите, кому присудить очко!");
      return;
    }
    dispatch(awardPoint(selectedTeamIndex));
    dispatch(nextRound());
    dispatch(resetRound());
    router.push("/round-intro");
  };

  const handleBack = () => {
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Platform.OS === 'android' && gestureState.dx > 20;
    },
    onPanResponderMove: Animated.event(
      [null, { dx: translateX }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        handleBack();
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const renderTeamItem = ({ item, index }: { item: string; index: number }) => {
    const isSelected = index === selectedTeamIndex;
    return (
      <TouchableOpacity
        style={[styles.teamItem, isSelected && styles.teamItemSelected]}
        onPress={() => setSelectedTeamIndex(index)}
      >
        <Text style={styles.teamItemText}>
          {item} ({scores[index] || 0} очков)
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../assets/images/imege6.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <Animated.View style={[styles.overlay, { transform: [{ translateX }] }]} {...panResponder.panHandlers}>

        <View style={styles.notchSpacer} />

        <View style={styles.header}>
          <View style={styles.headerSide}>
            <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
              <Text style={styles.menuButtonText}>Menu</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Choose the winner</Text>
          </View>

          <View style={styles.headerSide}>
            <TouchableOpacity style={styles.backIconButton} onPress={handleBack}>
              <Feather name="chevron-left" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Какой команде присудить очко?</Text>

          <FlatList
            ref={listRef}
            data={teams}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderTeamItem}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>

        <TouchableOpacity style={styles.awardBtn} onPress={handleAwardPoint}>
          <Text style={styles.awardBtnText}>Award point</Text>
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
  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
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
  backIconButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 15,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 100,
  },
  teamItem: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  teamItemSelected: {
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  teamItemText: {
    fontSize: 16,
    color: "#fff",
  },
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
