import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const Sardh = () => {
  const router = useRouter();

  // Simple state definition
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [addarNumber, setAddarNumber] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [addharImage, setAddharImage] = useState(null);
  const [homeImage, setHomeImage] = useState(null);

  const handleImagePicker = async (setImage) => {
    const result = await ImagePicker.launchImageLibrary();

    if (!result.didCancel && result.assets) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    // Prepare data for API submission
    formData.append("name", name);
    formData.append("fatherName", fatherName);
    formData.append("mobile", mobile);
    formData.append("age", age);
    formData.append("addarNumber", addarNumber);
    formData.append("gender", gender);
    formData.append("address", address);

    // Append images as files
    if (userImage) {
      formData.append("userImage", {
        uri: userImage.uri,
        type: userImage.type,
        name: userImage.fileName,
      });
    }
    if (addharImage) {
      formData.append("addharImage", {
        uri: addharImage.uri,
        type: addharImage.type,
        name: addharImage.fileName,
      });
    }
    if (homeImage) {
      formData.append("homeImage", {
        uri: homeImage.uri,
        type: homeImage.type,
        name: homeImage.fileName,
      });
    }

    // API submission logic
    try {
      const response = await fetch("YOUR_API_ENDPOINT", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      console.log(data);
      // Handle successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
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
      <Text style={styles.title}>Sardh Registration</Text>

      <TextInput
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Father's Name"
        value={fatherName}
        onChangeText={setFatherName}
        style={styles.input}
      />
      <TextInput
        placeholder="Mobile Number"
        value={mobile}
        onChangeText={setMobile}
        style={styles.input}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Age"
        value={age}
        onChangeText={setAge}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Aadhaar Number"
        value={addarNumber}
        onChangeText={setAddarNumber}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Gender"
        value={gender}
        onChangeText={setGender}
        style={styles.input}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      {/* Button to pick User Image */}
      <Button
        title="Pick User Image"
        onPress={() => handleImagePicker(setUserImage)}
      />
      {userImage && (
        <Image source={{ uri: userImage.uri }} style={styles.imagePreview} />
      )}

      {/* Button to pick Aadhaar Image */}
      <Button
        title="Pick Aadhaar Image"
        onPress={() => handleImagePicker(setAddharImage)}
      />
      {addharImage && (
        <Image source={{ uri: addharImage.uri }} style={styles.imagePreview} />
      )}

      {/* Button to pick Home Image */}
      <Button
        title="Pick Home Image"
        onPress={() => handleImagePicker(setHomeImage)}
      />
      {homeImage && (
        <Image source={{ uri: homeImage.uri }} style={styles.imagePreview} />
      )}

      <Button title="Submit" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default Sardh;
