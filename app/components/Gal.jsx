import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from "react-native";
import axios from "axios";
import Swiper from "react-native-swiper";
import urls from "../urls";

const { width: screenWidth } = Dimensions.get("window");

const Gal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // Get the latest 20 images
        const latestImages = fetchedImages.slice(0, 20);
        setImages(latestImages); // Set the latest images
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  // Open image popup
  const openImagePopup = (image) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Show loader while fetching images
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#36C2CE" />
      </View>
    );
  }

  // Create rows of images
  const rows = [];
  for (let i = 0; i < images.length; i += 3) {
    rows.push(images.slice(i, i + 3));
  }

  return (
    <View style={styles.container}>
      {/* Swiper component for the gallery */}
      <Swiper
        style={styles.wrapper}
        showsButtons={true}
        loop={false}
        showsPagination={false}
      >
        {rows.map((row, rowIndex) => (
          <View style={styles.row} key={rowIndex}>
            {row.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={styles.imageContainer}
                onPress={() => openImagePopup(image)}
              >
                <ImageBackground
                  source={{ uri: image }} // Use the image as background
                  style={styles.cardContainer}
                  imageStyle={styles.cardBackgroundImage} // Adjust background image style
                >
                  <Text style={styles.cardText}>Tap to view</Text>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </Swiper>

      {/* Modal for selected image */}
      <Modal visible={modalVisible} transparent={false} animationType="fade">
        <View style={styles.modalContainer}>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.modalImage} />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 10, // Distribute space evenly
    marginBottom: 10,
  },
  imageContainer: {
    width: screenWidth / 3 - 15, // Each image will take up 1/3 of the width with some margin
    height: 120, // Set desired height
  },
  cardContainer: {
    flex: 1,
    justifyContent: "flex-end", // Align text to the bottom
    borderRadius: 10,
    overflow: "hidden", // Ensure the border radius works on the background
  },
  cardBackgroundImage: {
    borderRadius: 10,
  },
  cardText: {
    color: "#fff", // Text color for better visibility
    padding: 5,
    textAlign: "center", // Center the text
    backgroundColor: "#36C2CE", // Optional: add a background for contrast
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  modalImage: {
    width: "100%", // Make the image full width
    height: "100%", // Make the image full height
    resizeMode: "contain", // Adjust as needed (cover, contain)
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "#36C2CE", // Semi-transparent background
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    width: "100%",
  },
});

export default Gal;
