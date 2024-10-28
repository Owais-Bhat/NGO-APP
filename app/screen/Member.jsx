import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import * as Print from "expo-print"; // For PDF generation
import { Asset } from "expo-asset"; // For loading images
import urls from "../urls"; // Update the path as per your project structure
import * as FileSystem from "expo-file-system"; // For file handling
import * as Sharing from "expo-sharing"; // To open the PDF after saving
import { Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const MemberDetails = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [filteredMember, setFilteredMember] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load the logo and owner images from the assets folder
  const [logoUri, setLogoUri] = useState(null);
  const [ownerImageUri, setOwnerImageUri] = useState(null);

  useEffect(() => {
    // Preload the images when the component is mounted
    loadAssets();
  }, []);

  // Load the image assets
  const loadAssets = async () => {
    const logoAsset = Asset.fromModule(require("../../assets/logo2.png")); // Replace with your logo image path
    const ownerAsset = Asset.fromModule(require("../../assets/owner.png")); // Replace with the owner image path

    await logoAsset.downloadAsync(); // Download the logo image
    await ownerAsset.downloadAsync(); // Download the owner image

    setLogoUri(logoAsset.localUri); // Set the local URI of the logo
    setOwnerImageUri(ownerAsset.localUri); // Set the local URI of the owner image
  };

  // Fetch member details by mobile number
  const fetchMember = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert(
        "Invalid Input",
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${urls}/api/v1/member/findByMobile/${mobileNumber}`
      );
      console.log("Fetched member data:", data);
      if (data && data.length > 0) {
        setFilteredMember(data[0]); // Assuming you want the first result
      } else {
        Alert.alert("Not Found", "No member found with this mobile number.");
        setFilteredMember(null);
      }
    } catch (error) {
      console.error("Error fetching member data:", error);
      Alert.alert("Error", "Unable to fetch data. Please try again later.");
    }
    setLoading(false);
  };

  const handlePrintPDF = async () => {
    if (!filteredMember) return;

    try {
      const htmlContent = `
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
              .container { border: 1px solid black; padding: 10px; }
              h2, h4 { margin: 0; padding: 5px 0; }
              .form-fields { margin-top: 10px; }
              .form-fields p { margin: 5px 0; }
              .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; border-bottom: 2px solid black; }
              .logo { width: 100px; height: auto; }
              .owner-image { width: 100px; height: auto; border-radius: 50%; }
              .foundation-info { text-align: center; flex-grow: 1; }
              .footer { margin-top: 20px; }
              .heading { text-align: center; font-size: 20px; font-weight: bold; margin-top: 10px; }
              .footer p { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="container">
              <!-- Title and Logo section -->
              <div class="header">
                <img src="${logoUri}" class="logo" />
                <div class="foundation-info">
                  <h3>2023-2024 चन्दन सिंह फाउंडेशन</h3>
                  <p>Block-Chakai, Dist-Jamui, Bihar-811303</p>
                  <p>Email: help@chandansinghfoundation.com | Phone: +91 995-8535-858</p>
                </div>
                <img src="${ownerImageUri}" class="owner-image" />
              </div>

              <!-- Form fields -->
              <div class="form-fields">
                <p><strong>क्रमांक:</strong> ${filteredMember._id || "N/A"}</p>
                <p><strong>नाम:</strong> ${filteredMember.name || "N/A"}</p>
                <p><strong>पिता का नाम:</strong> ${
                  filteredMember.father || "N/A"
                }</p>
                <p><strong>पति का नाम:</strong> ${
                  filteredMember.husband || "N/A"
                }</p>
                <p><strong>शैक्षणिक योग्यता:</strong> ${
                  filteredMember.education || "N/A"
                }</p>
                <p><strong>मोबाइल नंबर:</strong> ${
                  filteredMember.mobile || "N/A"
                }</p>
                <p><strong>जन्म तिथि:</strong> ${
                  filteredMember.DOB || "N/A"
                }</p>
                <p><strong>स्थायी पता:</strong> ${
                  filteredMember.Address || "N/A"
                }</p>
                <p><strong>आयु:</strong> ${filteredMember.Age || "N/A"}</p>
                <p><strong>सदस्यता शुल्क:</strong> ${
                  filteredMember.Donation
                } रुपये</p>
              </div>
              
              <!-- Signature Section -->
              <div class="footer">
                <p>पदाधिकारी हस्ताक्षर: ______csfcare___________</p>
                <p>आवेदक का हस्ताक्षर: _________________</p>
                <p style="font-style: italic; text-align: right;">Chandan Singh Foundation</p>
              </div>
            </div>
          </body>
        </html>
      `;

      // Generate the PDF file
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Move PDF to a download-friendly location
      const fileUri = `${FileSystem.documentDirectory}MemberDetails.pdf`;
      await FileSystem.moveAsync({
        from: uri,
        to: fileUri,
      });

      // Automatically open the PDF after saving
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error generating PDF", error);
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/Background2.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView>
        <View
          style={{
            flexDirection: "row",
            padding: 10,
            justifyContent: "center",
            gap: 10,
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back("tabs/profile")}
            style={{ position: "absolute", left: 20 }}
          >
            <Icon name="arrow-left-circle" size={30} color="#36C2CE" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              fontFamily: "P-Medium",

              textAlign: "center",
            }}
          >
            Member Details
          </Text>
        </View>
        <ScrollView style={styles.container}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Mobile Number"
              keyboardType="numeric"
              maxLength={10}
              value={mobileNumber}
              onChangeText={setMobileNumber}
            />
            <TouchableOpacity style={styles.button} onPress={fetchMember}>
              <Text style={styles.buttonText}>Fetch Member</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text>Loading...</Text>
          ) : filteredMember ? (
            <View style={styles.formContainer}>
              {/* Header with Logo, Foundation Info, and Owner Image */}
              <View style={styles.header}>
                <Image source={{ uri: logoUri }} style={styles.logo} />
                <View style={styles.foundationInfo}>
                  <Text style={styles.foundationText}>
                    2023-2024 चन्दन सिंह फाउंडेशन
                  </Text>
                  <Text style={styles.foundationText}>
                    {" "}
                    Block-Chakai, Dist-Jamui, Bihar-811303
                  </Text>
                  <Text style={styles.foundationText}>
                    Email: help@chandansinghfoundation.com
                  </Text>
                  <Text style={styles.foundationText}>
                    Phone: +91 995-8535-858
                  </Text>
                </View>
                <Image
                  source={{ uri: ownerImageUri }}
                  style={styles.ownerImage}
                />
              </View>
              <Divider style={styles.divider} />
              {/* Form Data */}
              <View style={styles.formFields}>
                <Text style={styles.label}>क्रमांक: {filteredMember._id}</Text>
                <Text style={styles.label}>नाम: {filteredMember.name}</Text>
                <Text style={styles.label}>
                  पिता का नाम: {filteredMember.father}
                </Text>
                <Text style={styles.label}>
                  पति का नाम: {filteredMember.husband}
                </Text>
                <Text style={styles.label}>
                  शैक्षणिक योग्यता: {filteredMember.education}
                </Text>
                <Text style={styles.label}>
                  मोबाइल नंबर: {filteredMember.mobile}
                </Text>
                <Text style={styles.label}>
                  जन्म तिथि: {filteredMember.DOB}
                </Text>
                <Text style={styles.label}>
                  स्थायी पता: {filteredMember.Address}
                </Text>
                <Text style={styles.label}>आयु: {filteredMember.Age}</Text>
                <Text style={styles.label}>
                  सदस्यता शुल्क: {filteredMember.Donation} रुपये
                </Text>
              </View>

              <TouchableOpacity style={styles.button} onPress={handlePrintPDF}>
                <Text style={styles.buttonText}>Download PDF</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text>No member details found</Text>
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "",
  },
  searchContainer: {
    marginBottom: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  formContainer: {
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
  },
  ownerImage: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  foundationInfo: {
    alignItems: "center",
    marginBottom: 20,
  },
  foundationText: {
    fontFamily: "P-Medium",
    fontSize: 18,
  },
  formFields: {
    marginBottom: 20,
  },
  foundationText: {
    fontFamily: "P-Medium",
    fontSize: 10,
  },
  label: {
    fontSize: 16,
    fontFamily: "P-Medium",
    marginBottom: 5,
  },
  divider: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  button: {
    backgroundColor: "#36C2CE",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontFamily: "P-Medium",
  },
});

export default MemberDetails;
