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

const ChildEducation = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    FatherName: "",
    mobile: "",
    age: "",
    aadhaarNumber: "",
    gender: "",
    course: "",
    address: "",
  });

  const [studentImage, setStudentImage] = useState([]);
  const [aadhaarImages, setAadhaarImages] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageType, setImageType] = useState("");
  const [loading, setLoading] = useState(false);

  const genderOptions = ["Male", "Female", "Other"];
  const courseOptions = ["Course 1", "Course 2", "Course 3"];

  const openMenu = (type) => {
    setImageType(type);
    setMenuVisible(true);
  };

  const closeMenu = () => setMenuVisible(false);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

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

      if (imageType === "student") {
        if (studentImage.length >= 1) {
          Alert.alert("Image Limit", "Only 1 student image can be uploaded.");
        } else {
          setStudentImage([...studentImage, ...selectedImages.slice(0, 1)]);
        }
      } else if (imageType === "aadhaar") {
        if (aadhaarImages.length >= 2) {
          Alert.alert("Image Limit", "Only 2 Aadhaar images can be uploaded.");
        } else {
          setAadhaarImages([
            ...aadhaarImages,
            ...selectedImages.slice(0, 2 - aadhaarImages.length),
          ]);
        }
      }
    }
    closeMenu();
  };

  const handleRemoveImage = (type, imageId) => {
    if (type === "student") {
      setStudentImage((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
    } else if (type === "aadhaar") {
      setAadhaarImages((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
    }
  };

  const validateForm = () => {
    if (!formData.name) {
      Alert.alert("Validation Error", "Please enter child's name.");
      return false;
    }
    if (!formData.FatherName) {
      Alert.alert("Validation Error", "Please enter father's name.");
      return false;
    }
    if (!formData.mobile || formData.mobile.length !== 10) {
      Alert.alert(
        "Validation Error",
        "Please enter a valid 10-digit mobile number."
      );
      return false;
    }
    if (!formData.age || isNaN(formData.age) || parseInt(formData.age) < 5) {
      Alert.alert("Validation Error", "Please enter a valid age.");
      return false;
    }
    if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
      Alert.alert("Validation Error", "Aadhaar number must be 12 digits.");
      return false;
    }
    if (!formData.gender) {
      Alert.alert("Validation Error", "Please select gender.");
      return false;
    }
    if (!formData.course) {
      Alert.alert("Validation Error", "Please select course.");
      return false;
    }
    if (!formData.address) {
      Alert.alert("Validation Error", "Please enter address.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Attach student image
      if (studentImage.length > 0) {
        formDataToSend.append("studentImage", {
          uri: studentImage[0].uri,
          type: "image/jpeg",
          name: "studentImage.jpg",
        });
      }

      // Attach Aadhaar images
      aadhaarImages.forEach((image, index) => {
        formDataToSend.append(`aadhaarImages_${index + 1}`, {
          uri: image.uri,
          type: "image/jpeg",
          name: `aadhaarImage_${index + 1}.jpg`,
        });
      });

      const userToken = await AsyncStorage.getItem("userToken");
      const { response } = await axios.post(
        `${urls}/api/v1/computer/create_education`,

        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Education registration successful!");
        // Reset form
        setFormData({
          name: "",
          FatherName: "",
          mobile: "",
          age: "",
          aadhaarNumber: "",
          gender: "",
          course: "",
          address: "",
        });
        setStudentImage([]);
        setAadhaarImages([]);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to submit form"
      );
    } finally {
      setLoading(false);
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
          <Text style={styles.title}>Child Education Registration</Text>

          <TextInput
            label="Child's Name"
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Father's Name"
            value={formData.FatherName}
            onChangeText={(value) => handleChange("FatherName", value)}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Mobile Number"
            value={formData.mobile}
            onChangeText={(value) => handleChange("mobile", value)}
            style={styles.input}
            keyboardType="phone-pad"
            maxLength={10}
            mode="outlined"
          />
          <TextInput
            label="Age"
            value={formData.age}
            onChangeText={(value) => handleChange("age", value)}
            style={styles.input}
            keyboardType="numeric"
            maxLength={2}
            mode="outlined"
          />
          <TextInput
            label="Aadhaar Number"
            value={formData.aadhaarNumber}
            onChangeText={(value) => handleChange("aadhaarNumber", value)}
            style={styles.input}
            keyboardType="numeric"
            maxLength={12}
            mode="outlined"
          />

          <Picker
            selectedValue={formData.gender}
            style={styles.picker}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <Picker.Item label="Select Gender" value="" />
            {genderOptions.map((option) => (
              <Picker.Item
                key={option}
                label={option}
                value={option.toLowerCase()}
              />
            ))}
          </Picker>

          <Picker
            selectedValue={formData.course}
            style={styles.picker}
            onValueChange={(value) => handleChange("course", value)}
          >
            <Picker.Item label="Select Course" value="" />
            {courseOptions.map((option) => (
              <Picker.Item
                key={option}
                label={option}
                value={option.toLowerCase()}
              />
            ))}
          </Picker>

          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={(value) => handleChange("address", value)}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.imageLabel}>Student Image:</Text>
          <View style={styles.imagePicker}>
            {renderImageList(studentImage, "student")}
            <TouchableOpacity
              onPress={() => openMenu("student")}
              style={styles.imageButton}
            >
              <Icons name="plus" size={20} color="white" />
              <Text style={styles.imageButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.imageLabel}>Aadhaar Images:</Text>
          <View style={styles.imagePicker}>
            {renderImageList(aadhaarImages, "aadhaar")}
            <TouchableOpacity
              onPress={() => openMenu("aadhaar")}
              style={styles.imageButton}
            >
              <Icons name="plus" size={20} color="white" />
              <Text style={styles.imageButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
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
    fontFamily: "P-Medium",
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
    backgroundColor: "#36C2CE",
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
    backgroundColor: "#36C2CE",
    padding: 10,
    borderRadius: 5,
  },
  imageButtonText: {
    color: "white",
    marginLeft: 5,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: "#36C2CE",
    borderRadius: 10,
    fontSize: 20,
    padding: 5,
  },
});

export default ChildEducation;
