// GetUserDataScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import DateTimePickerModal from "@react-native-community/datetimepicker";
import { runTransaction } from "firebase/firestore";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const GetUserDataScreen = ({ navigation, route }) => {
  const [income, setIncome] = useState("");
  const [fixedCost, setFixedCost] = useState("");
  const [savings, setSavings] = useState("");
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const calculateAllowedAmount = (income, fixedCost, savings, targetDate) => {
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const remainingDays = Math.ceil(
      (targetDate.getTime() - new Date().getTime()) / oneDayMilliseconds
    );
    console.log(remainingDays);

    const allowedAmount =
      Math.round((income - fixedCost - savings) / remainingDays / 10) * 10;

    return allowedAmount;
  };

  const handleSaveData = async () => {
    try {
      await runTransaction(db, async (transaction) => {
        // Firestore에 데이터 저장
        const userRef = doc(db, "users", route.params.uid);

        const userData = await transaction.get(userRef);

        if (!userData.exists()) {
          throw new Error("User data not found");
        }

        // Calculate allowed amount
        const allowedAmount = calculateAllowedAmount(
          parseInt(income),
          parseInt(fixedCost),
          parseInt(savings),
          targetDate
        );

        transaction.update(userRef, {
          userIncome: parseInt(income),
          userFixedCost: parseInt(fixedCost),
          userSavings: parseInt(savings),
          userTargetDate: targetDate,
          userAllowedAmount: allowedAmount,
        });

        // TODO: 계산 및 가용예산 업데이트
      });

      Alert.alert("Success", "데이터가 성공적으로 저장되었습니다.");
      navigation.replace("MainDrawer");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (selectedDate) {
      setTargetDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>개인 정보 입력</Text>

      <TextInput
        style={styles.input}
        placeholder="월급"
        value={income}
        onChangeText={setIncome}
      />

      <TextInput
        style={styles.input}
        placeholder="고정비"
        value={fixedCost}
        onChangeText={setFixedCost}
      />

      <TextInput
        style={styles.input}
        placeholder="목표 저축액"
        value={savings}
        onChangeText={setSavings}
      />

      <View style={styles.dateContainer}>
        <Text style={styles.dateLabel}>목표 날짜</Text>
        <Button title="날짜 선택" onPress={() => setShowDatePicker(true)} />
      </View>

      {showDatePicker && (
        <DateTimePickerModal
          testID="dateTimePicker"
          value={targetDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      <Button title="시작하기" onPress={handleSaveData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 16,
  },
});

export default GetUserDataScreen;
