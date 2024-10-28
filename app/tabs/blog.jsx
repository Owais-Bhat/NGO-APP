import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";
import axios from "axios";
import urls from "../urls";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider } from "react-native-paper";

import { useRouter } from "expo-router";

// Placeholder image for missing blog photos
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x200";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const router = useRouter(); // For navigation

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

  // Render blog list view
  return (
    <SafeAreaView style={stylesBlogList.container}>
      <ImageBackground
        source={require("../../assets/Background2.png")}
        style={{ flex: 1, padding: 10 }}
      >
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Text
            style={{ fontSize: 40, fontFamily: "Q-Bold", textAlign: "center" }}
          >
            Blogs
          </Text>
        </View>
        <Divider style={{ height: 2, backgroundColor: "#f2f2f2" }} />

        <FlatList
          data={blogs}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleBlogSelect(item)}
              style={stylesBlogList.card}
            >
              <Image
                source={{
                  uri: `${urls}/api/v1/blogs/singlePhoto/${item._id}`,
                }}
                style={stylesBlogList.image}
                defaultSource={{ uri: PLACEHOLDER_IMAGE }} // Fallback for loading issues
              />
              <Text style={stylesBlogList.title}>{item.heading}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item._id.toString()}
        />
      </ImageBackground>
    </SafeAreaView>
  );
};

// Styles for the blog list view
const stylesBlogList = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "#36C2CE",
  },
  image: {
    width: "100%",
    height: 170,
    padding: 10,
  },
  title: {
    padding: 10,
    fontSize: 18,
    fontFamily: "Q-SemiBold",
  },
});

export default Blog;
