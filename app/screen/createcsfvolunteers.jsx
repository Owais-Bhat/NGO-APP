import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
  Image,
} from "react-native";
import {
  TextInput,
  Text,
  Provider,
  Divider,
  Button as PaperButton,
} from "react-native-paper";
import Icon from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import urls from "../urls";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const CreateVolunteers = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [states, setState] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const fadeAnim = useState(new Animated.Value(0))[0];

  const navigation = useNavigation();

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required";
    if (!mobile) newErrors.mobile = "Mobile number is required";
    else if (mobile.length !== 10)
      newErrors.mobile = "Mobile must be 10 digits";
    if (!states) newErrors.states = "State is required";
    if (!city) newErrors.city = "City is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";
    if (!image) newErrors.image = "Please select an image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
        const source = { uri: selectedAsset.uri };
        setImage({
          uri: selectedAsset.uri,
          name: selectedAsset.fileName,
          type: selectedAsset.type,
        });
        setPreviewUrl(source.uri);
        setErrors({ ...errors, image: null });
      }
    });
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mobile", mobile);
    formData.append("states", states);
    formData.append("city", city);
    formData.append("email", email);
    if (image) {
      formData.append("image", image);
    }

    const userToken = await AsyncStorage.getItem("userToken");

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post(
        `${urls}/api/v1/volunteer/create_volunteer`,
        formData,
        config
      );

      Alert.alert("Success", "Volunteer created successfully!");
      clearForm();
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong!"
      );
    }
  };

  const clearForm = () => {
    setName("");
    setMobile("");
    setState("");
    setCity("");
    setEmail("");
    setImage(null);
    setPreviewUrl(null);
    setErrors({});
  };

  return (
    <Provider>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <SafeAreaView>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <Text style={styles.header}>Become Volunteer</Text>
            <Divider style={styles.divider} />

            <TextInput
              mode="outlined"
              label="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              error={!!errors.name}
              theme={inputTheme}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <TextInput
              mode="outlined"
              label="Mobile Number"
              value={mobile}
              onChangeText={(text) => {
                if (text.length <= 10) setMobile(text);
              }}
              keyboardType="numeric"
              style={styles.input}
              error={!!errors.mobile}
              theme={inputTheme}
            />
            {errors.mobile && (
              <Text style={styles.errorText}>{errors.mobile}</Text>
            )}

            <TextInput
              mode="outlined"
              label="State"
              value={states}
              onChangeText={setState}
              style={styles.input}
              error={!!errors.states}
              theme={inputTheme}
            />
            {errors.states && (
              <Text style={styles.errorText}>{errors.states}</Text>
            )}

            <TextInput
              mode="outlined"
              label="City"
              value={city}
              onChangeText={setCity}
              style={styles.input}
              error={!!errors.city}
              theme={inputTheme}
            />
            {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

            <TextInput
              mode="outlined"
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.input}
              error={!!errors.email}
              theme={inputTheme}
            />
            {errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TouchableOpacity
              style={styles.imageButton}
              onPress={handlePhotoChange}
            >
              <Icon name="image-outline" size={24} color="white" />
              <Text style={styles.imageButtonText}>Select Image</Text>
            </TouchableOpacity>
            {errors.image && (
              <Text style={styles.errorText}>{errors.image}</Text>
            )}

            {previewUrl && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: previewUrl }} style={styles.image} />
              </View>
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Create Volunteer</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
      </Animated.View>
    </Provider>
  );
};

const inputTheme = {
  colors: {
    primary: "#36C2CE",
    error: "#FF0000",
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  backButton: {
    marginBottom: 10,
  },
  header: {
    fontSize: 25,
    fontFamily: "Q-Medium",
    color: "#333",
    marginVertical: 15,
    alignSelf: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginBottom: 15,
  },
  input: {
    marginVertical: 8,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    marginLeft: 5,
    fontSize: 12,
  },
  imageButton: {
    backgroundColor: "#36C2CE",
    padding: 15,
    borderRadius: 10,
    marginVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imageButtonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
    fontFamily: "Q-Medium",
  },
  imagePreviewContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  submitButton: {
    backgroundColor: "#36C2CE",
    padding: 15,
    borderRadius: 10,
    marginVertical: 30,
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Q-Medium",
  },
});

export default CreateVolunteers;
