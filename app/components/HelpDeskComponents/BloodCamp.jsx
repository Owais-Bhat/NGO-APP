import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const BloodCamp = () => {
  const router = useRouter();

  const handleBloodDonatoipn = () => {
    router.push("components/HelpDeskComponents/BloodDonation");
  };
  const handleBloodRequire = () => {
    router.push("components/HelpDeskComponents/BloodRequire");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://w7.pngwing.com/pngs/424/92/png-transparent-blood-donation-drop-droplet-miscellaneous-donation-fictional-character-thumbnail.png",
      }} // Replace with actual background image URL
      style={styles.background}
      blurRadius={5}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => router.push("tabs/home")}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleBloodDonatoipn}
          >
            <Image
              source={require("./../../../assets/helpdesk/blood-donation.png")}
              style={styles.image}
            />
            <Text style={styles.label}>Blood Donation</Text>
          </TouchableOpacity>

          {/* Blood Require Section */}
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={handleBloodRequire}
          >
            <Image
              source={require("./../../../assets/helpdesk/blood-donation.png")}
              style={styles.image}
            />
            <Text style={styles.label}>Blood Require</Text>
          </TouchableOpacity>
        </View>
        <Stack>
          <Stack.Screen name="BloodRequire" options={{ headerShown: false }} />
          <Stack.Screen name="BloodDonation" options={{ headerShown: false }} />
        </Stack>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent dark overlay
  },
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  backButton: {
    marginLeft: 10,
  },
  imageContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  image: {
    width: "90%",
    height: 250,
    resizeMode: "cover",
  },
  label: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default BloodCamp;
