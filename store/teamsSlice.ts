import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние (два примера команд, или пустой массив)
const initialState = {
  teams: ["Crocodiles", "Fire breathing duckies"],
};

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    // Экшен для полной замены списка
    setTeams(state, action) {
      state.teams = action.payload;
    },
    // Экшен для добавления одной команды
    addTeam(state, action) {
      state.teams.push(action.payload);
    },
    // Экшен для редактирования команды (по индексу)
    updateTeam(state, action) {
      const { index, newName } = action.payload;
      if (index >= 0 && index < state.teams.length) {
        state.teams[index] = newName;
      }
    },
    // Экшен для удаления команды
    removeTeam(state, action) {
      const index = action.payload;
      if (index >= 0 && index < state.teams.length) {
        state.teams.splice(index, 1);
      }
    },
  },
});

export const { setTeams, addTeam, updateTeam, removeTeam } = teamsSlice.actions;
export default teamsSlice.reducer;
