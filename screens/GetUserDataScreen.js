import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // 추가

import { runTransaction } from "firebase/firestore";
import { doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const GetUserDataScreen = ({ navigation, route }) => {
  const [income, setIncome] = useState("");
  const [fixedCost, setFixedCost] = useState("");
  const [savings, setSavings] = useState("");
  const [targetDate, setTargetDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [allowedAmountText, setAllowedAmountText] = useState(""); // 추가

  // Date Picker 관련 함수
  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const hideDatePickerModal = () => {
    setShowDatePicker(false);
  };

  const handleDateConfirm = (date) => {
    setTargetDate(date);
    hideDatePickerModal();
  };

  // 데이터 계산 및 저장 함수
  const calculateAllowedAmount = (income, fixedCost, savings, targetDate) => {
    const oneDayMilliseconds = 24 * 60 * 60 * 1000;
    const remainingDays = Math.ceil(
      (targetDate.getTime() - new Date().getTime()) / oneDayMilliseconds
    );
    console.log(`오늘부터 ${targetDate}까지 남은 날짜: ${remainingDays}`);

    const allowedAmount =
      Math.round((income - fixedCost - savings) / remainingDays / 10) * 10;

    return allowedAmount;
  };

  const handleSaveData = async () => {
    try {
      await runTransaction(db, async (transaction) => {
        const userRef = doc(db, "users", route.params.uid);
        const userData = await transaction.get(userRef);

        if (!userData.exists()) {
          throw new Error("User data not found");
        }

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

        // 데이터 저장 후 계산된 가용예산을 텍스트로 업데이트
        setAllowedAmountText(
          `${targetDate}까지 하루 사용 가능 금액: ${allowedAmount}`
        );
      });

      Alert.alert("Success", "데이터가 성공적으로 저장되었습니다.");
      navigation.replace("MainDrawer");
    } catch (error) {
      console.log(error);
    }
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

        {/* 날짜 선택 버튼 */}
        <TouchableOpacity onPress={showDatePickerModal}>
          <View style={styles.dateInput}>
            <Text
              style={styles.dateInputText}
            >{`목표 날짜: ${targetDate.toDateString()}`}</Text>
          </View>
        </TouchableOpacity>

        {/* DateTimePickerModal */}
        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={hideDatePickerModal}
          textColor="black"
          locale="ko"
        />
      </View>
      <View style={styles.buttonContainer}>
        {/* 텍스트 조건에 따른 렌더링 */}
        {allowedAmountText ? (
          <Text style={styles.allowedAmountText}>{allowedAmountText}</Text>
        ) : (
          <Text style={styles.errorText}>올바른 값이 아니에요!</Text>
        )}

        {/* 저장 버튼 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveData}>
          <Text style={styles.saveButtonText}>시작하기</Text>
        </TouchableOpacity>
      </View>
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
    color: "#38eff2",
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
    width: "90%",
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 18,
    padding: 14,
    borderRadius: 16,
    shadowColor: "gray",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.8,
  },
  dateInput: {
    width: "90%",
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 18,
    padding: 14,
    borderRadius: 16,
    shadowColor: "gray",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.8,
  },
  dateInputText: {
    fontSize: 16,
  },
  resultContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  resultText: {
    fontSize: 16,
    color: "gray",
  },
  saveButton: {
    width: "90%",
    height: 60,
    borderRadius: 16,
    backgroundColor: "#38eff2",
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "gray",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.8,
  },
  saveButtonText: {
    fontSize: 20,
    color: "white",
    shadowColor: "gray",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.6,
  },
  datePickerText: {
    fontSize: 16,
    color: "#38eff2",
    marginBottom: 18,
  },

  allowedAmountText: {
    fontSize: 16,
    color: "green",
    marginBottom: 18,
  },

  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 18,
  },
});

export default GetUserDataScreen;
