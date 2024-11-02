import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Animated,
} from "react-native";
import Slider from "../components/slider";
import Blog from "../components/blogList";
import Header from "../components/header";
import Categories from "../components/Categories";
import VolCard from "../components/VolCard";
import { Divider } from "react-native-paper";
import Gal from "../components/Gal";
import HelpDesk from "../components/HelpDesk";

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
  }, [scaleAnim]);

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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Categories />
        <Divider style={styles.divider} />

        <Text style={styles.title}>Top Programs</Text>
        <View style={styles.underline} />
        <Slider />

        <Divider style={styles.divider} />
        <ImageBackground source={require("../../assets/Background2.png")}>
          <Blog />
        </ImageBackground>

        <Divider style={styles.divider} />
        <ImageBackground source={require("../../assets/Background2.png")}>
          <Text style={styles.title}>Our Volunteers</Text>
          <View style={styles.underline} />
          <VolCard />
        </ImageBackground>

        <Divider style={styles.divider} />
        <ImageBackground source={require("../../assets/Background.png")}>
          <Text style={styles.title}>मदद के लिए फॉर्म भरें</Text>
          <View style={styles.underline} />
          <HelpDesk />
        </ImageBackground>
        <Divider style={styles.divider} />
        <ImageBackground source={require("../../assets/Background2.png")}>
          <Text style={styles.title}>चंदन सिंह फाउंडेशन के कार्य</Text>
          <Gal />
        </ImageBackground>
      </ScrollView>
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
    // fontFamily: "P-Bold",
    marginBottom: 10,
    marginTop: 10,
  },
  underline: {
    marginTop: 2,
    marginBottom: 10,
    marginLeft: 5,
    width: 80,
    height: 4,
    backgroundColor: "#000",
    borderRadius: 2,
  },
  divider: {
    marginVertical: 10,
    height: 2,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
});

export default Home;
