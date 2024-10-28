import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import urls from "../urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons"; // Importing Icons
import { useNavigation } from "@react-navigation/native"; // For navigation
import { launchImageLibrary } from "react-native-image-picker"; // Importing Image Picker

const CreateVolunteers = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [states, setState] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const navigation = useNavigation();

  const handlePhotoChange = () => {
    const options = {
      mediaType: "photo",
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.assets) {
        const selectedAsset = response.assets[0];
        const source = { uri: selectedAsset.uri }; // Set the selected image
        setImage({
          uri: selectedAsset.uri,
          name: selectedAsset.fileName,
          type: selectedAsset.type,
        });
        setPreviewUrl(source.uri); // Create a preview URL for the selected file
      }
    });
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("states", states);
    formData.append("city", city);
    formData.append("email", email);

    if (image) {
      formData.append("image", image);
    } else {
      Alert.alert("Error", "Please select an image.");
      return;
    }

    console.log(name, "name");
    console.log(mobile, "mobile");
    console.log(states, "states");
    console.log(city, "city");
    console.log(email, "email");
    console.log(image, "image");

    const userToken = await AsyncStorage.getItem("userToken");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        `${urls}/api/v1/volunteer/create_volunteer`,
        formData,
        config
      );

      Alert.alert("Success", "Volunteer created successfully!");
      // Reset form after successful submission
      setName("");
      setMobile("");
      setState("");
      setCity("");
      setEmail("");
      setImage(null);
      setPreviewUrl(null);
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong!"
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Back arrow button */}
      <TouchableOpacity
        onPress={() => navigation.goBack("tabs/home")}
        style={styles.backButton}
      >
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Become Volunteer</Text>
      <Divider
        style={{ height: 1, backgroundColor: "black", marginBottom: 15 }}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Volunteer Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Volunteer Mobile"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Volunteer State"
        value={states}
        onChangeText={setState}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Volunteer City"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Volunteer Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Button to select an image */}
      <TouchableOpacity style={styles.imageButton} onPress={handlePhotoChange}>
        <Text style={styles.imageButtonText}>Select Image</Text>
      </TouchableOpacity>

      {/* Preview selected image */}
      {previewUrl && (
        <Image source={{ uri: previewUrl }} style={styles.image} />
      )}

      <Button title="Create Volunteer" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
  },
  imageButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
  },
  imageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 15,
    alignSelf: "center",
  },
});

export default CreateVolunteers;
