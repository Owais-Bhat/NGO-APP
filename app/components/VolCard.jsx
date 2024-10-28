import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Modal,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import urls from "../urls";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const VolCard = () => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const { data } = await axios.get(
          `${urls}/api/v1/volunteer/get_volunteer`
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

  const handleVolunteerPress = (volunteer) => {
    setSelectedVolunteer(volunteer);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedVolunteer(null);
  };

  // Navigate to the BecomeVolunteer screen
  const handleBecomeVolunteer = () => {
    router.push("screen/createcsfvolunteers"); // Make sure the screen name is correct in your stack
  };

  const handleBecomeMember = () => {
    router.push("screen/createcsfmember"); // Navigating to CreateCsfMembers component
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 5 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        {volunteers.map((item) => (
          <TouchableOpacity
            key={item._id}
            onPress={() => handleVolunteerPress(item)}
          >
            <View style={styles.volunteerCard}>
              <Image
                source={{
                  uri: `${urls}/api/v1/volunteer/get_image/${item._id}`,
                }}
                resizeMode="contain"
                style={styles.volunteerImage}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Buttons for Become a Volunteer and Become a Member */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.card} onPress={handleBecomeVolunteer}>
          <Text style={styles.cardText}>Become a Volunteer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={handleBecomeMember}>
          <Text style={styles.cardText}>Become a Member</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for displaying volunteer details */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedVolunteer && (
              <>
                <Image
                  source={{
                    uri: `${urls}/api/v1/volunteer/get_image/${selectedVolunteer._id}`,
                  }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalName}>{selectedVolunteer.name}</Text>
                <Text style={styles.modalDetails}>
                  Email: {selectedVolunteer.email}
                </Text>
                <Text style={styles.modalDetails}>
                  Mobile: {selectedVolunteer.mobile}
                </Text>
                <Text style={styles.modalDetails}>
                  City: {selectedVolunteer.city}
                </Text>
                <Text style={styles.modalDetails}>
                  States: {selectedVolunteer.states}
                </Text>
                <Text style={styles.modalDetails}>
                  Register Date: {selectedVolunteer.createdAt.slice(0, 10)}
                </Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scrollView: {
    backgroundColor: "rgba(0,0,0,0.01)",
    paddingHorizontal: 10,
  },
  volunteerCard: {
    width: screenWidth * 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    padding: 5,
  },
  volunteerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  card: {
    backgroundColor: "#36C2CE",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
  },
  cardText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  modalContent: {
    width: screenWidth * 0.8,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDetails: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "left",
  },
  closeButton: {
    backgroundColor: "#36C2CE",
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default VolCard;
