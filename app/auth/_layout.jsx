import { Stack } from "expo-router";
import { View, Text } from "react-native";
import React from "react";
import FontLoader from "../components/FontLoader";

const AuthLayout = () => {
  return (
    <FontLoader>
      <Stack>
        <Stack.Screen name="sign_in" options={{ headerShown: false }} />
        <Stack.Screen name="sign_up" options={{ headerShown: false }} />
      </Stack>
    </FontLoader>
  );
};

export default AuthLayout;
