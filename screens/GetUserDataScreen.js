// GetUserDataScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { runTransaction } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const GetUserDataScreen = ({ navigation, route }) => {
  const [income, setIncome] = useState("");
  const [fixedCost, setFixedCost] = useState("");
  const [savings, setSavings] = useState("");
  const [targetDate, setTargetDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [allowedAmount, setAllowedAmount] = useState(null);

  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const day = targetDate.getDate();

  useEffect(() => {
    // 모든 입력 값이 채워지고, 올바른 형식이라면 가용 예산을 계산하여 업데이트
    if (income && fixedCost && savings && targetDate instanceof Date) {
      const calculatedAllowedAmount = calculateAllowedAmount(
        parseInt(income),
        parseInt(fixedCost),
        parseInt(savings),
        targetDate
      );
      setAllowedAmount(calculatedAllowedAmount);
    } else {
      setAllowedAmount(null);
    }
  }, [income, fixedCost, savings, targetDate]);

  const calculateAllowedAmount = (income, fixedCost, savings, targetDate) => {
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const remainingDays = Math.ceil(
      (targetDate.getTime() - new Date().getTime()) / oneDayMilliseconds
    );
    const calculatedAllowedAmount =
      Math.round((income - fixedCost - savings) / remainingDays / 10) * 10;

    return calculatedAllowedAmount;
  };

  const handleSaveData = async () => {
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, "users", route.params.uid);
        const userData = await transaction.get(userRef);

        if (!userData.exists()) {
          throw new Error("User data not found");
        }

        if (
          !income ||
          !fixedCost ||
          !savings ||
          !(targetDate instanceof Date)
        ) {
          throw new Error("Invalid values");
        }

        transaction.update(userRef, {
          userIncome: parseInt(income),
          userFixedCost: parseInt(fixedCost),
          userSavings: parseInt(savings),
          userTargetDate: targetDate,
          userAllowedAmount: allowedAmount,
        });
      });

      Alert.alert("Success", "데이터가 성공적으로 저장되었습니다.");
      navigation.replace("MainDrawer");
    } catch (error) {
      Alert.alert("Error", "올바른 값을 입력해주세요!");
      console.log(error);
    }
  };

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (date) => {
    setTargetDate(date);
    hideDatePicker();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.amountText}>하루 가용 예산</Text>
          <Text style={styles.titleText}>을 계산합니다.</Text>
        </View>
        <Text style={styles.subtitleText}>
          한 달 월급, 고정비, 목표 저축액, 목표 날짜를
        </Text>
        <Text style={styles.subtitleText}>입력해주세요.</Text>
      </View>
      <View style={styles.inputContainer}>
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
        {/* 날짜 입력란 추가 */}
        <TouchableOpacity style={styles.input} onPress={showDatePicker}>
          <View style={styles.dateInput}>
            <Text
              style={styles.dateInputText}
            >{`${year}년 ${month}월 ${day}일`}</Text>
            <MaterialCommunityIcons
              name="calendar"
              size={20}
              color={"#278698"}
            />
          </View>
        </TouchableOpacity>
        {/* 하루 사용 가능 금액 렌더링 */}
        {allowedAmount === null ? (
          <Text style={styles.errorText}>값을 입력해주세요!</Text>
        ) : allowedAmount !== null && !isNaN(allowedAmount) ? (
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.allowedAmountText}>하루 사용 가능 금액: </Text>
            <Text style={[styles.allowedAmountText, { fontWeight: "bold" }]}>
              {`${allowedAmount.toLocaleString()}원`}
            </Text>
          </View>
        ) : (
          <Text style={styles.errorText}>올바른 값이 아니에요!</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveData}>
          <Text style={styles.saveButtonText}>시작하기</Text>
        </TouchableOpacity>
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        textColor="black"
        locale="ko"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: "8%",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  amountText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#29DEDE",
    marginBottom: 10,
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 16,
    color: "gray",
  },
  input: {
    fontSize: 16,
    width: "90%",
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 18,
    padding: 14,
    borderRadius: 16,
    justifyContent: "center",
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.8,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInputText: {
    fontSize: 16,
  },
  allowedAmountText: {
    fontSize: 16,
    color: "#20884B",
    marginTop: "10%",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#A93800",
    marginTop: "10%",
  },
  saveButton: {
    width: "90%",
    height: 60,
    borderRadius: 16,
    backgroundColor: "#29DEDE",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "gray",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",

    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.6,
  },
});

export default GetUserDataScreen;
