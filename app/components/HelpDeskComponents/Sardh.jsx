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
import { Picker } from "@react-native-picker/picker";
import Icons from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import urls from "../../urls";

const Shradh = () => {
  const router = useRouter();

  // State management
  const [name, setName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobile, setMobile] = useState("");
  const [age, setAge] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");

  const [userImage, setUserImage] = useState([]);
  const [aadhaarImage, setAadhaarImage] = useState([]);
  const [homeImage, setHomeImage] = useState([]);

  const [menuVisible, setMenuVisible] = useState(false);
  const [imageType, setImageType] = useState("");

  const genderOptions = ["Male", "Female", "Other"];

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
    if (!address) {
      Alert.alert("Validation Error", "Please enter your address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("fatherName", fatherName);
    formData.append("mobile", mobile);
    formData.append("age", age);
    formData.append("aadhaarNumber", aadhaarNumber);
    formData.append("gender", gender);
    formData.append("address", address);

    // Attach images
    if (userImage.length > 0) {
      formData.append("userImage", {
        uri: userImage[0].uri,
        type: "image/jpeg",
        name: "userImage.jpg",
      });
    }

    aadhaarImage.forEach((image, index) => {
      formData.append(`aadhaarImage_${index + 1}`, {
        uri: image.uri,
        type: "image/jpeg",
        name: `aadhaarImage_${index + 1}.jpg`,
      });
    });

    homeImage.forEach((image, index) => {
      formData.append(`homeImage_${index + 1}`, {
        uri: image.uri,
        type: "image/jpeg",
        name: `homeImage_${index + 1}.jpg`,
      });
    });

    try {
      const userToken = await AsyncStorage.getItem("userToken");

      const response = await axios.post(
        `${urls}/api/v1/computer/create_shradhHelp`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Registration Successful!");
        // Reset form
        setName("");
        setFatherName("");
        setMobile("");
        setAge("");
        setAadhaarNumber("");
        setGender("");
        setAddress("");
        setUserImage([]);
        setAadhaarImage([]);
        setHomeImage([]);
      } else {
        Alert.alert("Error", "Registration Failed.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong.");
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
          <Text style={styles.title}>Shradh Registration</Text>

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
          <Picker
            selectedValue={gender}
            style={styles.picker}
            onValueChange={(itemValue) => setGender(itemValue)}
          >
            <Picker.Item label="Select Gender" value="" />
            {genderOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
          <TextInput
            label="Address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />

          {/* Image Picker Sections */}
          <Text style={styles.imageLabel}>User Image:</Text>
          <View style={styles.imagePicker}>
            {renderImageList(userImage, "user")}
            <TouchableOpacity
              onPress={() => openMenu("user")}
              style={styles.imageButton}
            >
              <Icons name="plus" size={20} color="white" />
              <Text style={styles.imageButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.imageLabel}>Aadhaar Image:</Text>
          <View style={styles.imagePicker}>
            {renderImageList(aadhaarImage, "aadhaar")}
            <TouchableOpacity
              onPress={() => openMenu("aadhaar")}
              style={styles.imageButton}
            >
              <Icons name="plus" size={20} color="white" />
              <Text style={styles.imageButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.imageLabel}>Home Image:</Text>
          <View style={styles.imagePicker}>
            {renderImageList(homeImage, "home")}
            <TouchableOpacity
              onPress={() => openMenu("home")}
              style={styles.imageButton}
            >
              <Icons name="plus" size={20} color="white" />
              <Text style={styles.imageButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
          >
            Submit
          </Button>
        </ScrollView>

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <Button onPress={() => openMenu(imageType)}>Show Menu</Button>
          }
        >
          <Menu.Item onPress={() => pickImage(true)} title="Take Photo" />
          <Menu.Item
            onPress={() => pickImage(false)}
            title="Choose from Gallery"
          />
        </Menu>
      </ImageBackground>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    marginTop: 60,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "white",
  },
  picker: {
    marginBottom: 10,
    backgroundColor: "white",
  },
  imageLabel: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  imagePicker: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  imageContainer: {
    marginRight: 10,
    position: "relative",
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  removeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    borderRadius: 10,
    padding: 2,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  imageButtonText: {
    color: "white",
    marginLeft: 5,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: "#007bff",
  },
});

export default Shradh;
