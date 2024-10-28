// FontLoader.js
import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

const FontLoader = ({ children }) => {
  const [fontsLoaded, error] = useFonts({
    "Q-Bold": require("../../assets/fonts/Quicksand-Bold.ttf"),
    "Q-Light": require("../../assets/fonts/Quicksand-Light.ttf"),
    "Q-Regular": require("../../assets/fonts/Quicksand-Regular.ttf"),
    "Q-Medium": require("../../assets/fonts/Quicksand-Medium.ttf"),
    "Q-SemiBold": require("../../assets/fonts/Quicksand-SemiBold.ttf"),
    "E-SemiBold": require("../../assets/fonts/Eczar-SemiBold.ttf"),
    "E-Bold": require("../../assets/fonts/Eczar-Bold.ttf"),
    "E-ExtraBold": require("../../assets/fonts/Eczar-ExtraBold.ttf"),
    "E-Medium": require("../../assets/fonts/Eczar-Medium.ttf"),
    "E-Regular": require("../../assets/fonts/Eczar-Regular.ttf"),
    "O-C-Bold": require("../../assets/fonts/OpenSans_Condensed-Bold.ttf"),
    "O-C-BoldItalic": require("../../assets/fonts/OpenSans_Condensed-BoldItalic.ttf"),
    "O-C-ExtraBold": require("../../assets/fonts/OpenSans_Condensed-ExtraBold.ttf"),
    "O-C-ExtraBoldItalic": require("../../assets/fonts/OpenSans_Condensed-ExtraBoldItalic.ttf"),
    "O-C-Italic": require("../../assets/fonts/OpenSans_Condensed-Italic.ttf"),
    "O-C-Light": require("../../assets/fonts/OpenSans_Condensed-Light.ttf"),
    "O-C-LightItalic": require("../../assets/fonts/OpenSans_Condensed-LightItalic.ttf"),
    "O-C-Medium": require("../../assets/fonts/OpenSans_Condensed-Medium.ttf"),
    "O-C-MediumItalic": require("../../assets/fonts/OpenSans_Condensed-MediumItalic.ttf"),
    "O-C-Regular": require("../../assets/fonts/OpenSans_Condensed-Regular.ttf"),
    "O-C-SemiBold": require("../../assets/fonts/OpenSans_Condensed-SemiBold.ttf"),
    "O-C-SemiBoldItalic": require("../../assets/fonts/OpenSans_Condensed-SemiBoldItalic.ttf"),
    "O-C-S-Bold": require("../../assets/fonts/OpenSans_SemiCondensed-Bold.ttf"),
    "O-C-S-BoldItalic": require("../../assets/fonts/OpenSans_SemiCondensed-BoldItalic.ttf"),
    "O-C-S-ExtraBold": require("../../assets/fonts/OpenSans_SemiCondensed-ExtraBold.ttf"),
    "O-C-S-ExtraBoldItalic": require("../../assets/fonts/OpenSans_SemiCondensed-ExtraBoldItalic.ttf"),
    "O-C-S-Italic": require("../../assets/fonts/OpenSans_SemiCondensed-Italic.ttf"),
    "O-C-S-Light": require("../../assets/fonts/OpenSans_SemiCondensed-Light.ttf"),
    "O-C-S-LightItalic": require("../../assets/fonts/OpenSans_SemiCondensed-LightItalic.ttf"),
    "O-C-S-Medium": require("../../assets/fonts/OpenSans_SemiCondensed-Medium.ttf"),
    "O-C-S-MediumItalic": require("../../assets/fonts/OpenSans_SemiCondensed-MediumItalic.ttf"),
    "O-C-S-Regular": require("../../assets/fonts/OpenSans_SemiCondensed-Regular.ttf"),
    "O-C-S-SemiBold": require("../../assets/fonts/OpenSans_SemiCondensed-SemiBold.ttf"),
    "O-C-S-SemiBoldItalic": require("../../assets/fonts/OpenSans_SemiCondensed-SemiBoldItalic.ttf"),
    "P-Black": require("../../assets/fonts/Poppins-Black.ttf"),
    "P-BlackItalic": require("../../assets/fonts/Poppins-BlackItalic.ttf"),
    "P-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
    "P-BoldItalic": require("../../assets/fonts/Poppins-BoldItalic.ttf"),
    "P-ExtraBold": require("../../assets/fonts/Poppins-ExtraBold.ttf"),
    "P-ExtraBoldItalic": require("../../assets/fonts/Poppins-ExtraBoldItalic.ttf"),
    "P-ExtraLight": require("../../assets/fonts/Poppins-ExtraLight.ttf"),
    "P-ExtraLightItalic": require("../../assets/fonts/Poppins-ExtraLightItalic.ttf"),
    "P-Italic": require("../../assets/fonts/Poppins-Italic.ttf"),
    "P-Light": require("../../assets/fonts/Poppins-Light.ttf"),
    "P-LightItalic": require("../../assets/fonts/Poppins-LightItalic.ttf"),
    "P-Medium": require("../../assets/fonts/Poppins-Medium.ttf"),
    "P-MediumItalic": require("../../assets/fonts/Poppins-MediumItalic.ttf"),
    "P-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "P-SemiBold": require("../../assets/fonts/Poppins-SemiBold.ttf"),
    "P-SemiBoldItalic": require("../../assets/fonts/Poppins-SemiBoldItalic.ttf"),
    "P-Thin": require("../../assets/fonts/Poppins-Thin.ttf"),
    "P-ThinItalic": require("../../assets/fonts/Poppins-ThinItalic.ttf"),
  });

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (error) {
        console.error("Error loading fonts:", error);
      }

      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplashScreen();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null; // Don't render anything until fonts are loaded

  return <>{children}</>; // Render children after fonts are loaded
};

export default FontLoader;
