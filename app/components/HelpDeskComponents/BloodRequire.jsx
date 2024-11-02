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
import { Menu, Button, Provider, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Icons from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import urls from "../../urls";

const BloodRequire = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageType, setImageType] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    bloodGroup: "",
    units: "",
    age: "",
    addarNumber: "",
    gender: "",
    address: "",
    patientImage: [],
    addharImage: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const genderOptions = ["Male", "Female"];

  const openMenu = (type) => {
    setImageType(type);
    setMenuVisible(true);
  };

  const closeMenu = () => setMenuVisible(false);

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
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
        allowsMultipleSelection: imageType === "addharImage",
        quality: 1,
      });
    }

    if (!result.canceled) {
      const selectedImages = result.assets.map((image) => ({
        uri: image.uri,
        id: image.assetId || Math.random().toString(),
      }));

      if (imageType === "patientImage") {
        handleChange("patientImage", selectedImages.slice(0, 1));
      } else if (imageType === "addharImage") {
        if (formData.addharImage.length >= 2) {
          Alert.alert("Image Limit", "Only 2 Aadhar images can be uploaded.");
        } else {
          handleChange("addharImage", [
            ...formData.addharImage,
            ...selectedImages.slice(0, 2 - formData.addharImage.length),
          ]);
        }
      }
    }
    closeMenu();
  };

  const handleRemoveImage = (type, imageId) => {
    if (type === "patientImage") {
      handleChange("patientImage", []);
    } else if (type === "addharImage") {
      handleChange(
        "addharImage",
        formData.addharImage.filter((image) => image.id !== imageId)
      );
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.match(/^[a-zA-Z\s]+$/))
      newErrors.name = "Name must contain only letters.";
    if (formData.mobile.length !== 10 || isNaN(formData.mobile))
      newErrors.mobile = "Mobile number must be 10 digits.";
    if (formData.addarNumber.length !== 12 || isNaN(formData.addarNumber))
      newErrors.addarNumber = "Aadhar number must be 12 digits.";
    if (!formData.bloodGroup)
      newErrors.bloodGroup = "Please select a blood group.";
    if (!formData.age || isNaN(formData.age))
      newErrors.age = "Please enter a valid age.";
    if (!formData.units || isNaN(formData.units))
      newErrors.units = "Please enter the number of units.";
    if (!formData.gender) newErrors.gender = "Please select your gender.";
    if (!formData.address) newErrors.address = "Address cannot be empty.";
    if (formData.patientImage.length === 0)
      newErrors.patientImage = "Please upload the patient image.";
    if (formData.addharImage.length < 2)
      newErrors.addharImage = "Please upload both sides of your Aadhar card.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("mobile", formData.mobile);
      formDataToSend.append("bloodGroup", formData.bloodGroup);
      formDataToSend.append("units", formData.units);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("addarNumber", formData.addarNumber);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("address", formData.address);

      // Add patient image
      if (formData.patientImage.length > 0) {
        formDataToSend.append("patientImage", {
          uri: formData.patientImage[0].uri,
          type: "image/jpeg",
          name: "patientImage.jpg",
        });
      }

      // Add Aadhar images
      formData.addharImage.forEach((image, index) => {
        formDataToSend.append(`addharImage`, {
          uri: image.uri,
          type: "image/jpeg",
          name: `addharImage${index + 1}.jpg`,
        });
      });

      const userToken = await AsyncStorage.getItem("userToken");
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post(
        `${urls}/api/v1/blooddonation/bloodRequire_create`,
        formDataToSend,
        config
      );

      Alert.alert("Success", "Blood donation request submitted successfully!");
      // Reset form
      setFormData({
        name: "",
        mobile: "",
        bloodGroup: "",
        units: "",
        age: "",
        addarNumber: "",
        gender: "",
        address: "",
        patientImage: [],
        addharImage: [],
      });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form", error);
      const errorMessage =
        error.response?.data?.message || "Failed to submit donation request.";
      Alert.alert("Error", errorMessage);
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
          <Text style={styles.title}>Blood Require Form</Text>

          <TextInput
            label="Your Name"
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
            style={styles.input}
            mode="outlined"
            error={!!errors.name}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <TextInput
            label="Mobile Number"
            value={formData.mobile}
            onChangeText={(value) => handleChange("mobile", value)}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            maxLength={10}
            error={!!errors.mobile}
          />
          {errors.mobile && (
            <Text style={styles.errorText}>{errors.mobile}</Text>
          )}

          <Picker
            selectedValue={formData.bloodGroup}
            style={styles.picker}
            onValueChange={(value) => handleChange("bloodGroup", value)}
          >
            <Picker.Item label="Select Blood Group" value="" />
            {bloodGroups.map((group) => (
              <Picker.Item key={group} label={group} value={group} />
            ))}
          </Picker>
          {errors.bloodGroup && (
            <Text style={styles.errorText}>{errors.bloodGroup}</Text>
          )}

          <TextInput
            label="Number of Units"
            value={formData.units}
            onChangeText={(value) => handleChange("units", value)}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            error={!!errors.units}
          />
          {errors.units && <Text style={styles.errorText}>{errors.units}</Text>}

          <TextInput
            label="Age"
            value={formData.age}
            onChangeText={(value) => handleChange("age", value)}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            maxLength={3}
            error={!!errors.age}
          />
          {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}

          <TextInput
            label="Aadhar Number"
            value={formData.addarNumber}
            onChangeText={(value) => handleChange("addarNumber", value)}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            maxLength={12}
            error={!!errors.addarNumber}
          />
          {errors.addarNumber && (
            <Text style={styles.errorText}>{errors.addarNumber}</Text>
          )}

          <Picker
            selectedValue={formData.gender}
            style={styles.picker}
            onValueChange={(value) => handleChange("gender", value)}
          >
            <Picker.Item label="Select Gender" value="" />
            {genderOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
          {errors.gender && (
            <Text style={styles.errorText}>{errors.gender}</Text>
          )}

          <TextInput
            label="Address"
            value={formData.address}
            onChangeText={(value) => handleChange("address", value)}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
            error={!!errors.address}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}

          <Text style={styles.imageLabel}>Patient Image:</Text>
          <View style={styles.imagePicker}>
            {renderImageList(formData.patientImage, "patientImage")}
            <TouchableOpacity
              onPress={() => openMenu("patientImage")}
              style={styles.imageButton}
            >
              <Icons name="plus" size={20} color="white" />
              <Text style={styles.imageButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
          {errors.patientImage && (
            <Text style={styles.errorText}>{errors.patientImage}</Text>
          )}

          <Text style={styles.imageLabel}>Aadhar Images:</Text>
          <View style={styles.imagePicker}>
            {renderImageList(formData.addharImage, "addharImage")}
            <TouchableOpacity
              onPress={() => openMenu("addharImage")}
              style={styles.imageButton}
            >
              <Icons name="plus" size={20} color="white" />
              <Text style={styles.imageButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
          {errors.addharImage && (
            <Text style={styles.errorText}>{errors.addharImage}</Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            loading={loading}
          >
            {loading ? "Submitting..." : "Submit"}
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
    backgroundColor: "#36C2CE",
    padding: 5,
    borderRadius: 10,
  },
});

export default BloodRequire;
