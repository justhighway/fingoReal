import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { getHashedValue } from "../lib/authFunction";
import { db } from "../firebaseConfig";

const GetFinfoScreen = ({ navigation, route }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardPassword, setCardPassword] = useState("");

  const handleSaveData = async () => {
    try {
      // 계좌 및 카드 번호 해싱
      const hashedAccountNumber = await getHashedValue(accountNumber);
      const hashedAccountPassword = await getHashedValue(accountPassword);
      const hashedCardNumber = await getHashedValue(cardNumber);
      const hashedCardPassword = await getHashedValue(cardPassword);

      // Firestore에 계좌 및 카드 데이터 추가
      const accountDocRef = await addDocumentToCollection(
        "accounts",
        route.params.uid,
        hashedAccountNumber,
        hashedAccountPassword
      );
      const cardDocRef = await addDocumentToCollection(
        "cards",
        route.params.uid,
        hashedCardNumber,
        hashedCardPassword
      );

      // 유저 문서 업데이트
      await updateDoc(doc(db, "users", route.params.uid), {
        userAccountID: accountDocRef.id,
        userCardID: cardDocRef.id,
      });

      // 성공적인 데이터 저장 알림 및 화면 전환
      Alert.alert("Success", "데이터가 성공적으로 저장되었습니다.");
      console.log("저장된 Finfo 데이터:");
      navigation.navigate("GetUserData", { uid: route.params.uid });
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "데이터 저장에 실패했습니다.");
      console.log("데이터 저장 실패:", error);
    }
  };

  // Firestore에 데이터 추가 함수 일반화
const addDocumentToCollection = async (
  collectionName,
  ownUid,
  hashedAccountNumber,
  hashedAccountPassword
) => {
  const collectionRef = collection(db, collectionName);
  const documentRef = await addDoc(collectionRef, {
    ownUid: ownUid,
    accountNo: hashedAccountNumber,
    accountPassword: hashedAccountPassword,
    transactionsId: "", // TODO: transactions.tid에 맞게 업데이트
    accountBalance: 0, // TODO: 적절한 초기 잔고 설정
  });

  return documentRef;
};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <View style={{ flexDirection: "row", fontSize: 24 }}>
          <Text style={styles.fingoText}>Fingo</Text>
          <Text style={styles.text}>와 함께</Text>
        </View>
        <Text style={styles.text}>예산 관리를 시작해볼까요?</Text>
        <Text style={styles.descriptionText}>
          카드, 계좌 정보 입력이 필요합니다.
        </Text>
      </View>
      <View style={styles.inputContainer}>
        {/* TextInput을 렌더링하는 함수 호출 */}
        {renderTextInput("계좌번호", accountNumber, setAccountNumber, 16)}
        {renderTextInput(
          "계좌비밀번호",
          accountPassword,
          setAccountPassword,
          4,
          true
        )}
        {renderTextInput("카드번호", cardNumber, setCardNumber, 16)}
        {renderTextInput(
          "카드비밀번호",
          cardPassword,
          setCardPassword,
          4,
          true
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveData}>
          <Text style={styles.saveButtonText}>저장하기</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// TextInput을 렌더링하는 함수 정의
const renderTextInput = (
  placeholder,
  value,
  onChangeText,
  maxLength,
  isPassword = false
) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      maxLength={maxLength}
      onChangeText={onChangeText}
      secureTextEntry={isPassword}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    marginLeft: "8%",
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
  fingoText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#38eff2",
  },
  text: {
    fontSize: 24,
  },
  descriptionText: {
    fontSize: 18,
    color: "gray",
    marginTop: 14,
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
});

export default GetFinfoScreen;
