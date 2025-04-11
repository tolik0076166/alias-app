import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Две команды по умолчанию
const defaultTeams = ["Team 1", "Team 2"];
// Счёт по умолчанию (для двух команд)
const defaultScores = [0, 0];
// Пример списка слов
const defaultWords = ["стюардеса", "слон", "кофеварка", "программист"];

// Описываем интерфейс состояния (если хотите строгий TS)
interface GameState {
  teams: string[];
  scores: number[];
  words: string[];
  currentTeamIndex: number;
  currentWordIndex: number;
  roundTurns: number;
  lastRoute: string | null;
  // Новое поле для логики «Round X»
  roundNumber: number;
}

const initialState: GameState = {
  teams: [...defaultTeams],
  scores: [...defaultScores],
  words: [...defaultWords],

  currentTeamIndex: 0,
  currentWordIndex: 0,
  roundTurns: 0,
  lastRoute: null,

  // Начинаем с Round 1
  roundNumber: 1,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    // Добавить новую команду
    addTeam(state, action: PayloadAction<string>) {
      state.teams.push(action.payload);
      state.scores.push(0); // Для новой команды
    },

    // Переименовать команду
    updateTeam(
      state,
      action: PayloadAction<{ index: number; newName: string }>
    ) {
      const { index, newName } = action.payload;
      if (index >= 0 && index < state.teams.length) {
        state.teams[index] = newName;
      }
    },

    // Удалить команду
    removeTeam(state, action: PayloadAction<number>) {
      const index = action.payload;
      if (index >= 0 && index < state.teams.length) {
        state.teams.splice(index, 1);
        state.scores.splice(index, 1);
      }
    },

    // Завершение хода
    endTurn(state) {
      state.roundTurns += 1;
      // Переходим к следующей команде по кругу
      state.currentTeamIndex =
        (state.currentTeamIndex + 1) % state.teams.length;
      // Следующее слово
      state.currentWordIndex += 1;
    },

    // Присудить очко (когда вручную выбираем команду-победителя)
    awardPoint(state, action: PayloadAction<number>) {
      const winnerIndex = action.payload;
      if (winnerIndex >= 0 && winnerIndex < state.scores.length) {
        state.scores[winnerIndex] += 1;
      }
    },

    // Сброс "раунда"
    resetRound(state) {
      state.roundTurns = 0;
    },

    // Переходим к следующему раунду (roundNumber++)
    nextRound(state) {
      state.roundNumber += 1;
      // Можно обнулить roundTurns или positions, по логике
      // state.roundTurns = 0;
    },

    // Полный сброс игры
    resetGame(state) {
      state.teams = [...defaultTeams];
      state.scores = [...defaultScores];
      state.words = [...defaultWords];

      state.currentTeamIndex = 0;
      state.currentWordIndex = 0;
      state.roundTurns = 0;
      state.lastRoute = null;

      // Раунд снова 1
      state.roundNumber = 1;
    },

    // Устанавливаем маршрут для "Continue"
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
  awardPoint,
  resetRound,
  nextRound,
  resetGame,
  setLastRoute,
} = gameSlice.actions;

export default gameSlice.reducer;
