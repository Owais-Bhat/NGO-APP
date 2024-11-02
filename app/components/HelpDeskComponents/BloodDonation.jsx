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

const BloodDonation = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageType, setImageType] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    bloodGroup: "",
    units: "",
    age: "",
    addarNumber: "",
    gender: "",
    address: "",
  });

  const [donerImage, setDonerImage] = useState([]);
  const [addharImage, setAddharImage] = useState([]);

  const [errors, setErrors] = useState({});

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  const genderOptions = ["Male", "Female", "Other"];

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
        allowsMultipleSelection: true,
        quality: 1,
      });
    }

    if (!result.canceled) {
      const selectedImages = result.assets.map((image) => ({
        uri: image.uri,
        id: image.assetId || Math.random().toString(),
      }));

      if (imageType === "doner") {
        if (donerImage.length >= 1) {
          Alert.alert("Image Limit", "Only 1 donor image can be uploaded.");
        } else {
          setDonerImage([...donerImage, ...selectedImages.slice(0, 1)]);
        }
      } else if (imageType === "addhar") {
        if (addharImage.length >= 2) {
          Alert.alert("Image Limit", "Only 2 Aadhar images can be uploaded.");
        } else {
          setAddharImage([
            ...addharImage,
            ...selectedImages.slice(0, 2 - addharImage.length),
          ]);
        }
      }
    }
    closeMenu();
  };

  const handleRemoveImage = (type, imageId) => {
    if (type === "doner") {
      setDonerImage((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
      );
    } else if (type === "addhar") {
      setAddharImage((prevImages) =>
        prevImages.filter((image) => image.id !== imageId)
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
    if (donerImage.length === 0)
      newErrors.donerImage = "Please upload the donor image.";
    if (addharImage.length < 2)
      newErrors.addharImage = "Please upload both sides of your Aadhar card.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Add Donor Image
      if (donerImage.length > 0) {
        formDataToSend.append("DonerImage", {
          uri: donerImage[0].uri,
          type: "image/jpeg",
          name: "donerImage.jpg",
        });
      }

      // Add Aadhar images
      addharImage.forEach((image, index) => {
        formDataToSend.append("addharImage", {
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
        `${urls}/api/v1/blooddonation/bloodDonation_create`,
        formDataToSend,
        config
      );

      Alert.alert("Success", "Donation request submitted successfully!");

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
      });
      setDonerImage([]);
      setAddharImage([]);
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

          <Text style={styles.title}>Blood Donation Form</Text>

          <TextInput
            label="Your Name"
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
            style={styles.input}
            mode="outlined"
            error={!!errors.name}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}

          <TextInput
            label="Mobile Number"
            value={formData.mobile}
            onChangeText={(value) => handleChange("mobile", value)}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
            maxLength={10}
            error={!!errors.mobile}
          />
          {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}

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
            <Text style={styles.error}>{errors.addarNumber}</Text>
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
            <Text style={styles.error}>{errors.bloodGroup}</Text>
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
          {errors.units && <Text style={styles.error}>{errors.units}</Text>}

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
          {errors.age && <Text style={styles.error}>{errors.age}</Text>}

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
          {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}

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
          {errors.address && <Text style={styles.error}>{errors.address}</Text>}

          {/* Image Picker Sections */}
          <Text style={styles.imageLabel}>Donor Image:</Text>
          <View style={styles.imagePicker}>
            {renderImageList(donerImage, "doner")}
            <TouchableOpacity
              onPress={() => openMenu("doner")}
              style={styles.imageButton}
            >
              <Icons name="plus" size={20} color="white" />
              <Text style={styles.imageButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
          {errors.donerImage && (
            <Text style={styles.error}>{errors.donerImage}</Text>
          )}

          <Text style={styles.imageLabel}>Aadhar Images:</Text>
          <View style={styles.imagePicker}>
            {renderImageList(addharImage, "addhar")}
            <TouchableOpacity
              onPress={() => openMenu("addhar")}
              style={styles.imageButton}
            >
              <Icons name="plus" size={20} color="white" />
              <Text style={styles.imageButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>
          {errors.addharImage && (
            <Text style={styles.error}>{errors.addharImage}</Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            loading={loading}
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
  },
  input: {
    marginBottom: 10,
    backgroundColor: "white",
  },
  picker: {
    marginBottom: 10,
    backgroundColor: "#36C2CE",
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 12,
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

export default BloodDonation;
