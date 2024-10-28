import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ScrollView,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { TextInput, Checkbox } from "react-native-paper";
import User from "react-native-vector-icons/Ionicons";
import axios from "axios";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import urls from "../urls";

const SignUp = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const geocode = await Location.reverseGeocodeAsync(location.coords);
      if (geocode.length > 0) {
        setAddress(
          `${geocode[0].street}, ${geocode[0].city}, ${geocode[0].region}, ${geocode[0].country}`
        );
      }
    })();
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateFullName = (name) => {
    const regex = /^[A-Z][a-zA-Z\s]+$/;
    return regex.test(name);
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };

  const validatePhoneNumber = (phone) => {
    return phone.length === 10 && /^\d+$/.test(phone);
  };

  const handleSubmit = async () => {
    if (!termsAccepted) {
      alert("Please accept the Terms and Conditions.");
      return;
    }

    const newErrors = {
      fullName: validateFullName(fullName)
        ? ""
        : "Full name must start with a capital letter and contain only letters.",
      email: validateEmail(email) ? "" : "Please enter a valid email address.",
      phoneNumber: validatePhoneNumber(phoneNumber)
        ? ""
        : "Phone number must be exactly 10 digits.",
      password: validatePassword(password)
        ? ""
        : "Password must be at least 8 characters, include a capital letter, and a symbol.",
    };
    setErrors(newErrors);

    if (Object.values(newErrors).every((error) => error === "")) {
      try {
        const response = await axios.post(`${urls}/api/v1/user/register`, {
          name: fullName,
          email: email,
          phone: phoneNumber,
          password: password,
          address: address,
        });

        // Store user data in AsyncStorage
        const userData = {
          id: response.data.user._id,
          name: fullName,
          email: email,
          phone: phoneNumber,
          address: address,
        };

        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        alert("Successfully signed up!");
        router.replace("/tabs/home");
      } catch (error) {
        if (error.response) {
          if (
            error.response.data.message ===
            "Email or phone number already registered"
          ) {
            alert(
              "Email or phone number is already registered. Please try another one."
            );
          } else {
            alert("Error signing up. Please try again.");
          }
        } else if (error.request) {
          alert("No response from the server. Please check your connection.");
        } else {
          alert("An error occurred. Please try again.");
        }
      }
    }
  };

  const handleFullNameChange = (name) => {
    const formattedName = name.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
    setFullName(formattedName);
    setErrors({
      ...errors,
      fullName: validateFullName(formattedName) ? "" : "Invalid name format.",
    });
  };

  const handleEmailChange = (input) => {
    setEmail(input);
    setErrors({
      ...errors,
      email: validateEmail(input) ? "" : "Invalid email format.",
    });
  };

  const handlePhoneNumberChange = (input) => {
    if (input.length <= 10) {
      setPhoneNumber(input.replace(/[^0-9]/g, ""));
      setErrors({
        ...errors,
        phoneNumber: validatePhoneNumber(input)
          ? ""
          : "Invalid phone number format.",
      });
    }
  };

  const handlePasswordChange = (input) => {
    setPassword(input);
    setErrors({
      ...errors,
      password: validatePassword(input) ? "" : "Invalid password format.",
    });
  };

  const handleAddressChange = (input) => {
    setAddress(input);
    setErrors({ ...errors, address: "" });
  };

  return (
    <LinearGradient colors={["#e5f6ff", "#e5f6ff"]} style={styles.container}>
      <ImageBackground
        source={require("../../assets/Background2.png")}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <User name="arrow-undo-outline" size={30} color="black" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Animated.Image
                source={require("../../assets/logo2.png")}
                style={[styles.logo]}
              />
            </View>
          </View>

          <Text style={styles.title}>Create Your Account</Text>

          <TextInput
            label="Full Name"
            left={<TextInput.Icon icon="account" />}
            mode="flat"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={handleFullNameChange}
            error={!!errors.fullName}
            style={styles.input}
          />
          {errors.fullName ? (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          ) : null}

          <TextInput
            label="Email"
            mode="flat"
            left={<TextInput.Icon icon="email" />}
            placeholder="Enter your email"
            value={email}
            onChangeText={handleEmailChange}
            error={!!errors.email}
            keyboardType="email-address"
            style={styles.input}
          />
          {errors.email ? (
            <Text style={styles.errorText}>{errors.email}</Text>
          ) : null}

          <TextInput
            label="Phone Number"
            mode="flat"
            left={<TextInput.Icon icon="phone" />}
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            error={!!errors.phoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
          />
          {errors.phoneNumber ? (
            <Text style={styles.errorText}>{errors.phoneNumber}</Text>
          ) : null}

          <TextInput
            label="Address"
            mode="flat"
            left={<TextInput.Icon icon="home" />}
            placeholder="Enter your address"
            value={address}
            onChangeText={handleAddressChange}
            error={!!errors.address}
            style={styles.input}
          />
          {errors.address ? (
            <Text style={styles.errorText}>{errors.address}</Text>
          ) : null}

          <TextInput
            label="Password"
            mode="flat"
            left={<TextInput.Icon icon="lock" />}
            value={password}
            placeholder="Enter your password"
            onChangeText={handlePasswordChange}
            secureTextEntry={!passwordVisible}
            right={
              <TextInput.Icon
                icon={passwordVisible ? "eye-off" : "eye"}
                onPress={() => setPasswordVisible(!passwordVisible)}
              />
            }
            error={!!errors.password}
            style={styles.input}
          />
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          <View style={styles.checkboxContainer}>
            <Checkbox
              status={termsAccepted ? "checked" : "unchecked"}
              onPress={() => setTermsAccepted(!termsAccepted)}
              color="black"
            />
            <Text style={styles.termsText}>
              I agree to the Terms and Conditions
            </Text>
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSubmit}
            disabled={!termsAccepted}
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.signInTextContainer}>
            Already have an account?
            <TouchableOpacity onPress={() => router.push("auth/sign_in")}>
              <Text style={styles.textredirect}>Sign In</Text>
            </TouchableOpacity>
          </Text>
        </ScrollView>
      </ImageBackground>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    marginVertical: -40,
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  logoContainer: {
    marginTop: 40,
    marginBottom: 20,

    borderColor: "#000000",
    borderRadius: 75,
    overflow: "hidden",
  },
  logo: {
    width: 100,
    height: 100,
    borderWidth: 0.5,
  },
  title: {
    fontSize: 20,

    color: "black",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "P-Medium",
  },
  input: {
    width: "100%",
    marginBottom: 10,
    backgroundColor: "transparent",
    fontFamily: "Q-Regular",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "100%",
  },
  termsText: {
    color: "black",
    fontFamily: "O-C-Medium",
    marginLeft: 8,
  },
  signUpButton: {
    backgroundColor: "#36C2CE",
    paddingVertical: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",

    elevation: 2,
  },
  signUpButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "O-C-Bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    fontFamily: "Q-Regular",
  },
  signInTextContainer: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: "O-C-Regular",
  },
  signInText: {
    color: "black",
    textAlign: "center",
  },
  textredirect: {
    fontFamily: "O-C-Bold",

    fontSize: 18,
    color: "#36C2CE",
  },
  eye: {
    color: "#74e8cb",
  },
});

export default SignUp;
