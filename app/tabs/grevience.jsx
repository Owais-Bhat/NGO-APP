import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button, Menu, Divider, Provider } from "react-native-paper"; // Import Menu from react-native-paper
import urls from "../urls";
import Icons from "react-native-vector-icons/Feather";

const Grevience = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const fadeAnim = useState(new Animated.Value(0))[0];
  const [successModal, setSuccessModal] = useState(false);
  const fadeSuccessAnim = useState(new Animated.Value(0))[0];
  const bounceAnim = useState(new Animated.Value(1))[0];
  const router = useRouter();

  const [visible, setVisible] = useState(false); // State for the dropdown

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!phone) newErrors.phone = "Phone number is required";
    else if (phone.length !== 10) newErrors.phone = "Phone must be 10 digits";
    if (!address) newErrors.address = "Address is required";
    if (!description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      if (images.length + newImages.length <= 10) {
        setImages([...images, ...newImages]);
      } else {
        setErrors({ global: "You can only upload up to 10 images." });
      }
    }
  };

  const captureImage = async () => {
    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      if (images.length < 10) {
        setImages([...images, result.assets[0].uri]);
      } else {
        setErrors({ global: "You can only upload up to 10 images." });
      }
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const userId = await AsyncStorage.getItem("userId");
    const userToken = await AsyncStorage.getItem("userToken");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("mobile", phone);
      formData.append("subject", address);
      formData.append("text", description);
      formData.append("userId", userId);

      images.forEach((image, index) => {
        formData.append("images", {
          uri: image,
          type: "image/jpeg",
          name: `image_${index}.jpg`,
        });
      });

      await axios.post(`${urls}/api/v1/grievance/create_grievance`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userToken}`,
        },
      });

      setSuccessModal(true);
      Animated.timing(fadeSuccessAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setSuccessModal(false);
        setName("");
        setPhone("");
        setAddress("");
        setDescription("");
        setImages([]);
      }, 2000);
    } catch (error) {
      console.error("Error submitting grievance:", error);
      setErrors({ global: "Failed to submit grievance. Please try again." });
    }
  };

  return (
    <Provider>
      <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SafeAreaView>
            <Text style={styles.header}>Submit Grievance</Text>

            <TextInput
              style={styles.input}
              placeholder="Your Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#aaa"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={(text) => {
                if (text.length <= 10) setPhone(text);
              }}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            {errors.phone && (
              <Text style={styles.errorText}>{errors.phone}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              placeholderTextColor="#aaa"
            />
            {errors.address && (
              <Text style={styles.errorText}>{errors.address}</Text>
            )}

            <TextInput
              style={[styles.input, { textAlignVertical: "top" }]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline={true}
              placeholderTextColor="#aaa"
              numberOfLines={5}
            />
            {errors.description && (
              <Text style={styles.errorText}>{errors.description}</Text>
            )}

            <Menu
              visible={visible}
              onDismiss={closeMenu}
              anchor={
                <TouchableOpacity style={styles.imageButton} onPress={openMenu}>
                  <Icon name="plus" size={20} color="black" />
                  <Text
                    style={{
                      color: "black",
                      fontFamily: "P-Regular",
                      fontSize: 16,
                    }}
                  >
                    Add Images
                  </Text>
                </TouchableOpacity>
              }
            >
              <Menu.Item onPress={pickImages} title="Choose from Library" />
              <Divider />
              <Menu.Item onPress={captureImage} title="Take a Photo" />
            </Menu>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeImage(index)}
                  >
                    <Icons name="x" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            {errors.global && (
              <Text style={styles.errorText}>{errors.global}</Text>
            )}

            <TouchableOpacity
              mode="contained"
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "O-C-Medium",
                  fontSize: 20,
                }}
              >
                Submit
              </Text>
            </TouchableOpacity>

            <Animated.View
              style={[
                styles.messageButton,
                { transform: [{ scale: bounceAnim }] },
              ]}
            >
              <TouchableOpacity onPress={() => router.push("screen/message")}>
                <Icon name="message-text" size={20} color="white" />
              </TouchableOpacity>
            </Animated.View>
          </SafeAreaView>
        </ScrollView>

        <Modal visible={successModal} transparent animationType="fade">
          <Animated.View
            style={[styles.successOverlay, { opacity: fadeSuccessAnim }]}
          >
            <Icon name="check-circle" size={100} color="green" />
            <Text style={styles.successText}>Complaint Sent</Text>
          </Animated.View>
        </Modal>
      </Animated.View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 25,
    fontFamily: "P-Medium",
    color: "#333",
    marginVertical: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    fontFamily: "Q-Regular",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  imageButton: {
    flexDirection: "row",
    color: "#6200ee",
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  imageContainer: {
    marginHorizontal: 5,
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 15,
  },
  submitButton: {
    backgroundColor: "#36C2CE",
    padding: 10,

    borderRadius: 10,
    marginVertical: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "O-C-Regular",
  },
  messageButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#36C2CE",
    padding: 10,
    borderRadius: 50,
  },
  successOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  successText: {
    fontSize: 30,
    fontFamily: "Q-SemiBold",
    color: "green",
    marginTop: 20,
  },
});

export default Grevience;
