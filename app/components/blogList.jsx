import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import urls from "../urls";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("window");

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${urls}/api/v1/blogs/get_all`);
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  const handleBlogSelect = (blog) => {
    router.push(`/blog/${blog.slug}`);
  };

  const renderBlogItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleBlogSelect(item)}
      style={styles.cardContainer}
    >
      <View style={styles.card}>
        {/* Display only the blog image */}
        <Image
          source={{
            uri: `${urls}/api/v1/blogs/singlePhoto/${item._id}` || "",
          }}
          style={styles.blogImage}
        />
        {/* Blog Content */}
        <Text style={styles.blogTitle}>
          {item.heading?.substring(0, 30)}...
        </Text>
        <Text style={styles.description}>
          {item.mainContent?.substring(0, 30)}...
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../assets/Background.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Blog</Text>
        <View style={styles.underline} />
      </View>

      <ScrollView contentContainerStyle={styles.grid}>
        {blogs.slice(0, 2).map((item, index) => (
          <View key={index} style={styles.blogWrapper}>
            {renderBlogItem({ item })}
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity onPress={() => router.push("tabs/blog")}>
        <Text style={styles.seeMore}>See all</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  headerRow: {
    // flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "left",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: "P-Bold",
    color: "#000",
  },
  underline: {
    marginTop: 5, // Space between title and underline
    marginBottom: 5,
    width: 50, // Adjust the width of the underline
    height: 4, // Adjust the thickness of the underline
    backgroundColor: "#000", // Underline color
    borderRadius: 2, // Rounded edges for a nice look
  },
  seeMore: {
    color: "blue",
    fontSize: 16,
    fontFamily: "P-Medium",
    textAlign: "left",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  blogWrapper: {
    width: screenWidth * 0.45, // Set width to be 45% of the screen for each blog card
    marginBottom: 10, // Adjust margin for spacing between rows
  },
  card: {
    backgroundColor: "rgb(244 244 244)",
    borderRadius: 10,
    padding: 10,
    alignItems: "center", // Center content inside card
    elevation: 2,
  },
  blogImage: {
    width: "100%", // Adjust the width to fill the card
    height: 120, // Adjust image height
    borderRadius: 10,
  },
  blogTitle: {
    fontSize: 16,
    fontFamily: "Q-Bold",
    lineHeight: 20,
    marginTop: 10,
    textAlign: "start", // Center title text
  },
  description: {
    fontSize: 14,
    color: "#555",
    fontFamily: "P-Regular",
    marginTop: 5,
    textAlign: "start", // Center description text
  },
});

export default BlogList;
