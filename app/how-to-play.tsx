import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

export default function HowToPlayScreen() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // возвращаемся назад
  };

  return (
    <ImageBackground
      source={require("../assets/images/imege6.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>How to play</Text>

        <Text style={styles.text}>
          Alias — это игра, в которой вы объясняете слова своей команде, не используя однокоренные. Угадавшее слово приносит очко. Играйте по очереди!
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Назад</Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    color: "#ffcccc",
    fontWeight: "bold",
    marginBottom: 30,
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  text: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
  },
  button: {
    backgroundColor: "rgba(255,0,0,0.8)",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
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
