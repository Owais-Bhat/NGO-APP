import { View, TouchableWithoutFeedback, Dimensions } from "react-native";
import React, { useState } from "react";
import { Tabs } from "expo-router";
import { Icon } from "react-native-elements";
import FontLoader from "../components/FontLoader";

const { width: screenWidth } = Dimensions.get("window");

const TabLayout = () => {
  const [activeTab, setActiveTab] = useState("home"); // Track active tab
  const iconSize = screenWidth > 400 ? 30 : 24;
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { height: 60, backgroundColor: "#e5f6ff" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: " ",
          tabBarIcon: () => (
            <Icon
              name="home"
              type="font-awesome"
              size={iconSize}
              color={activeTab === "home" ? "#36C2CE" : "#000"} // Active tab color black, inactive blue
            />
          ),
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setActiveTab("home"); // Update active tab
                props.onPress(); // Call default press handler
              }}
            >
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <Tabs.Screen
        name="donation"
        options={{
          headerShown: false,
          title: " ",
          tabBarIcon: () => (
            <Icon
              name="hands-helping"
              type="font-awesome-5"
              size={iconSize}
              color={activeTab === "donation" ? "#36C2CE" : "#000"} // Active tab color black, inactive green
            />
          ),
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setActiveTab("donation");
                props.onPress();
              }}
            >
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}
      />

      <Tabs.Screen
        name="blog"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: () => (
            <Icon
              name="blogger" // Use "blogger" for the FontAwesome5 brand icon
              type="fontisto"
              size={iconSize}
              color={activeTab === "blog" ? "#36C2CE" : "#000"} // Active tab color
            />
          ),
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setActiveTab("blog");
                props.onPress();
              }}
            >
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}
      />

      <Tabs.Screen
        name="grevience"
        options={{
          headerShown: false,
          title: "",

          tabBarIcon: () => (
            <Icon
              name="comment-text-outline"
              type="material-community"
              size={iconSize}
              color={activeTab === "grevience" ? "#36C2CE" : "#000"} // Active tab color black, inactive red
            />
          ),
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setActiveTab("grevience");
                props.onPress();
              }}
            >
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: () => (
            <Icon
              name="user"
              type="font-awesome"
              size={iconSize}
              color={activeTab === "profile" ? "#36C2CE" : "#000"} // Active tab color black, inactive purple
            />
          ),
          tabBarButton: (props) => (
            <TouchableWithoutFeedback
              onPress={() => {
                setActiveTab("profile");
                props.onPress();
              }}
            >
              <View {...props} />
            </TouchableWithoutFeedback>
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
