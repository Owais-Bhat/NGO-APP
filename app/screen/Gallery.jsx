import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";
import urls from "../urls";
import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const Gallery = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]); // State to hold images fetched from API
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await axios.get(`${urls}/api/v1/admin/get_all_Image`);
        console.log(data, "Full data");

        // Extract and flatten image URLs from the response
        const fetchedImages = data.galleries.reduce((acc, gallery) => {
          return acc.concat(gallery.images.map((image) => image.url)); // Flatten images array
        }, []);

        console.log(fetchedImages, "Flattened images");
        setImages(fetchedImages); // Set the flattened array of image URLs
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Function to open the image popup
  const openImagePopup = (image) => {
    setSelectedImage(image); // Set the selected image
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null); // Reset selected image
  };

  // Render individual images in the grid
  const renderImage = ({ item }) => (
    <TouchableOpacity onPress={() => openImagePopup(item)}>
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  );

  // Show loading indicator if images are being fetched
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/Background2.png")} // Background image for the gallery
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("tabs/profile")}>
          <Icon name="arrow-left-circle" size={30} color="#36C2CE" />
        </TouchableOpacity>
        <Text style={styles.title}>Our Work</Text>
      </View>

      <FlatList
        data={images} // Array of image URLs
        renderItem={renderImage}
        keyExtractor={(item, index) => index.toString()} // Use index as key
        numColumns={2} // Display images in 2 columns
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal for image popup */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    color: "#000",
    marginLeft: "23%",
    fontFamily: "P-Medium",
  },
  grid: {
    justifyContent: "space-between",
  },
  image: {
    width: screenWidth / 2 - 40,
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
    margin: 10,
    borderWidth: 0.1, // Add a border
    borderColor: "black",
    elevation: 5, // Add a
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 20,
  },
  modalImage: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#36C2CE",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Gallery;
