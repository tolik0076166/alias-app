import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const defaultTeams = ["Team 1", "Team 2"];
const defaultScores = [0, 0];
const defaultWords = ["стюардеса", "слон", "кофеварка", "программист"];

interface GameState {
  teams: string[];
  scores: number[];
  words: string[];
  currentTeamIndex: number;
  currentWordIndex: number;
  roundTurns: number;
  lastRoute: string | null;
  roundNumber: number;
  history: { teamIndex: number; wordIndex: number }[];
}

const initialState: GameState = {
  teams: [...defaultTeams],
  scores: [...defaultScores],
  words: [...defaultWords],
  currentTeamIndex: 0,
  currentWordIndex: 0,
  roundTurns: 0,
  lastRoute: null,
  roundNumber: 1,
  history: [],
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    addTeam(state, action: PayloadAction<string>) {
      state.teams.push(action.payload);
      state.scores.push(0);
    },
    updateTeam(state, action: PayloadAction<{ index: number; newName: string }>) {
      const { index, newName } = action.payload;
      if (index >= 0 && index < state.teams.length) {
        state.teams[index] = newName;
      }
    },
    removeTeam(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index >= 0 && index < state.teams.length) {
        state.teams.splice(index, 1);
        state.scores.splice(index, 1);
      }
    },
    endTurn(state) {
      state.history.push({
        teamIndex: state.currentTeamIndex,
        wordIndex: state.currentWordIndex,
      });
      state.roundTurns += 1;
      state.currentTeamIndex = (state.currentTeamIndex + 1) % state.teams.length;
      state.currentWordIndex += 1;
    },
    goBackTurn(state) {
      if (state.history.length === 0) return;
      const lastTurn = state.history.pop();
      if (lastTurn) {
        state.currentTeamIndex = lastTurn.teamIndex;
        state.currentWordIndex = lastTurn.wordIndex;
        state.roundTurns = Math.max(0, state.roundTurns - 1);
      }
    },
    awardPoint(state, action: PayloadAction<number>) {
      const winnerIndex = action.payload;
      if (winnerIndex >= 0 && winnerIndex < state.scores.length) {
        state.scores[winnerIndex] += 1;
      }
    },
    resetRound(state) {
      state.roundTurns = 0;
    },
    nextRound(state) {
      state.roundNumber += 1;
    },
    resetGame(state) {
      state.teams = [...defaultTeams];
      state.scores = [...defaultScores];
      state.words = [...defaultWords];
      state.currentTeamIndex = 0;
      state.currentWordIndex = 0;
      state.roundTurns = 0;
      state.lastRoute = null;
      state.roundNumber = 1;
      state.history = [];
    },
    setLastRoute(state, action: PayloadAction<string | null>) {
      state.lastRoute = action.payload;
    },
  },
});

export const {
  addTeam,
  updateTeam,
  removeTeam,
  endTurn,
  goBackTurn,
  awardPoint,
  resetRound,
  nextRound,
  resetGame,
  setLastRoute,
} = gameSlice.actions;

export default gameSlice.reducer;
