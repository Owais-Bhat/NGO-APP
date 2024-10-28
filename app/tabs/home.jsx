import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Modal,
  Animated,
  Image,
} from "react-native";
import Slider from "../components/slider";
import Blog from "../components/blogList";
import Header from "../components/header";
import Categories from "../components/Categories";
import VolCard from "../components/VolCard";
import { Button, Divider } from "react-native-paper";
import Gal from "../components/Gal";
import HelpDesk from "../components/HelpDesk";
// import MarqueeLabel from "react-native-marquee-label";

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleImagePress = (image) => {
    setSelectedImage(image);
    setModalVisible(true);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <Header />
      <Divider />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <Categories />
        <Divider style={{ height: 2, backgroundColor: "#f2f2f2" }} />

        <View>
          <Text style={styles.title}>Top Programs</Text>
          <View style={styles.underline} />
          <Slider />
        </View>
        <Divider
          style={{ marginTop: 20, height: 2, backgroundColor: "#f2f2f2" }}
        />
        <ImageBackground
          source={require("../../assets/donation.jpg")}
          style={styles.donationContainer}
          imageStyle={styles.imageStyle}
        >
          <TouchableOpacity>
            <Button
              mode="contained"
              onPress={() => handleImagePress(require("../../assets/qr.jpeg"))}
              color="#3f51b5"
              style={{ backgroundColor: "#36C2CE", marginBottom: 20 }}
            >
              Donate
            </Button>
          </TouchableOpacity>
        </ImageBackground>
        {/* <View style={styles.container}>
          <MarqueeLabel
            style={styles.tagline}
            duration={10000} // Duration for one cycle in milliseconds
            marqueeOnStart={true} // Start scrolling immediately
            marqueeDelay={1000} // Delay before starting the marquee
            loop={true} // Loop the marquee infinitely
            onPress={() => console.log("Text Pressed!")} // Optional press handler
          >
            आपका दान दूसरों की मदद कर सकता है
          </MarqueeLabel>
        </View> */}

        <View
          style={{ marginTop: 10, height: 2, backgroundColor: "#f2f2f2" }}
        />
        <ImageBackground source={require("../../assets/Background2.png")}>
          <Blog />
        </ImageBackground>
        <Divider
          style={{ marginTop: 20, height: 2, backgroundColor: "#f2f2f2" }}
        />
        <ImageBackground source={require("../../assets/Background.png")}>
          <Text style={styles.title}>Our Volunteers</Text>
          <View style={styles.underline} />
          <VolCard />
        </ImageBackground>
        <Divider
          style={{ marginTop: 20, height: 2, backgroundColor: "#f2f2f2" }}
        />
        <Text style={styles.title}>मदद के लिए फॉर्म भरें</Text>
        <View style={styles.underline} />
        <HelpDesk />
        <Divider style={{ height: 2, backgroundColor: "#f2f2f2" }} />

        <ImageBackground
          source={require("../../assets/Background2.png")}
          style={styles.galleryContainer}
        >
          <Text style={styles.title}>Gallery</Text>
          <View style={styles.underline} />
          <Gal />
        </ImageBackground>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
            {selectedImage && (
              <ImageBackground
                source={require("../../assets/Background2.png")}
                style={styles.modalImageBackground}
              >
                <Image source={selectedImage} style={styles.popupImage} />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </ImageBackground>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    marginLeft: 10,
    fontFamily: "P-Bold",
    marginBottom: 10,
    marginTop: 10,
  },
  underline: {
    marginTop: 2, // Space between title and underline
    marginBottom: 10,
    marginLeft: 5,
    width: 80, // Adjust the width of the underline
    height: 4, // Adjust the thickness of the underline
    backgroundColor: "#000", // Underline color
    borderRadius: 2, // Rounded edges for a nice look
  },
  donationContainer: {
    marginVertical: 20,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    height: 250, // Set a fixed height for the background image container
    width: "100%", // Set to full width of the parent container
    overflow: "hidden",
  },
  imageStyle: {
    borderRadius: 10, // Optional: to round the corners of the image
  },
  donationImage: {
    width: 300,
    height: "auto",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: "black",
    textAlign: "center",
    fontFamily: "P-Regular",
    fontWeight: 500,
  },
  galleryContainer: {
    height: 200, // Set a fixed height for the gallery component
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  modalContent: {
    width: "90%",
    height: "70%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImageBackground: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  popupImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    backgroundColor: "#36C2CE",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Home;
