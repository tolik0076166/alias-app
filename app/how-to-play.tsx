// app/how-to-play.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useLanguage } from "./i18n/LanguageContext";

export default function HowToPlayScreen() {
  const { t } = useLanguage();
  const router = useRouter();

  /* --- масиви правил / дозволеного -------------------------------------- */
  // i18n.t типізований як string, тому явно приводимо до string[]
  const tellRules: string[]      = t("howToPlay.tellRules",   { returnObjects: true }) as unknown as string[];
  const showRules: string[]      = t("howToPlay.showRules",   { returnObjects: true }) as unknown as string[];
  const tellAllowed: string[]    = t("howToPlay.tellAllowed", { returnObjects: true }) as unknown as string[];
  const showAllowed: string[]    = t("howToPlay.showAllowed", { returnObjects: true }) as unknown as string[];

  return (
    <ImageBackground
      source={require("../assets/images/imege6.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.notchSpacer} />

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{t("howToPlay.title")}</Text>
          <Text style={styles.subtitle}>{t("howToPlay.subtitle")}</Text>

          {/* Мета гри */}
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>{t("howToPlay.goal")} </Text>
            {t("howToPlay.goalText")}
          </Text>

          {/* Варіанти гри */}
          <Text style={styles.bold}>{t("howToPlay.modes")}</Text>
          <Text style={styles.bullet}>- <Text style={styles.italic}>{t("howToPlay.tell")}</Text></Text>
          <Text style={styles.bullet}>- <Text style={styles.italic}>{t("howToPlay.show")}</Text></Text>

          {/* Заборонено */}
          <Text style={styles.bold}>{t("howToPlay.forbidden")}</Text>

          <Text style={styles.bullet}>{t("howToPlay.forTell")}</Text>
          {tellRules.map((r, i) => (
            <Text key={`ft${i}`} style={styles.subBullet}>- {r}</Text>
          ))}

          <Text style={styles.bullet}>{t("howToPlay.forShow")}</Text>
          {showRules.map((r, i) => (
            <Text key={`fs${i}`} style={styles.subBullet}>- {r}</Text>
          ))}

          {/* Дозволено */}
          <Text style={styles.bold}>{t("howToPlay.allowed")}</Text>

          <Text style={styles.bullet}>{t("howToPlay.allowedTell")}</Text>
          {tellAllowed.map((r, i) => (
            <Text key={`at${i}`} style={styles.subBullet}>- {r}</Text>
          ))}

          <Text style={styles.bullet}>{t("howToPlay.allowedShow")}</Text>
          {showAllowed.map((r, i) => (
            <Text key={`as${i}`} style={styles.subBullet}>- {r}</Text>
          ))}

          {/* Як проходить раунд / перемога / гравці */}
          <Text style={styles.bold}>{t("howToPlay.round")}</Text>
          <Text style={styles.paragraph}>{t("howToPlay.roundText")}</Text>

          <Text style={styles.bold}>{t("howToPlay.win")}</Text>
          <Text style={styles.paragraph}>{t("howToPlay.winText")}</Text>

          <Text style={styles.bold}>{t("howToPlay.players")}</Text>
          <Text style={styles.paragraph}>{t("howToPlay.playersText")}</Text>

          {/* Кнопка назад */}
          <TouchableOpacity style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>{t("howToPlay.back")}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

/* ------------------------ styles ------------------------ */
const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 20 },
  notchSpacer: { height: Platform.OS === "android" ? StatusBar.currentHeight : 40 },
  scrollContent: { paddingBottom: 30 },

  title: {
    fontSize: 28, color: "#fff", fontWeight: "bold",
    marginBottom: 16, textAlign: "center",
    textShadowColor: "#000", textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 3,
  },
  subtitle: { fontSize: 18, color: "#ffccdd", fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  paragraph: { fontSize: 16, color: "#fff", marginBottom: 12, lineHeight: 22 },
  bullet: { fontSize: 16, color: "#fff", marginTop: 10, marginBottom: 5 },
  subBullet: { fontSize: 15, color: "#eee", marginLeft: 20, marginBottom: 4 },
  italic: { fontStyle: "italic" },
  bold: { fontWeight: "bold", fontSize: 16, color: "#fff", marginTop: 14, marginBottom: 6 },
  button: {
    backgroundColor: "rgba(255,0,0,0.8)", paddingHorizontal: 30, paddingVertical: 15,
    borderRadius: 25, alignItems: "center", marginTop: 20,
  },
  buttonText: {
    color: "#fff", fontSize: 18, fontWeight: "600",
    textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3,
  },
});
