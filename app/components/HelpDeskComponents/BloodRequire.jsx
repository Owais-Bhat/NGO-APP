import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker"; // Changed to expo-image-picker
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const BloodRequire = () => {
  const router = useRouter();

  // Separate state for each input
  const [name, setName] = useState("");
  const [patientImage, setPatientImage] = useState(null);
  const [mobile, setMobile] = useState("");
  const [aadharImages, setAadharImages] = useState([]);
  const [bloodGroup, setBloodGroup] = useState("");
  const [units, setUnits] = useState("");
  const [age, setAge] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  // Function to request permissions and pick an image
  const pickImage = async (setImageFunc) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "You need to allow access to the library."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageFunc(result.assets[0].uri); // Set the selected image URI
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("bloodGroup", bloodGroup);
    formData.append("units", units);
    formData.append("age", age);
    formData.append("aadharNumber", aadharNumber);
    formData.append("gender", gender);
    formData.append("address", address);

    // Append patient image
    if (patientImage) {
      formData.append("patientImage", {
        uri: patientImage,
        type: "image/jpeg",
        name: "patientImage.jpg",
      });
    }

    // Append Aadhar images
    aadharImages.forEach((image, index) => {
      formData.append(`aadharImage[${index}]`, {
        uri: image,
        type: "image/jpeg",
        name: `aadharImage${index}.jpg`,
      });
    });

    try {
      // Submit the form data to the backend API
      await axios.post(
        "https://yourapiurl.com/api/bloodRequire_create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Alert.alert("Success", "Blood requirement submitted successfully");
    } catch (error) {
      console.error("Error submitting form", error);
      Alert.alert("Error", "Failed to submit form");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("tabs/home")}
        style={styles.backButton}
      >
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter patient's name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Patient Image</Text>
      <TouchableOpacity
        style={styles.imageButton}
        onPress={() => pickImage(setPatientImage)}
      >
        <Text style={styles.imageButtonText}>Pick an Image</Text>
      </TouchableOpacity>
      {patientImage && (
        <Image source={{ uri: patientImage }} style={styles.image} />
      )}

      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter mobile number"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <Text style={styles.label}>Aadhar Images</Text>
      <TouchableOpacity
        style={styles.imageButton}
        onPress={() =>
          pickImage((uri) => setAadharImages([...aadharImages, uri]))
        }
      >
        <Text style={styles.imageButtonText}>Pick Aadhar Image</Text>
      </TouchableOpacity>
      {aadharImages.map((image, index) => (
        <Image key={index} source={{ uri: image }} style={styles.image} />
      ))}

      <Text style={styles.label}>Blood Group</Text>
      <Picker
        selectedValue={bloodGroup}
        onValueChange={setBloodGroup}
        style={styles.input}
      >
        <Picker.Item label="Select blood group" value="" />
        <Picker.Item label="A+" value="A+" />
        <Picker.Item label="A-" value="A-" />
        <Picker.Item label="B+" value="B+" />
        <Picker.Item label="B-" value="B-" />
        <Picker.Item label="O+" value="O+" />
        <Picker.Item label="O-" value="O-" />
        <Picker.Item label="AB+" value="AB+" />
        <Picker.Item label="AB-" value="AB-" />
      </Picker>

      <Text style={styles.label}>Units of Blood</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter units of blood"
        keyboardType="numeric"
        value={units}
        onChangeText={setUnits}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.label}>Aadhar Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Aadhar number"
        keyboardType="numeric"
        value={aadharNumber}
        onChangeText={setAadharNumber}
      />

      <Text style={styles.label}>Gender</Text>
      <Picker
        selectedValue={gender}
        onValueChange={setGender}
        style={styles.input}
      >
        <Picker.Item label="Select gender" value="" />
        <Picker.Item label="Male" value="Male" />
        <Picker.Item label="Female" value="Female" />
        <Picker.Item label="Other" value="Other" />
      </Picker>

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
        multiline
      />

      <Button title="Submit Blood Requirement" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  imageButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 10,
  },
  imageButtonText: {
    color: "white",
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
  },
});

export default BloodRequire;
