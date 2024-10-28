import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import urls from "../urls"; // Ensure you have your base URL here
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";

const History = () => {
  const [grievances, setGrievances] = useState([]);
  const router = useRouter();

  const fetchGrievances = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.error("No user ID found in AsyncStorage");
        return;
      }

      const { data } = await axios.get(
        `${urls}/api/v1/grievance/get_grievance/${userId}`
      );
      console.log(data);
      setGrievances(data);
    } catch (error) {
      console.error("Error fetching grievances:", error);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const renderGrievance = ({ item }) => {
    // Fetch the first reply if available, else show 'No reply yet'
    const firstReply =
      item.replies && item.replies.length > 0
        ? item.replies[0].text
        : "No reply yet";
    const limitedReply =
      firstReply.length > 50 ? firstReply.substring(0, 20) + "..." : firstReply;

    return (
      <View style={styles.card}>
        <Text style={styles.grievanceText}>Grievance: {item.text}</Text>

        <Text style={styles.detailText}>Description: {limitedReply}</Text>
        <Text style={styles.detailText}>Name: {item.name}</Text>
        <Text style={styles.detailText}>Mobile: {item.mobile}</Text>
        <Text style={styles.detailText}>
          Date: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
        {item.images?.length > 0 && (
          <Image source={{ uri: item.images[0] }} style={styles.image} />
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#36C2CE" }}>
      <ImageBackground
        source={require("../../assets/Background2.png")}
        style={styles.container}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.push("tabs/profile")}>
            <Icon
              name="arrow-left"
              size={30}
              color="black"
              style={{ marginRight: 50 }}
            />
          </TouchableOpacity>
          <Text style={styles.header}>Grievance History</Text>
        </View>
        <FlatList
          data={grievances}
          renderItem={renderGrievance}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 24,
    fontFamily: "P-SemiBold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  grievanceText: {
    fontSize: 16,
    fontFamily: "P-Medium",
    marginBottom: 8,
    color: "#333",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    fontFamily: "O-C-S-SemiBold",
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginTop: 8,
  },
});

export default History;
