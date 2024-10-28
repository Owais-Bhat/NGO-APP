import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  Alert,
  ImageBackground,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

import { useRouter } from "expo-router";
import { Menu, Button, Provider, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker"; // Using Picker for dropdown
import Icons from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Ionicons";

const Kanyadaan = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState("");
  const [address, setAddress] = useState("");

  const [userImage, setUserImage] = useState([]);
  const [aadhaarImage, setAadhaarImage] = useState([]);
  const [homeImage, setHomeImage] = useState([]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [imageType, setImageType] = useState("");

  const genderOptions = ["Male", "Female", "Other"]; // Gender options

  const openMenu = (type) => {
    setImageType(type);
    setMenuVisible(true);
  };

  const closeMenu = () => setMenuVisible(false);

  const pickImage = async (fromCamera) => {
    let result;

    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });
    }

    if (!result.canceled) {
      const selectedImages = result.assets.map((image) => ({
        uri: image.uri,
        id: image.assetId || Math.random().toString(),
      }));

      if (imageType === "user") {
        if (userImage.length >= 1) {
          Alert.alert("Image Limit", "Only 1 user image can be uploaded.");
        } else {
          setUserImage([...userImage, ...selectedImages.slice(0, 1)]);
        }
      } else if (imageType === "aadhaar") {
        if (aadhaarImage.length >= 2) {
          Alert.alert("Image Limit", "Only 2 Aadhaar images can be uploaded.");
        } else {
          setAadhaarImage([
            ...aadhaarImage,
            ...selectedImages.slice(0, 2 - aadhaarImage.length),
          ]);
        }
      } else if (imageType === "home") {
        if (homeImage.length >= 4) {
          Alert.alert("Image Limit", "Only 4 home images can be uploaded.");
        } else {
          setHomeImage([
            ...homeImage,
            ...selectedImages.slice(0, 4 - homeImage.length),
          ]);
        }
      }
    }
    closeMenu();
  };

  const handleRemoveImage = (type, imageId) => {
    if (type === "user") {
      setUserImage((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
    } else if (type === "aadhaar") {
      setAadhaarImage((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
    } else if (type === "home") {
      setHomeImage((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
    }
  };

  // Validation functions
  const validateForm = () => {
    if (!name) {
      Alert.alert("Validation Error", "Please enter your name.");
      return false;
    }
    if (!fatherName) {
      Alert.alert("Validation Error", "Please enter your father's name.");
      return false;
    }
    if (!mobile || mobile.length !== 10) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid 10-digit mobile number."
      );
      return false;
    }
    if (!age || isNaN(age) || parseInt(age) < 18) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid age (18 or above)."
      );
      return false;
    }
    if (!aadhaarNumber || aadhaarNumber.length !== 12) {
      Alert.alert("Validation Error", "Aadhaar number must be 12 digits.");
      return false;
    }
    if (!gender) {
      Alert.alert("Validation Error", "Please select your gender.");
      return false;
    }
    if (!course) {
      Alert.alert("Validation Error", "Please enter your course.");
      return false;
    }
    if (!address) {
      Alert.alert("Validation Error", "Please enter your address.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formData = {
        name,
        fatherName,
        mobile,
        age,
        aadhaarNumber,
        gender,
        course,
        address,
        userImage,
        aadhaarImage,
        homeImage,
      };

      console.log(formData);
      // Submit logic here
    }
  };

  const renderImageList = (images, type) => {
    return (
      <FlatList
        horizontal
        data={images}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item.uri }} style={styles.imagePreview} />
            <TouchableOpacity
              onPress={() => handleRemoveImage(type, item.id)}
              style={styles.removeButton}
            >
              <Icon name="close" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    );
  };

  return (
    <Provider>
      <ImageBackground
        source={require("../../../assets/Background2.png")}
        style={styles.backgroundImage}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <TouchableOpacity
            onPress={() => router.push("tabs/home")}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Kanyadaan Registration</Text>

          <TextInput
            label="Your Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Father's Name"
            value={fatherName}
            onChangeText={setFatherName}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            style={styles.input}
            maxLength={10}
            keyboardType="phone-pad"
            mode="outlined"
          />
          <TextInput
            label="Age"
            value={age}
            onChangeText={setAge}
            style={styles.input}
            maxLength={3}
            keyboardType="numeric"
            mode="outlined"
          />
          <TextInput
            label="Aadhaar Number"
            value={aadhaarNumber}
            onChangeText={setAadhaarNumber}
            style={styles.input}
            keyboardType="numeric"
            maxLength={12}
            mode="outlined"
          />

          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownLabel}>Gender</Text>
            <Picker
              selectedValue={gender}
              style={styles.dropdown}
              onValueChange={(itemValue) => setGender(itemValue)}
            >
              <Picker.Item label="Select Gender" value="" />
              {genderOptions.map((genderOption, index) => (
                <Picker.Item
                  key={index}
                  label={genderOption}
                  value={genderOption}
                />
              ))}
            </Picker>
          </View>

          <TextInput
            label="Course"
            value={course}
            onChangeText={setCourse}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            mode="outlined"
          />

          {/* User Image Picker */}
          <Menu
            visible={menuVisible && imageType === "user"}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={() => openMenu("user")}
              >
                <Icons name="plus" size={24} color="black" />
                <Text style={styles.imagePickerText}>Pick User Image</Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => pickImage(false)}
              title="Choose from Gallery"
            />
            <Menu.Item onPress={() => pickImage(true)} title="Take Photo" />
          </Menu>
          {renderImageList(userImage, "user")}

          {/* Aadhaar Image Picker */}
          <Menu
            visible={menuVisible && imageType === "aadhaar"}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={() => openMenu("aadhaar")}
              >
                <Icons name="plus" size={24} color="black" />
                <Text style={styles.imagePickerText}>Pick Aadhaar Image</Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => pickImage(false)}
              title="Choose from Gallery"
            />
            <Menu.Item onPress={() => pickImage(true)} title="Take Photo" />
          </Menu>
          {renderImageList(aadhaarImage, "aadhaar")}

          {/* Home Image Picker */}
          <Menu
            visible={menuVisible && imageType === "home"}
            onDismiss={closeMenu}
            anchor={
              <TouchableOpacity
                style={styles.imagePickerButton}
                onPress={() => openMenu("home")}
              >
                <Icons name="plus" size={24} color="black" />
                <Text style={styles.imagePickerText}>Pick Home Image</Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => pickImage(false)}
              title="Choose from Gallery"
            />

            <Menu.Item onPress={() => pickImage(true)} title="Take Photo" />
          </Menu>
          {renderImageList(homeImage, "home")}

          <Button
            mode="contained"
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            Submit
          </Button>
        </ScrollView>
      </ImageBackground>
    </Provider>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "P-SemiBold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  dropdownContainer: {
    marginBottom: 12,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    backgroundColor: "#36C2CE",
  },
  imagePickerButton: {
    marginBottom: 12,
    paddingVertical: 8,

    flexDirection: "row",
    alignItems: "center",

    gap: 8,
  },
  imagePickerText: {
    fontSize: 16,
    fontFamily: "P-Medium",
  },
  imageContainer: {
    flexDirection: "row",
    marginRight: 8,
    position: "relative",
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 50,
    padding: 4,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: "#36C2CE",
    borderRadius: 8,
  },
});

export default Kanyadaan;
