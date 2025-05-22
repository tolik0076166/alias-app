import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/* ─────────────────────────── external data ───────────────────── */
// 2 JSON‑файли із базовими словами
import ukWords from "../assets/data/words_ua.json";  // український список
import enWords from "../assets/data/words_en.json";  // англійський список
// утиліта Fisher‑Yates для рівномірного перемішування
import { shuffle } from "../utils/shuffle";

/* ─────────────────────────── defaults ─────────────────────────── */
const defaultTeams  = ["Team 1", "Team 2"];
const defaultScores = [0, 0];
// за замовчуванням стартуємо з українського набору
const defaultWords  = shuffle(ukWords);

/* ─────────────────────────── types ────────────────────────────── */
interface Turn { teamIndex: number; wordIndex: number; }

interface GameState {
  teams: string[];
  scores: number[];
  words: string[];
  currentTeamIndex: number;
  currentWordIndex: number;
  roundTurns: number;
  roundNumber: number;
  lastRoute: string | null;
  history: Turn[];
  lastAwardTeamIndex: number | null;   // щоб можна було «Undo award»
}

/* ─────────────────────────── initial ──────────────────────────── */
const initialState: GameState = {
  teams: [...defaultTeams],
  scores: [...defaultScores],
  words: [...defaultWords],

  currentTeamIndex: 0,
  currentWordIndex: 0,

  roundTurns: 0,
  roundNumber: 1,

  lastRoute: null,
  history: [],

  lastAwardTeamIndex: null,
};

/* ─────────────────────────── slice ────────────────────────────── */
export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    /* ==== підвантаження / зміна набору слів ==== */
    loadWords(state, { payload }: PayloadAction<string[]>) {
      state.words = shuffle(payload);
      // скидаємо прогрес, бо починаємо нову гру
      state.currentTeamIndex = 0;
      state.currentWordIndex = 0;
      state.roundTurns       = 0;
      state.roundNumber      = 1;
      state.history          = [];
    },

    /* ==== керування командами ==== */
    addTeam(state, { payload }: PayloadAction<string>) {
      state.teams.push(payload);
      state.scores.push(0);
    },
    updateTeam(state, { payload }: PayloadAction<{ index: number; newName: string }>) {
      const { index, newName } = payload;
      if (index >= 0 && index < state.teams.length) state.teams[index] = newName;
    },
    removeTeam(state, { payload }: PayloadAction<number>) {
      if (payload >= 0 && payload < state.teams.length) {
        state.teams.splice(payload, 1);
        state.scores.splice(payload, 1);
      }
    },

    /* ==== хід уперед / назад ==== */
    endTurn(state) {
      state.history.push({
        teamIndex: state.currentTeamIndex,
        wordIndex: state.currentWordIndex,
      });

      state.roundTurns      += 1;
      state.currentTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;
      state.currentWordIndex += 1;
    },
    goBackTurn(state) {
      const last = state.history.pop();
      if (!last) return;
      state.currentTeamIndex = last.teamIndex;
      state.currentWordIndex = last.wordIndex;
      state.roundTurns       = state.history.length;
    },

    /* ==== очки ==== */
    awardPoint(state, { payload }: PayloadAction<number>) {
      if (payload >= 0 && payload < state.scores.length) {
        state.scores[payload] += 1;
        state.lastAwardTeamIndex = payload;
      }
    },
    undoLastAward(state) {
      const i = state.lastAwardTeamIndex;
      if (i === null || i < 0 || i >= state.scores.length || state.scores[i] === 0) return;

      state.scores[i]        -= 1;
      state.lastAwardTeamIndex = null;
      if (state.roundNumber > 1) state.roundNumber -= 1;
    },

    /* ==== раунди ==== */
    resetRound(state) { state.roundTurns = 0; },
    nextRound(state)  { state.roundNumber += 1; },

    /* ==== інші службові екшени ==== */
    resetGame(state) {
      const currentSet = [...state.words];
      Object.assign(state, { ...initialState, words: shuffle(currentSet) });
    },
    setLastRoute(state, { payload }: PayloadAction<string | null>) {
      state.lastRoute = payload;
    },

    /* прямі установки (debug / restore) */
    setTurn(state, { payload }: PayloadAction<Turn>) {
      state.currentTeamIndex = payload.teamIndex;
      state.currentWordIndex = payload.wordIndex;
    },
    setHistory(state, { payload }: PayloadAction<Turn[]>) {
      state.history = payload;
    },
  },
});

/* ─────────────────────────── exports ──────────────────────────── */
export const {
  loadWords,
  addTeam, updateTeam, removeTeam,
  endTurn, goBackTurn,
  awardPoint, undoLastAward,
  resetRound, nextRound,
  resetGame, setLastRoute,
  setTurn, setHistory,
} = gameSlice.actions;

export default gameSlice.reducer;
