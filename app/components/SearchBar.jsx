// SearchBar.js
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View, TextInput, StyleSheet, ImageBackground } from "react-native";
import SearchIcon from "react-native-vector-icons/FontAwesome";

const SearchBar = () => {
  return (
    <ImageBackground source={require("../../assets/Background2.png")}>
      <View style={styles.searchContainer}>
        <SearchIcon name="search" size={20} style={styles.searchIcon} />
        <TextInput style={styles.searchInput} placeholder="Search..." />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    margin: 20,
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 0.1,
    borderRadius: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    height: 40,
    elevation: 5,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: "E-Regular",
  },
  searchIcon: {
    color: "gray",
  },
});

export default SearchBar;
