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
import * as ImagePicker from "react-native-image-picker";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const ComputerClass = () => {
  const router = useRouter();

  // Separate state variables for each input field and image
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [addharNumber, setAddharNumber] = useState("");
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState("");
  const [address, setAddress] = useState("");
  const [studentImage, setStudentImage] = useState([]);
  const [addharImage, setAddharImage] = useState([]);

  const handleImagePicker = async (type) => {
    const result = await ImagePicker.launchImageLibrary();

    if (!result.didCancel && result.assets) {
      if (type === "student") {
        setStudentImage((prevImages) => [...prevImages, result.assets[0]]);
      } else if (type === "addhar") {
        setAddharImage((prevImages) => [...prevImages, result.assets[0]]);
      }
    }
  };

  const handleSubmit = () => {
    const formData = {
      name,
      fatherName,
      mobile,
      age,
      addharNumber,
      gender,
      course,
      address,
      studentImage,
      addharImage,
    };

    // Submit logic here
    console.log(formData);
    // Optionally navigate to another screen after submission
    // navigation.navigate('SomeScreen');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        onPress={() => router.push("tabs/home")}
        style={styles.backButton}
      >
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Computer Class Registration</Text>

      <TextInput
        placeholder="Student's Name"
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
        value={addharNumber}
        onChangeText={setAddharNumber}
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
        placeholder="Course"
        value={course}
        onChangeText={setCourse}
        style={styles.input}
      />
      <TextInput
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      {/* Button to pick Student Image */}
      <Button
        title="Pick Student Image"
        onPress={() => handleImagePicker("student")}
      />
      {studentImage.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image.uri }}
          style={styles.imagePreview}
        />
      ))}

      {/* Button to pick Aadhaar Image */}
      <Button
        title="Pick Aadhaar Image"
        onPress={() => handleImagePicker("addhar")}
      />
      {addharImage.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image.uri }}
          style={styles.imagePreview}
        />
      ))}

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

export default ComputerClass;
