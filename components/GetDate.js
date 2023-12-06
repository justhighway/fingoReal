import { StyleSheet, Text, View } from "react-native";
import React from "react";

export default function GetDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <Text style={{ fontSize: 20 }}>{`${year}년 ${month}월 ${day}일 ${
      days[date.getDay()]
    }요일`}</Text>
  );
}
