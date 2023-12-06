// MainDrawer.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeStack from "./Home/HomeStack";
import AdminScreen from "./AdminScreen";

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="HomeStack" component={HomeStack} />
      <Drawer.Screen name="Admin" component={AdminScreen} />
    </Drawer.Navigator>
  );
};

export default MainDrawer;
