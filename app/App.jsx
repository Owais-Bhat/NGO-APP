import React from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import FontLoader from "./components/FontLoader";

const App = () => {
  return (
    <SafeAreaProvider>
      <FontLoader>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="tabs" options={{ headerShown: false }} />
          <Stack.Screen name="blog/[slug]" options={{ headerShown: false }} />

          <Stack.Screen
            name="components/messege"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/createcsfmember"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="screen/createcsfvolunteers"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="components/HelpDeskComponents/BloodCamp"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="components/HelpDeskComponents/ChildEducation"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="components/HelpDeskComponents/ComputerClass"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="components/HelpDeskComponents/Kanyadaan"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="components/HelpDeskComponents/MedicalHelp"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="components/HelpDeskComponents/Sardh"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="components/HelpDeskComponents/BloodDonation"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="components/HelpDeskComponents/BloodRequire"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="help" />
          <Stack.Screen name="history" />
          <Stack.Screen name="address" />
          <Stack.Screen name="about" />
          <Stack.Screen name="payment" />
          <Stack.Screen name="tabs" options={{ headerShown: false }} />
          <Stack.Screen
            name="screen/personaldetails"
            options={{ headerShown: false }}
          />
        </Stack>
      </FontLoader>
    </SafeAreaProvider>
  );
};

export default App;
