import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { Button, Menu, Provider } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";

const MedicalHelp = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [addarNumber, setAddarNumber] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [userImage, setUserImage] = useState([]);
  const [addharImage, setAddharImage] = useState([]);
  const [homeImage, setHomeImage] = useState([]);
  const [medicalImage, setMedicalImage] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageType, setImageType] = useState("");

  const openMenu = (type) => {
    setImageType(type);
    setMenuVisible(true);
  };

  const closeMenu = () => setMenuVisible(false);

  const handleImagePicker = async (type) => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
    };

    const result = await ImagePicker.launchImageLibrary(options);

    if (!result.didCancel && result.assets) {
      const selectedImage = result.assets[0];
      if (type === "userImage") {
        setUserImage((prev) => [...prev, selectedImage]);
      } else if (type === "addharImage") {
        setAddharImage((prev) => [...prev, selectedImage]);
      } else if (type === "homeImage") {
        setHomeImage((prev) => [...prev, selectedImage]);
      } else if (type === "medicalImage") {
        setMedicalImage((prev) => [...prev, selectedImage]);
      }
    }
    closeMenu();
  };

  const handleSubmit = () => {
    const formData = {
      name,
      fatherName,
      mobile,
      age,
      addarNumber,
      gender,
      address,
      userImage,
      addharImage,
      homeImage,
      medicalImage,
    };
    console.log(formData); // You can replace this with your actual submit logic
  };

  return (
    <Provider>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => router.push("tabs/home")}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <Text style={styles.title}>Medical Help Registration</Text>

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

        {/* Image Picker for User Image */}
        <Menu
          visible={menuVisible && imageType === "userImage"}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => openMenu("userImage")}
            >
              <Text style={styles.imagePickerText}>Pick User Image</Text>
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => handleImagePicker("userImage")}
            title="Pick from Gallery"
          />
        </Menu>
        {userImage.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.uri }}
            style={styles.imagePreview}
          />
        ))}

        {/* Image Picker for Aadhaar Image */}
        <Menu
          visible={menuVisible && imageType === "addharImage"}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => openMenu("addharImage")}
            >
              <Text style={styles.imagePickerText}>Pick Aadhaar Image</Text>
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => handleImagePicker("addharImage")}
            title="Pick from Gallery"
          />
        </Menu>
        {addharImage.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.uri }}
            style={styles.imagePreview}
          />
        ))}

        {/* Image Picker for Home Image */}
        <Menu
          visible={menuVisible && imageType === "homeImage"}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => openMenu("homeImage")}
            >
              <Text style={styles.imagePickerText}>Pick Home Image</Text>
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => handleImagePicker("homeImage")}
            title="Pick from Gallery"
          />
        </Menu>
        {homeImage.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.uri }}
            style={styles.imagePreview}
          />
        ))}

        {/* Image Picker for Medical Image */}
        <Menu
          visible={menuVisible && imageType === "medicalImage"}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={() => openMenu("medicalImage")}
            >
              <Text style={styles.imagePickerText}>Pick Medical Image</Text>
            </TouchableOpacity>
          }
        >
          <Menu.Item
            onPress={() => handleImagePicker("medicalImage")}
            title="Pick from Gallery"
          />
        </Menu>
        {medicalImage.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.uri }}
            style={styles.imagePreview}
          />
        ))}

        <Button
          mode="contained"
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          Submit
        </Button>
      </ScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    marginBottom: 16,
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
  imagePickerButton: {
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: "#e6e6e6",
    borderRadius: 8,
    alignItems: "center",
  },
  imagePickerText: {
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 10,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default MedicalHelp;
