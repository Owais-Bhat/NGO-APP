import React, { useState, useEffect } from "react";
import {
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  Modal,
  Button,
} from "react-native";
import axios from "axios";
import urls from "../urls.jsx"; // Your base URL file

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${urls}/api/v1/categry/get-category`);
        setCategories(response.data.category || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch a single category with photo
  const fetchSingleCategory = async (categoryId) => {
    try {
      const response = await axios.get(
        `${urls}/api/v1/categry/single-category/${categoryId}`
      );
      const photoResponse = await axios.get(
        `${urls}/api/v1/categry/singlePhoto-category/${categoryId}`,
        { responseType: "blob" }
      );
      setSelectedCategory({
        ...response.data.category,
        photo: URL.createObjectURL(photoResponse.data),
      });
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <Card
              key={index}
              subtitle={category.name}
              image={`${urls}/api/v1/categry/singlePhoto-category/${category._id}`}
              onPress={() => fetchSingleCategory(category._id)}
            />
          ))}
        </ScrollView>
      )}

      {/* Modal for displaying selected category details */}
      {selectedCategory && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Image
              source={{ uri: selectedCategory.photo }}
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>{selectedCategory.name}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const Card = ({ subtitle, image, onPress }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={imageError ? require("../../assets/logo.png") : { uri: image }} // Fallback image
        style={styles.cardImage}
        onError={() => setImageError(true)} // Set error if image fails to load
      />
      <Text style={styles.cardText}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  card: {
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    borderColor: "#ccc",
  },
  cardImage: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 10,
  },
  cardText: {
    fontSize: 12,
    fontFamily: "P-Regular",
    textAlign: "center",
    marginTop: 5,
  },
  modalView: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default Categories;
