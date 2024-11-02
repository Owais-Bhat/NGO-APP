import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from "react-native";
import { TextInput, Button, Provider, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import urls from "../urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";

const CreateCsfMembers = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [father, setFather] = useState("");
  const [husband, setHusband] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [donation, setDonation] = useState("");
  const [errors, setErrors] = useState({});
  const fadeAnim = useState(new Animated.Value(0))[0];

  const router = useRouter();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!mobile) newErrors.mobile = "Mobile number is required";
    else if (mobile.length !== 10)
      newErrors.mobile = "Mobile must be 10 digits";
    if (!age) newErrors.age = "Age is required";
    if (!address) newErrors.address = "Address is required";
    if (!donation) newErrors.donation = "Donation amount is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const memberData = {
      name,
      mobile,
      father,
      husband,
      Age: age,
      education,
      DOB: dob,
      Address: address,
      Donation: donation,
    };

    const userToken = await AsyncStorage.getItem("userToken");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      const response = await axios.post(
        `${urls}/api/v1/member/create_members`,
        memberData,
        config
      );

      Alert.alert("Success", "Member created successfully!");
      clearForm();
    } catch (error) {
      Alert.alert(
        "Error",
        "Error creating member: " +
          (error.response?.data?.details || error.message)
      );
    }
  };

  const clearForm = () => {
    setName("");
    setMobile("");
    setFather("");
    setHusband("");
    setAge("");
    setEducation("");
    setDob("");
    setAddress("");
    setDonation("");
    setErrors({});
  };

  return (
    <Provider>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SafeAreaView>
            <TouchableOpacity
              onPress={() => router.push("tabs/home")}
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.header}>Create Member</Text>
            <Divider style={styles.divider} />

            <TextInput
              mode="outlined"
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              error={!!errors.name}
              theme={inputTheme}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              mode="outlined"
              label="Mobile Number"
              value={mobile}
              maxLength={10}
              onChangeText={(text) => {
                if (text.length <= 10) setMobile(text);
              }}
              keyboardType="numeric"
              style={styles.input}
              error={!!errors.mobile}
              theme={inputTheme}
            />
            {errors.mobile && (
              <Text style={styles.errorText}>{errors.mobile}</Text>
            )}

            <TextInput
              mode="outlined"
              label="Father's Name"
              value={father}
              onChangeText={setFather}
              style={styles.input}
              theme={inputTheme}
            />

            <TextInput
              mode="outlined"
              label="Husband's Name"
              value={husband}
              onChangeText={setHusband}
              style={styles.input}
              theme={inputTheme}
            />

            <TextInput
              mode="outlined"
              label="Age"
              maxLength={2}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              style={styles.input}
              error={!!errors.age}
              theme={inputTheme}
            />
            {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

            <TextInput
              mode="outlined"
              label="Education"
              value={education}
              onChangeText={setEducation}
              style={styles.input}
              theme={inputTheme}
            />

            <TextInput
              mode="outlined"
              label="Date of Birth"
              value={dob}
              onChangeText={setDob}
              style={styles.input}
              theme={inputTheme}
            />

            <TextInput
              mode="outlined"
              label="Address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              error={!!errors.address}
              theme={inputTheme}
              multiline
              numberOfLines={3}
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}

            <TextInput
              mode="outlined"
              label="Donation Amount"
              value={donation}
              onChangeText={setDonation}
              keyboardType="numeric"
              style={styles.input}
              error={!!errors.donation}
              theme={inputTheme}
            />
            {errors.donation && (
              <Text style={styles.errorText}>{errors.donation}</Text>
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Create Member</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </Animated.View>
    </Provider>
  );
};

const inputTheme = {
  colors: {
    primary: "#36C2CE",
    error: "#FF0000",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  backButton: {
    marginBottom: 10,
  },
  header: {
    fontSize: 25,
    fontFamily: "Q-Medium",
    color: "#333",
    marginVertical: 15,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 15,
  },
  input: {
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    marginLeft: 5,
    fontSize: 12,
  },
  submitButton: {
    backgroundColor: "#36C2CE",
    padding: 15,
    borderRadius: 10,
    marginVertical: 30,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Q-Medium",
  },
});

export default CreateCsfMembers;
