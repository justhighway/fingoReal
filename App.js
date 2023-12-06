// 예시: App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { UserProvider } from "./context/userContext";
import RootStack from "./screens/RootStack";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();
LogBox.ignoreLogs(["(ADVICE)"]);

const App = () => {
  return (
    <UserProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </UserProvider>
  );
};

export default App;
