import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BellIcon from "react-native-vector-icons/MaterialCommunityIcons"; // Bell Icon for notifications

import { LinearGradient } from "expo-linear-gradient";

const defaultProfileImage = require("../../assets/user.png");

const Header = () => {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState(defaultProfileImage);
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");

  // Load user data and set greeting based on time
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const user = JSON.parse(storedUserData);
          setUserName(user.name);
          setProfileImage(user.profileImage || defaultProfileImage);
        }
      } catch (error) {
        console.error("Failed to load profile image:", error);
      }
    };

    const loadGreeting = () => {
      const hours = new Date().getHours();
      let greetingMessage = "";

      if (hours >= 0 && hours < 6) {
        greetingMessage = "Good Night!";
      } else if (hours < 12) {
        greetingMessage = "Good Morning!";
      } else if (hours < 17) {
        greetingMessage = "Good Afternoon!";
      } else {
        greetingMessage = "Good Evening!";
      }

      setGreeting(greetingMessage);
    };

    loadUserData();
    loadGreeting();
  }, []);

  const handleLogout = async () => {
    try {
      // Remove userToken, userData, and userId from AsyncStorage
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userData");
      await AsyncStorage.removeItem("userId");

      // Navigate to sign-in page
      router.replace("/auth/sign_in");
    } catch (error) {
      console.error("Error clearing user data: ", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Background3.png")}
      resizeMode="cover"
      style={styles.container}
    >
      {/* Linear Gradient to overlay on top of ImageBackground */}
      <LinearGradient
        colors={[
          "rgba(229, 246, 255, 0.3)",
          "rgba(229, 246, 255, 0.5)",
          "rgba(229, 246, 255, 0.8)",
        ]}
        style={styles.gradient}
      >
        <View style={styles.headerContainer}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={() => router.push("/tabs/profile")}>
              <Image
                source={
                  profileImage && profileImage !== defaultProfileImage
                    ? { uri: profileImage }
                    : defaultProfileImage
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <View style={styles.greetingContainer}>
              <Text style={styles.greetingText}>
                Hello, <Text style={styles.userNameText}>{userName}</Text>
              </Text>
              <Text style={styles.timeGreetingText}>{greeting}</Text>
              <Text style={styles.timeGreetingText}>
                <Text style={styles.welcomeText}>Welcome to </Text>
                <Text style={styles.highlightedText}>
                  Chandan Singh Foundation
                </Text>
              </Text>
            </View>
          </View>

          {/* Notification Icon */}
          <TouchableOpacity onPress={handleLogout}>
            <BellIcon name="logout" size={24} color="#36C2CE" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 100,
    // Adjust the height to fit your header layout
  },
  gradient: {
    flex: 1, // Ensures gradient covers entire background
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: "#000",
  },
  greetingContainer: {
    marginLeft: 10,
  },
  greetingText: {
    fontSize: 16,
    color: "#000", // Changed to white to contrast with the gradient background
    fontFamily: "P-Regular",
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  timeGreetingText: {
    fontSize: 12,
    color: "#000", // Slightly lighter text for the greeting time
    fontFamily: "P-SemiBold",
  },
  welcomeText: {
    color: "#000", // Default text color
  },
  highlightedText: {
    color: "red", // Highlight color for Chandan Singh Foundation
    fontWeight: "bold", // You can make it bold or apply custom fontFamily
  },
  userNameText: {
    fontSize: 16,
    color: "#36C2CE", // Custom color for username
    fontFamily: "P-SemiBold",
  },
});

export default Header;
