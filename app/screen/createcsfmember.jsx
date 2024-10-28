import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import urls from "../urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons"; // Importing Icons
import { useNavigation } from "@react-navigation/native"; // For navigation
import { Divider } from "react-native-paper";

const CreateCsfMembers = () => {
  // Separate state variables for each field
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [father, setFather] = useState("");
  const [husband, setHusband] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("");
  const [dob, setDob] = useState("");
  const [address, setAddress] = useState("");
  const [donation, setDonation] = useState("");

  const navigation = useNavigation(); // Get navigation hook

  // Handler to submit the form
  const handleSubmit = async () => {
    // Prepare member data with the correct field names
    const memberData = {
      name,
      mobile,
      father,
      husband,
      Age: age, // Updated to match schema
      education,
      DOB: dob, // Assuming you want to keep this as well
      Address: address, // Updated to match schema
      Donation: donation, // Updated to match schema
    };

    // Validate required fields
    if (!name || !mobile || !age || !address || !donation) {
      Alert.alert("Validation Error", "Please fill in all required fields.");
      return; // Stop the submission
    }
    const userToken = await AsyncStorage.getItem("userToken");
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`, // Include the token for authorization
        },
      };

      const response = await axios.post(
        `${urls}/api/v1/member/create_members`,
        memberData,
        config
      );

      console.log(response.data);
      Alert.alert("Success", "Member created successfully!");
      clearForm(); // Call function to clear the form
    } catch (error) {
      console.error("Error creating member:", error);
      Alert.alert(
        "Error",
        "Error creating member: " +
          (error.response?.data?.details || error.message)
      );
      // Handle error, e.g., show an alert
    }
  };

  // Function to clear the form
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
  };

  return (
    <View style={styles.container}>
      {/* Back arrow button */}
      <TouchableOpacity
        onPress={() => navigation.goBack("tabs/home")}
        style={styles.backButton}
      >
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Create Member</Text>
      <Divider
        style={{ height: 1, backgroundColor: "black", marginBottom: 15 }}
      />

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Father's Name"
        value={father}
        onChangeText={setFather}
      />

      <TextInput
        style={styles.input}
        placeholder="Husband's Name"
        value={husband}
        onChangeText={setHusband}
      />

      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Education"
        value={education}
        onChangeText={setEducation}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (DOB)"
        value={dob}
        onChangeText={setDob}
        // Use DatePicker for better date selection in production
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />

      <TextInput
        style={styles.input}
        placeholder="Donation Amount"
        value={donation}
        onChangeText={setDonation}
        keyboardType="numeric"
      />

      <Button title="Create Member" onPress={handleSubmit} color="#007BFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default CreateCsfMembers;
