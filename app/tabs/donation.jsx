import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ImageBackground,
} from "react-native";
import Swiper from "react-native-swiper";
import * as Progress from "react-native-progress";
import { Linking } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Ionicons";
import { Divider } from "react-native-paper";

const Donation = () => {
  const donationAmount = 85000;
  const totalGoal = 170000;
  const progress = donationAmount / totalGoal; // Progress as a percentage

  // State to control the modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ImageBackground
      source={require("../../assets/Background2.png")}
      style={styles.container}
    >
      {/* Header */}

      <Text style={styles.headerText}>Donation</Text>
      <Divider style={{ height: 2, backgroundColor: "#f2f2f2" }} />

      {/* Image Swiper */}
      <View style={styles.imageContainer}>
        <Swiper
          paginationStyle={styles.pagination}
          style={styles.wrapper}
          showsButtons={false}
        >
          <Image
            source={require("../../assets/catogories/card4.jpg")}
            style={styles.image}
          />
          <Image
            source={require("../../assets/catogories/card3.jpg")}
            style={styles.image}
          />
        </Swiper>
      </View>

      {/* Donation Info */}
      <ScrollView
        style={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Support Handloom Workers</Text>

        {/* Donation Amount */}
        <View style={styles.donationAmountContainer}>
          <Text style={styles.donationAmount}>Rs {donationAmount}</Text>
          <Text style={styles.goalText}>of Rs {totalGoal} goal</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={progress}
            width={null}
            color="#36C2CE"
            height={10}
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>{Math.floor(progress * 100)}%</Text>
        </View>

        {/* Days left */}
        <Text style={styles.daysLeft}>15 days left</Text>

        {/* Description */}
        <Text style={styles.description}>
          The position of handlooms in the socio-political arena and the
          sector's annual contribution to the economy cannot be objectively
          stated. These factors have hampered growth in the handloom industry.
        </Text>

        {/* Recent Donors */}
        <View style={styles.recentDonorsContainer}>
          <Text style={styles.recentDonorsTitle}>Recent Donors</Text>
          <View style={styles.donorsList}>
            <Image
              source={require("../../assets/catogories/card1.jpg")}
              style={styles.donorImage}
            />
            <Image
              source={require("../../assets/catogories/card2.jpg")}
              style={styles.donorImage}
            />
            <Image
              source={require("../../assets/catogories/card3.jpg")}
              style={styles.donorImage}
            />
            <Text style={styles.moreDonors}>+442</Text>
          </View>
        </View>

        {/* Similar Programs Section */}
        <View style={styles.similarProgramsContainer}>
          <Text style={styles.similarProgramsTitle}>Similar Programs</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.cardsContainer}>
              <ImageBackground
                source={require("../../assets/Background3.png")}
                colors={["lightblue", "white"]}
                style={styles.similarProgramCard}
              >
                <Image
                  source={require("../../assets/catogories/card1.jpg")}
                  style={styles.similarProgramImage}
                />
                <View style={styles.similarProgramTextContainer}>
                  <Text style={styles.similarProgramTitle}>
                    Help the Poverty & Help For Health
                  </Text>
                  <Text style={styles.similarProgramAmount}>Rs 25 000</Text>
                </View>
                <Progress.Bar
                  progress={0.4}
                  width={null}
                  color="#36C2CE"
                  height={10}
                  style={styles.similarProgramProgress}
                />
              </ImageBackground>

              <ImageBackground
                source={require("../../assets/Background3.png")}
                colors={["lightblue", "white"]}
                style={styles.similarProgramCard}
              >
                <Image
                  source={require("../../assets/catogories/card2.jpg")}
                  style={styles.similarProgramImage}
                />
                <View style={styles.similarProgramTextContainer}>
                  <Text style={styles.similarProgramTitle}>
                    Development Goals, Kids wish network
                  </Text>
                  <Text style={styles.similarProgramAmount}>Rs 55 000</Text>
                </View>
                <Progress.Bar
                  progress={0.75}
                  width={null}
                  color="#36C2CE"
                  height={10}
                  style={styles.similarProgramProgress}
                />
              </ImageBackground>

              <ImageBackground
                source={require("../../assets/Background3.png")}
                style={styles.similarProgramCard}
              >
                <Image
                  source={require("../../assets/catogories/card3.jpg")}
                  style={styles.similarProgramImage}
                />
                <View style={styles.similarProgramTextContainer}>
                  <Text style={styles.similarProgramTitle}>
                    Blind and Hearing Impaired, Animal Welfare
                  </Text>
                  <Text style={styles.similarProgramAmount}>Rs 55 000</Text>
                </View>
                <Progress.Bar
                  progress={0.55}
                  width={null}
                  color="#36C2CE"
                  height={10}
                  style={styles.similarProgramProgress}
                />
              </ImageBackground>
            </View>
            {/* Additional similar program cards can be added here */}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Donation Button Overlay */}
      <TouchableOpacity
        style={styles.donationButton}
        onPress={() => setModalVisible(true)} // Show the modal when button is clicked
      >
        <Text style={styles.donationButtonText}>Help here </Text>
        <Icon name="heart-circle-outline" size={30} color="#e5f6ff" />
      </TouchableOpacity>

      {/* Modal for Help Image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(true)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
            <Image
              source={require("../../assets/qr.jpeg")} // Replace with your help image
              style={styles.helpImage}
            />

            <Text style={styles.modalText}>
              Need Help?
              <TouchableOpacity
                onPress={() => Linking.openURL("tel:+919958535858")}
              >
                <Text
                  style={{
                    color: "blue",
                    fontSize: 18,
                    fontFamily: "O-C-SemiBold",
                  }}
                >
                  {" "}
                  Contact Us!
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 25,
    fontFamily: "Q-Medium",
    marginBottom: -40,
    alignSelf: "center",
    marginTop: 10,
  },
  imageContainer: {
    height: 250,
    marginBottom: 10,
    marginTop: 30,
    padding: 10,
  },
  wrapper: {},
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: "O-C-SemiBold",
    marginBottom: 10,
  },
  donationAmountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  donationAmount: {
    fontSize: 20,
    fontFamily: "O-C-SemiBold",
    color: "#333",
  },
  goalText: {
    fontSize: 16,
    color: "#999",
    fontFamily: "O-C-SemiBold",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  progressBar: {
    flex: 1,
    marginHorizontal: 10,
    height: 10,
  },
  progressText: {
    fontSize: 14,
    fontFamily: "O-C-SemiBold",
    color: "#333",
  },
  daysLeft: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: "#555",
    marginBottom: 20,
    fontFamily: "P-Light",
  },
  recentDonorsContainer: {
    marginBottom: 20,
  },
  recentDonorsTitle: {
    fontSize: 18,
    fontFamily: "O-C-SemiBold",
    marginBottom: 10,
  },
  donorsList: {
    flexDirection: "row",
    alignItems: "center",
  },
  donorImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
  },
  moreDonors: {
    fontSize: 14,
    color: "black",
    marginLeft: 10,
    fontFamily: "O-C-SemiBold",
  },
  similarProgramsContainer: {
    marginBottom: 30,
  },
  similarProgramsTitle: {
    fontSize: 18,
    fontFamily: "O-C-SemiBold",
    marginBottom: 10,
  },
  cardsContainer: {
    flexDirection: "row",
  },
  similarProgramCard: {
    width: 250,
    marginRight: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 10,
    marginBottom: 55,
  },
  similarProgramImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  similarProgramTextContainer: {
    marginBottom: 10,
  },
  similarProgramTitle: {
    fontSize: 16,
    fontFamily: "P-Light",
    marginBottom: 5,
  },
  similarProgramAmount: {
    fontSize: 12,
    color: "#555",
    fontFamily: "P-Light",
  },
  similarProgramProgress: {
    marginTop: 5,
  },
  donationButton: {
    position: "absolute",
    bottom: 10,
    left: 20,
    right: 20,
    flexDirection: "row",
    backgroundColor: "#36C2CE",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  donationButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "O-C-SemiBold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  closeButton: {
    // position: "absolute",
    top: 10, // Distance from the top
    right: 10, // Distance from the right
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    margin: 5,
  },

  helpImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "O-C-SemiBold",
  },
});

export default Donation;
