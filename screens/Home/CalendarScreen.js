import { StyleSheet, Text, View, SafeAreaView } from "react-native";
import React from "react";
import CalendarTracker from "../../components/CalendarTracker";
import BotSheet from "../../components/BotSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function CalendarScreen() {
  return (
    <SafeAreaView style={{ felx: 1, justifyContent: "center" }}>
      <CalendarTracker />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
