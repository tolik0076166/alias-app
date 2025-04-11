import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,              // скрываем стандартный header
          animation: "slide_from_right",  // анимация переходов
          gestureEnabled: true,           // свайп назад
        }}
      />
    </Provider>
  );
}
