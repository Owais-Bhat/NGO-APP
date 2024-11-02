import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

const HelpDesk = () => {
  const router = useRouter();
  const handlekanyadaan = () => {
    router.push("components/HelpDeskComponents/Kanyadaan");
  };
  const handemedicalhelp = () => {
    router.push("components/HelpDeskComponents/MedicalHelp"); // Navigating to CreateCsfMembers component
  };
  const handleporchileeducation = () => {
    router.push("components/HelpDeskComponents/ChildEducation"); // Navigating to CreateCsfMembers component
  };
  const handlecomputerclass = () => {
    router.push("components/HelpDeskComponents/ComputerClass"); // Navigating to CreateCsfMembers component
  };
  const handlebloodcamp = () => {
    router.push("components/HelpDeskComponents/BloodCamp"); // Navigating to CreateCsfMembers component
  };
  const handleshardh = () => {
    router.push("components/HelpDeskComponents/Sardh"); // Navigating to CreateCsfMembers component
  };

  return (
    <ImageBackground
      source={require("./../../assets/Background2.png")}
      style={styles.container}
    >
      <View style={styles.row}>
        <TouchableOpacity style={styles.categoryBox} onPress={handlekanyadaan}>
          <Image
            source={require("./../../assets/helpdesk/marriage--icon.png")}
            style={styles.image}
          />
          <Text style={styles.categoryText}>कन्यादान</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryBox} onPress={handemedicalhelp}>
          <Image
            source={require("./../../assets/helpdesk/medical-help.png")}
            style={styles.image}
          />
          <Text style={styles.categoryText}>चिकित्सा सेवा</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity
          style={styles.categoryBox}
          onPress={handleporchileeducation}
        >
          <Image
            source={require("./../../assets/helpdesk/child-education-icon.png")}
            style={styles.image}
          />
          <Text style={styles.categoryText}>आनाथ बच्चों की शिक्षा</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryBox}
          onPress={handlecomputerclass}
        >
          <Image
            source={require("./../../assets/helpdesk/computer-class.png")}
            style={styles.image}
          />
          <Text style={styles.categoryText}> कप्यूटर शिक्षा</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.categoryBox} onPress={handlebloodcamp}>
          <Image
            source={require("./../../assets/helpdesk/blood-donation.png")}
            style={styles.image}
          />
          <Text style={styles.categoryText}>रक्तदान</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryBox} onPress={handleshardh}>
          <Image
            source={require("./../../assets/helpdesk/Shradh-icon.png")}
            style={styles.image}
          />
          <Text style={styles.categoryText}>श्राद्ध</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    justifyContent: "center",
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  categoryBox: {
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 5,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HelpDesk;
