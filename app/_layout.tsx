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
        {/* Отключаем свайп и анимацию для главного экрана */}
        <Stack.Screen
          name="index"
          options={{
            gestureEnabled: false,
            animation: "none",
            headerShown: false,
          }}
        />
        {/* И для экрана с командами */}
        <Stack.Screen
          name="teams"
          options={{
            gestureEnabled: false,
            animation: "none",
            headerShown: false,
          }}
        />
      </Stack>
    </Provider>
  );
}
