import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { LinearGradient } from "expo-linear-gradient";
import urls from "../urls";
import Icon from "react-native-vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const Message = () => {
  const [grievances, setGrievances] = useState([]);
  const [reply, setReply] = useState("");
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [showGrievances, setShowGrievances] = useState(true);
  const [messageCount, setMessageCount] = useState(0);
  const flatListRef = useRef(null);
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
      setGrievances(data);
    } catch (error) {
      console.error("Error fetching grievances:", error);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleReply = async () => {
    if (!reply || !selectedGrievance) return;

    const userToken = await AsyncStorage.getItem("userToken");
    if (!userToken) {
      console.error("No user token found in AsyncStorage");
      return;
    }

    const updatedGrievances = grievances.map((grievance) => {
      if (grievance._id === selectedGrievance._id) {
        return {
          ...grievance,
          replies: [
            ...grievance.replies,
            { text: reply, onModel: "User", _id: Date.now() },
          ],
        };
      }
      return grievance;
    });

    setGrievances(updatedGrievances);
    setReply("");

    setMessageCount((prevCount) => prevCount + 1);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      await axios.post(
        `${urls}/api/v1/grievance/${selectedGrievance._id}/reply_grievances`,
        {
          text: reply,
          onModel: "User",
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const renderChat = () => {
    if (!selectedGrievance) return null;

    return (
      <ImageBackground
        source={require("../../assets/Background6.png")}
        style={styles.chatContainer}
        resizeMode="cover"
      >
        <View style={styles.messageCounter}>
          <Text style={styles.counterText}>
            Chat with Admin ({messageCount} messages)
          </Text>
        </View>
        <FlatList
          ref={flatListRef}
          data={selectedGrievance.replies}
          extraData={selectedGrievance.replies}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <LinearGradient
              colors={
                item.onModel === "User"
                  ? ["#e1f5fe", "#b3e5fc"]
                  : ["#ffffff", "#f8f8f8"]
              }
              style={[
                styles.replyContainer,
                item.onModel === "User" ? styles.userReply : styles.adminReply,
              ]}
            >
              <Text style={styles.replyText}>{item.text}</Text>
            </LinearGradient>
          )}
          keyExtractor={(item, index) => index.toString()}
          style={styles.replyList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      </ImageBackground>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/Background2.png")}
      style={styles.container}
    >
      {showGrievances ? (
        <>
          <Text
            style={{
              fontSize: 24,
              fontFamily: "P-Medium",
              textAlign: "center",
            }}
          >
            Grievances
          </Text>
          <Icon
            name="arrow-left"
            size={24}
            onPress={() => router.push("tabs/grevience")} // One step back
          />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={grievances}
            renderItem={({ item }) => (
              <LinearGradient
                colors={["#e1f5fe", "#b3e5fc"]}
                style={styles.grievanceCard}
              >
                <ImageBackground
                  source={require("../../assets/Background2.png")}
                  style={{ flex: 1 }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedGrievance(item);
                      setMessageCount(item.replies.length);
                      setShowGrievances(false); // Hide title and back button in chat view
                    }}
                  >
                    <Text style={styles.grievanceText}>{item.text}</Text>
                    <Text style={styles.grievanceSummary}>
                      Name: {item.name}
                    </Text>
                    <Text style={styles.grievanceSummary}>
                      Mobile: {item.mobile}
                    </Text>
                    <Image
                      source={{ uri: item.images[0] }}
                      style={styles.image}
                    />
                  </TouchableOpacity>
                </ImageBackground>
              </LinearGradient>
            )}
            keyExtractor={(item) => item._id}
            numColumns={2}
            columnWrapperStyle={styles.columnWrapper}
          />
        </>
      ) : (
        <View style={styles.chatWrapper}>
          {renderChat()}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setShowGrievances(true);
              setSelectedGrievance(null);
              setMessageCount(0);
            }}
          >
            <Icon name="arrow-left" size={20} color="#333" />
          </TouchableOpacity>
          <View style={styles.replyContainer}>
            <TextInput
              style={styles.replyInput}
              placeholder="Add a reply..."
              value={reply}
              onChangeText={setReply}
            />
            <TouchableOpacity style={styles.replyButton} onPress={handleReply}>
              <Text style={styles.replyButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },
  grievanceCard: {
    flex: 1,
    margin: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  grievanceText: {
    fontSize: 16,
    marginBottom: 4,
    color: "#333",
    fontFamily: "P-Regular",
  },
  grievanceSummary: {
    fontSize: 12,
    color: "#666",
    fontFamily: "P-Medium",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  chatContainer: {
    flex: 1,
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#32C1C0",
    // Add background image to the chat container
    backgroundImage: "url('path-to-your-chat-background-image.png')",
  },
  chatWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  replyContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  replyInput: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    padding: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  replyButton: {
    backgroundColor: "#36C2CE",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 2,
  },
  replyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "P-Medium",
  },
  messageCounter: {
    marginBottom: 10,
    alignItems: "center",
    marginLeft: 20,
  },
  counterText: {
    fontSize: 16,
    padding: 2,
    fontFamily: "P-Medium",
  },
  replyList: {
    flexGrow: 1,
  },
  replyText: {
    padding: 2,
    fontSize: 16,
    color: "#000",
    fontFamily: "O-C-Bold",
  },
  userReply: {
    alignSelf: "flex-end",
    borderRadius: 10,
  },
  adminReply: {
    alignSelf: "flex-start",
    borderRadius: 10,
  },
  backButton: {
    position: "absolute",
    top: 25,
    left: 16,
    zIndex: 1,
    backgroundColor: "rgba(132, 322, 334,0.8)",
    padding: 8,
    borderRadius: 30,
  },
});

export default Message;
