import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const VolunteerList = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all volunteers from the backend
    const fetchVolunteers = async () => {
      try {
        const { data } = await axios.get(
          "https://csf-cms-backend.onrender.com/api/v1/volunteer/get_volunteer"
        );
        setVolunteers(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
        setLoading(false);
      }
    };

    fetchVolunteers();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const renderVolunteer = ({ item }) => (
    <View style={styles.volunteerCard}>
      <ImageBackground
        source={{
          uri: `https://csf-cms-backend.onrender.com/api/v1/volunteer/get_image/${item._id}`,
        }}
        style={styles.volunteerImage}
        resizeMode="contain"
      >
        <Text style={styles.volunteerName}>{item.name}</Text>
      </ImageBackground>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/Background2.png")}
      style={styles.container}
    >
      <View
        style={{
          marginBottom: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.push("tabs/profile")}>
          <Icon
            name="arrow-left-circle"
            size={30}
            color="#36C2CE"
            style={{ marginRight: 10 }}
          />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "P-Medium",
            marginBottom: 20,

            marginLeft: "20%",
            color: "#000",
            textAlign: "center",
          }}
        >
          Our Volunteers
        </Text>
      </View>

      <FlatList
        data={volunteers}
        keyExtractor={(item) => item._id}
        renderItem={renderVolunteer}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  list: {
    justifyContent: "space-between",
  },
  volunteerCard: {
    width: screenWidth / 2 - 30,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 5,
    marginRight: 10,
  },
  volunteerImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  volunteerName: {
    backgroundColor: "rgba(0,0,0,0.8)",
    color: "#fff",
    padding: 5,
    textAlign: "center",
    fontSize: 16,
  },
});

export default VolunteerList;
