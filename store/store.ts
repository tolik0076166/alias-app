import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "./gameSlice";
import teamsReducer from "./teamsSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    teams: teamsReducer,
  },
});

// Типизация (если используете TS):
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
