import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { TextInput, Button } from "react-native-paper"; // Importing Paper components
import User from "react-native-vector-icons/Ionicons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import urls from "../urls";
import Icon from "react-native-paper";

import { LinearGradient } from "expo-linear-gradient";

const SignIn = () => {
  const router = useRouter();
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [inputError, setInputError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessageVisible, setSuccessMessageVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Validation for email and phone
  const validateInput = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;
    return emailRegex.test(input) || phoneRegex.test(input);
  };

  // Password validation (min 8 characters)
  const validatePassword = (password) => {
    return password.length >= 8;
  };

  // Animate logo (looping rotation)
  useEffect(() => {
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start();
  }, [fadeAnim]);

  // Handle SignIn
  const handleSignIn = async () => {
    setInputError("");
    setPasswordError("");

    // Validate email/phone and password
    if (!validateInput(phoneOrEmail)) {
      setInputError("Please enter a valid email address or phone number.");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post(`${urls}/api/v1/user/login`, {
        phoneOrEmail: phoneOrEmail,
        password: password,
      });

      const userToken = response.data.token;
      const userData = response.data.user;

      await AsyncStorage.setItem("userToken", userToken);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      await AsyncStorage.setItem("userId", userData.id);

      setSuccessMessageVisible(true);
      setTimeout(() => {
        setSuccessMessageVisible(false);
        router.replace("tabs/home");
      }, 2000);
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setPasswordError(
            "Invalid email/phone or password. Please try again."
          );
        } else {
          alert(
            "Error: " + error.response.data.message || "An error occurred."
          );
        }
      } else if (error.request) {
        alert("No response from server. Please check your network or server.");
      } else {
        alert("An unexpected error occurred: " + error.message);
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Background2.png")}
      style={styles.container}
    >
      {/* Form Container with Background Image */}
      <ImageBackground
        source={require("../../assets/Background2.png")} // Your form background image
        style={styles.formContainer}
        resizeMode="cover" // Ensures the image covers the container
      >
        {/* Circular Logo Container */}
        <LinearGradient
          colors={["#e5f6ff", "#e5f6ff"]}
          style={styles.logoContainer}
        >
          <Image
            source={require("../../assets/logo2.png")}
            style={styles.logo}
          />

          {/* Title */}
          <Text style={styles.title}>Sign In with Your Account</Text>

          {/* Form Section */}
          <TextInput
            label="Email or Phone"
            mode="flat"
            left={<TextInput.Icon icon="email" />}
            value={phoneOrEmail}
            onChangeText={setPhoneOrEmail}
            error={!!inputError}
            style={styles.input}
          />
          {inputError ? (
            <Text style={styles.errorText}>{inputError}</Text>
          ) : null}

          <TextInput
            label="Password"
            mode="flat"
            left={<TextInput.Icon icon="lock" />}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
            error={!!passwordError}
            style={styles.input}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          {/* Sign In Button */}
          <TouchableOpacity
            onPress={handleSignIn}
            style={styles.signInButton}
            contentStyle={{ paddingVertical: 10 }}
          >
            <Text
              style={{
                color: "#fff",
                fontFamily: "O-C-S-SemiBold",
                fontSize: 18,
              }}
            >
              Sign In
            </Text>
          </TouchableOpacity>

          {/* Don't have an account? Redirect to Sign Up */}
          <Text style={styles.dontHaveAccountText}>
            Don't have an account?{" "}
            <TouchableOpacity onPress={() => router.push("auth/sign_up")}>
              <Text style={styles.redirectText2}>Sign Up</Text>
            </TouchableOpacity>
          </Text>

          {/* Success Message Overlay */}
          {successMessageVisible && (
            <View style={styles.overlay}>
              <View style={styles.successMessage}>
                <User name="checkmark-circle" size={30} color="#12B74E" />
                <Text style={styles.successText}>Sign in successful!</Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </ImageBackground>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    width: "90%",
    height: "70%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    overflow: "hidden",
  },
  logoContainer: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: -20,
  },
  title: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "P-Medium",
  },
  input: {
    marginBottom: 20,
    borderBottomWidth: 1,
    backgroundColor: "transparent",
    width: "100%",
    fontFamily: "O-C-Light",
  },
  signInButton: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
    fontSize: 20,
    backgroundColor: "#36C2CE",
    width: "80%",
    height: "10%",
    borderWidth: 0.1,
    borderRadius: 20,
    elevation: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
  },
  dontHaveAccountText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
    marginTop: 20,
    fontFamily: "P-Regular",
  },
  redirectText2: {
    fontSize: 13,
    color: "#36C2CE",
    fontFamily: "O-C-Bold",
  },
  overlay: {
    position: "absolute", // Make the overlay absolutely positioned
    top: 20, // Position near the top
    right: 20, // Position near the right side
    zIndex: 999, // Ensure it's above other elements
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly transparent background
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
  },
  successMessage: {
    flexDirection: "row",
    alignItems: "center", // Align icon and text
  },
  successText: {
    color: "#36C2CE",
    fontWeight: "bold",
    marginLeft: 10,
    fontFamily: "Q-Medium",
  },
});

export default SignIn;
