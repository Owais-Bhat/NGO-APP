import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Icon from "react-native-vector-icons/Ionicons";
import { useRouter } from "expo-router";
import axios from "axios";
import urls from "../../urls"; // Ensure your API routes are correct
import * as ImagePicker from "expo-image-picker";

const BloodDonation = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    DonerImage: null,
    mobile: "",
    addharImage: [],
    bloodGroup: "",
    units: "",
    age: "",
    addarNumber: "",
    gender: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const userToken = "your-auth-token";

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const pickImage = async (name, multiple = false) => {
    // Request permission for accessing the image library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      ...(multiple && { allowsMultipleSelection: true }),
    });

    if (!result.canceled) {
      if (multiple) {
        const selectedImages = result.assets.map((asset) => asset.uri);
        handleChange(name, selectedImages);
      } else {
        handleChange(name, result.assets[0].uri);
      }
    } else {
      Alert.alert("Image selection canceled.");
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
    if (!formData.DonerImage)
      newErrors.DonerImage = "Please upload the donor image.";
    if (formData.addharImage.length < 2)
      newErrors.addharImage = "Please upload both sides of your Aadhar card.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // if (!validate()) return;

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

      if (formData.DonerImage) {
        const file = {
          uri: formData.DonerImage,
          name: "donerImage.jpg",
          type: "image/jpeg",
        };
        formDataToSend.append("DonerImage", file);
      }

      if (formData.addharImage.length) {
        formData.addharImage.forEach((image, index) => {
          const file = {
            uri: image,
            name: `addharImage${index + 1}.jpg`,
            type: "image/jpeg",
          };
          formDataToSend.append("addharImage", file);
        });
      }

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

      // Reset form data after submission
      setFormData({
        name: "",
        DonerImage: null,
        mobile: "",
        addharImage: [],
        bloodGroup: "",
        units: "",
        age: "",
        addarNumber: "",
        gender: "",
        address: "",
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

  return (
    <ImageBackground
      source={{
        uri: "https://w7.pngwing.com/pngs/424/92/png-transparent-blood-donation-drop-droplet-miscellaneous-donation-fictional-character-thumbnail.png",
      }}
      style={styles.background}
      blurRadius={5}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => router.push("tabs/home")}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Blood Donation Form</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={formData.name}
            onChangeText={(value) => handleChange("name", value)}
          />
          {errors.name && <Text style={styles.error}>{errors.name}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile"
            value={formData.mobile}
            onChangeText={(value) => handleChange("mobile", value)}
            keyboardType="numeric"
          />
          {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}
          <TouchableOpacity
            onPress={() => pickImage("DonerImage")}
            style={styles.input}
          >
            <Text>Pick Donor Image</Text>
          </TouchableOpacity>
          {errors.DonerImage && (
            <Text style={styles.error}>{errors.DonerImage}</Text>
          )}
          {formData.DonerImage && (
            <Image
              source={{ uri: formData.DonerImage }}
              style={styles.imagePreview}
            />
          )}
          <TouchableOpacity
            onPress={() => pickImage("addharImage", true)}
            style={styles.input}
          >
            <Text>Pick Aadhar Images (Both sides)</Text>
          </TouchableOpacity>
          {errors.addharImage && (
            <Text style={styles.error}>{errors.addharImage}</Text>
          )}
          {formData.addharImage.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={styles.imagePreview}
            />
          ))}
          <RNPickerSelect
            onValueChange={(value) => handleChange("bloodGroup", value)}
            items={[
              { label: "A+", value: "A+" },
              { label: "A-", value: "A-" },
              { label: "B+", value: "B+" },
              { label: "B-", value: "B-" },
              { label: "AB+", value: "AB+" },
              { label: "AB-", value: "AB-" },
              { label: "O+", value: "O+" },
              { label: "O-", value: "O-" },
            ]}
            style={styles.picker}
            value={formData.bloodGroup || ""} // Default to empty string if null
            placeholder={{ label: "Select Blood Group", value: undefined }} // Use undefined here
          />

          {errors.bloodGroup && (
            <Text style={styles.error}>{errors.bloodGroup}</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            value={formData.age}
            onChangeText={(value) => handleChange("age", value)}
            keyboardType="numeric"
          />
          {errors.age && <Text style={styles.error}>{errors.age}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Enter units"
            value={formData.units}
            onChangeText={(value) => handleChange("units", value)}
            keyboardType="numeric"
          />
          {errors.units && <Text style={styles.error}>{errors.units}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Enter Aadhar Number"
            value={formData.addarNumber}
            onChangeText={(value) => handleChange("addarNumber", value)}
            keyboardType="numeric"
          />
          {errors.addarNumber && (
            <Text style={styles.error}>{errors.addarNumber}</Text>
          )}
          <RNPickerSelect
            onValueChange={(value) => handleChange("gender", value)}
            items={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
            style={styles.picker}
            value={formData.gender || ""} // Default to empty string if null
            placeholder={{ label: "Select Gender", value: undefined }} // Use undefined here
          />

          {errors.gender && <Text style={styles.error}>{errors.gender}</Text>}
          <TextInput
            style={styles.input}
            placeholder="Enter your address"
            value={formData.address}
            onChangeText={(value) => handleChange("address", value)}
          />
          {errors.address && <Text style={styles.error}>{errors.address}</Text>}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
    flex: 1,
    justifyContent: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 8,
  },
  picker: {
    inputIOS: {
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      color: "black",
      marginVertical: 8,
    },
    inputAndroid: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 5,
      color: "black",
      marginVertical: 8,
    },
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  imagePreview: {
    width: "100%",
    height: 100,
    marginVertical: 8,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  backButton: {
    marginBottom: 16,
  },
});

export default BloodDonation;
