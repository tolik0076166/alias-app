import React from "react";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            gestureEnabled: false,
            animation: "none",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="teams"
          options={{
            gestureEnabled: false,
            animation: "none",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="game-screen"
          options={{
            gestureEnabled: false, // ← отключаем свайп
            animation: "slide_from_right",
            headerShown: false,
          }}
        />
      </Stack>
    </Provider>
  );
}
