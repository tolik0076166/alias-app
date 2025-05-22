import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
  Modal,
  TextInput,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  addTeam,
  updateTeam,
  removeTeam,
  setLastRoute,
} from "../store/gameSlice";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "./i18n/LanguageContext";   // 🆕 i18n

export default function TeamSetupScreen() {
  const { t }       = useLanguage();                    // 🆕
  const insets      = useSafeAreaInsets();
  const dispatch    = useDispatch();
  const navigation  = useNavigation<any>();

  const teams   = useSelector((state: any) => state.game.teams);
  const listRef = useRef<FlatList>(null);

  const [isRenameModalVisible, setRenameModalVisible] = useState(false);
  const [renameIndex, setRenameIndex]                 = useState<number | null>(null);
  const [renameValue, setRenameValue]                 = useState("");

  /* ──────────── колбэки ──────────── */
  const handleAddTeam = () => {
    dispatch(addTeam(t("teams.defaultName", { num: teams.length + 1 })));   // 🆕
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const handleRemoveTeam    = (index: number) => dispatch(removeTeam(index));
  const handleStartRename   = (i: number) => {
    setRenameIndex(i);
    setRenameValue(teams[i]);
    setRenameModalVisible(true);
  };
  const handleConfirmRename = () => {
    if (renameIndex !== null && renameValue.trim()) {
      dispatch(updateTeam({ index: renameIndex, newName: renameValue.trim() }));
    }
    setRenameModalVisible(false);
    setRenameIndex(null);
    setRenameValue("");
  };
  const handleCancelRename  = () => {
    setRenameModalVisible(false);
    setRenameIndex(null);
    setRenameValue("");
  };

  const handleMenu = () => {
    dispatch(setLastRoute("/teams"));
    navigation.navigate("index");
  };
  const handleNext = () =>
    navigation.reset({ index: 1, routes: [{ name: "teams" }, { name: "round-intro" }] });

  /* ──────────── рендер ──────────── */
  const renderTeamItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.teamItem}>
      <TouchableOpacity style={styles.teamName} onPress={() => handleStartRename(index)}>
        <Text style={styles.teamNameText}>{item}</Text>
      </TouchableOpacity>

      {teams.length > 2 && (
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleRemoveTeam(index)}>
          <Text style={styles.deleteBtnText}>X</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/images/imege6.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={{ height: insets.top }} />

        {/* ─── хедер ─── */}
        <View style={styles.header}>
          <View style={styles.headerSide}>
            <TouchableOpacity style={styles.menuButton} onPress={handleMenu}>
              <Text style={styles.menuButtonText}>{t("teams.menu")}</Text> {/* 🆕 */}
            </TouchableOpacity>
          </View>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{t("teams.title")}</Text> {/* 🆕 */}
          </View>

          <View style={styles.headerSide} />
        </View>

        {/* ─── список команд ─── */}
        <View style={styles.listContainer}>
          <FlatList
            ref={listRef}
            data={teams}
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderTeamItem}
            style={styles.teamList}
            ListFooterComponent={
              <View style={styles.addButtonWrapper}>
                <TouchableOpacity style={styles.addButton} onPress={handleAddTeam} activeOpacity={1}>
                  <Text style={styles.addButtonText}>{t("teams.add")}</Text> {/* 🆕 */}
                </TouchableOpacity>
              </View>
            }
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* ─── кнопка Next ─── */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>{t("teams.next")}</Text> {/* 🆕 */}
        </TouchableOpacity>

        {/* ─── модалка переіменування ─── */}
        <Modal visible={isRenameModalVisible} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>{t("teams.renameTitle")}</Text> {/* 🆕 */}
              <TextInput
                style={styles.modalInput}
                value={renameValue}
                onChangeText={setRenameValue}
                placeholder={t("teams.newNamePh")}       /* 🆕 */
                placeholderTextColor="#999"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity style={styles.modalButton} onPress={handleCancelRename}>
                  <Text style={styles.modalButtonText}>{t("common.cancel")}</Text> {/* 🆕 */}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#ff3333" }]}
                  onPress={handleConfirmRename}
                >
                  <Text style={styles.modalButtonText}>{t("common.save")}</Text> {/* 🆕 */}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
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
  menuButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  headerTitle:    { fontSize: 20, color: "#fff", fontWeight: "bold" },

  /* список */
  listContainer: { flex: 1, margin: 10 },
  teamList:      { flex: 1 },
  teamItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    marginBottom: 5,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  teamName:       { flex: 1 },
  teamNameText:   { fontSize: 18, color: "#fff" },
  deleteBtn:      { backgroundColor: "#ff0000", borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5 },
  deleteBtnText:  { color: "#fff", fontWeight: "bold", fontSize: 16 },

  addButtonWrapper: { marginVertical: 10, alignItems: "center" },
  addButton:        { backgroundColor: "#ff0000", paddingVertical: 15, paddingHorizontal: 25, borderRadius: 25, alignItems: "center" },
  addButtonText:    { color: "#fff", fontSize: 18, fontWeight: "bold" },

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

  /* модалка */
  modalOverlay:  { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContainer:{ width: "80%", backgroundColor: "#fff", borderRadius: 8, padding: 20 },
  modalTitle:    { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#000" },
  modalInput:    { borderWidth: 1, borderColor: "#ccc", padding: 10, fontSize: 16, borderRadius: 4, color: "#000" },
  modalButtons:  { flexDirection: "row", justifyContent: "space-around", marginTop: 15 },
  modalButton:   { backgroundColor: "#999", paddingHorizontal: 15, paddingVertical: 8, borderRadius: 4 },
  modalButtonText:{ color: "#fff", fontSize: 16 },
});
