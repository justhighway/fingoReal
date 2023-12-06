// RootStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { UserProvider } from "../context/userContext";

import MainDrawer from "./MainDrawer";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import GetFinfoScreen from "../screens/GetFinfoScreen";
import GetUserDataScreen from "../screens/GetUserDataScreen";

import { useUser } from "../context/userContext";

const Stack = createStackNavigator();

const RootStack = () => {
  const { user } = useUser();

  return (
    <UserProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
        ) : (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="GetUserData" component={GetUserDataScreen} />
            <Stack.Screen name="GetFinfo" component={GetFinfoScreen} />
            <Stack.Screen name="MainDrawer" component={MainDrawer} />
          </>
        )}
      </Stack.Navigator>
    </UserProvider>
  );
};

export default RootStack;
