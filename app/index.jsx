import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ImageBackground,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontLoader from "./components/FontLoader";

const WelcomeScreen = () => {
  const router = useRouter();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity for fade-in
  const scaleLogoAnim = useRef(new Animated.Value(1.5)).current; // Initial scale for logo (zoomed in)

  // Start the fade-in and zoom-out animation on component mount
  useEffect(() => {
    // Parallel animations: fade-in and zoom-out
    Animated.parallel([
      // Fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1, // Fully opaque
        duration: 2000, // 2 seconds
        useNativeDriver: true, // Use native driver for better performance
      }),
      // Zoom-out animation for logo
      Animated.timing(scaleLogoAnim, {
        toValue: 1, // Scale down to original size
        duration: 2000, // 2 seconds
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate based on userToken in localStorage after 3 seconds
    const timer = setTimeout(() => {
      const userToken = AsyncStorage.getItem("userToken");

      // Navigate based on the presence of userToken
      if (userToken) {
        router.replace("/tabs/home"); // Navigate to home if userToken exists
      } else {
        router.replace("auth/sign_in"); // Navigate to sign-in if userToken does not exist
      }
    }, 3000);

    // Cleanup the timer on unmount
    return () => clearTimeout(timer);
  }, [fadeAnim, scaleLogoAnim, router]);

  return (
    <FontLoader>
      <LinearGradient colors={["#e5f6ff", "#e5f6ff"]} style={styles.container}>
        <ImageBackground
          source={require("../assets/chandan_backgrond.png")}
          style={styles.backgroundImage}
          resizeMode="cover" // Makes the image cover the entire screen
        >
          {/* Overlay for background opacity */}
          <View style={styles.overlay} />

          <View style={styles.innerContainer}>
            {/* Animated Image with fade-in and zoom-out */}
            <Animated.Image
              source={require("../assets/logo2.png")}
              style={[
                styles.logo,
                {
                  opacity: fadeAnim,
                  transform: [{ scale: scaleLogoAnim }],
                },
              ]} // Bind opacity to fadeAnim and scale to scaleLogoAnim
            />

            {/* Static Text */}
            <Text style={styles.clickableText}>चंदन सिंह फाउंडेशन</Text>
            <Text style={styles.clickableTexts}>में आपका स्वागत है</Text>
          </View>
        </ImageBackground>
      </LinearGradient>
    </FontLoader>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1, // Ensures the image covers the full screen
    width: Dimensions.get("window").width, // Full screen width
    height: Dimensions.get("window").height, // Full screen height
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Add a dark overlay with 30% opacity
  },
  innerContainer: {
    position: "absolute",
    bottom: 50, // Move the content towards the bottom of the screen
    alignItems: "center",
    width: "100%",
  },
  logo: {
    width: 350,
    height: 250,
    resizeMode: "contain",
    marginBottom: 10,
  },
  clickableText: {
    fontSize: 23,
    fontWeight: "bold",
    color: "black", // Color of the text
    textAlign: "center",
  },
  clickableTexts: {
    fontSize: 19,
    fontWeight: "bold",
    color: "white", // Color of the text
    textAlign: "center",
  },
});

export default WelcomeScreen;
