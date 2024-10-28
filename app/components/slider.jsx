import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import axios from "axios";
import urls from "../urls"; // Ensure this points to your API URL
import Swiper from "react-native-swiper"; // Import Swiper
import { Text } from "react-native-paper";

// Get screen dimensions
const { width: screenWidth } = Dimensions.get("window");

const Slider = () => {
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all slider images from the API
  useEffect(() => {
    const fetchSliderImages = async () => {
      try {
        const response = await axios.get(`${urls}/api/v1/slider/get-slider`);

        if (Array.isArray(response.data.sliderData)) {
          setSliderImages(response.data.sliderData); // Access the sliderData array
        } else {
          console.error("Expected an array of images");
        }
      } catch (error) {
        console.error("Error fetching slider images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSliderImages();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#36C2CE" />;
  }

  return (
    <ImageBackground
      source={require("../../assets/Background2.png")}
      style={styles.sliderContainer}
    >
      <Swiper
        showsPagination={true}
        autoplay={true}
        autoplayTimeout={4}
        loop={true}
        dotColor="#aaa"
        activeDotColor="#36C2CE"
        paginationStyle={{
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
        }}
      >
        {sliderImages.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Image
              source={{ uri: `${urls}/api/v1/slider/get-slider/${item._id}` }} // Ensure correct image URL
              style={styles.sliderImage}
              onError={(e) =>
                console.error("Image load error", e.nativeEvent.error)
              }
            />
            <Text>{item.title}</Text>
          </View>
        ))}
      </Swiper>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    backgroundColor: "white",
    width: screenWidth, // Full width of the screen
    height: 200, // You can adjust the height as per your design
    borderRadius: 10,
  },
  sliderImage: {
    width: screenWidth * 0.9, // Slightly smaller than screen width to accommodate spacing
    height: 200, // Adjust height to fill the container
    resizeMode: "cover", // Use 'cover' to fit the image properly
    borderRadius: 8,
  },
  slide: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Slider;
