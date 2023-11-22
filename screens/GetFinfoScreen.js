import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { doc, updateDoc, setDoc, addDoc, collection } from "firebase/firestore";
import { getHashedValue } from "../lib/authFunction"; // 이 부분은 나중에 라이브러리에서 가져오도록 설정하세요
import { db } from "../firebaseConfig";

const GetFinfoScreen = ({ navigation, route }) => {
  const [accountNumber, setAccountNumber] = useState("");
  const [accountPassword, setAccountPassword] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardPassword, setCardPassword] = useState("");

  const handleSaveData = async () => {
    try {
      const hashedAccountNumber = await getHashedValue(accountNumber);
      const hashedAccountPassword = await getHashedValue(accountPassword);
      const hashedCardNumber = await getHashedValue(cardNumber);
      const hashedCardPassword = await getHashedValue(cardPassword);

      const accountDocRef = await addAccountToFirestore(
        hashedAccountNumber,
        hashedAccountPassword
      );
      const cardDocRef = await addCardToFirestore(
        hashedCardNumber,
        hashedCardPassword
      );

      // Firestore에 데이터 업데이트
      await updateDoc(doc(db, "users", route.params.uid), {
        userTargetedAid: accountDocRef.id,
        userTargetedCid: cardDocRef.id,
      });

      Alert.alert("Success", "데이터가 성공적으로 저장되었습니다.");
      navigation.navigate("GetUserData", { uid: route.params.uid });
    } catch (error) {
      Alert.alert("Error", "데이터 저장에 실패했습니다.");
    }
  };

  const addAccountToFirestore = async (
    hashedAccountNumber,
    hashedAccountPassword
  ) => {
    const accountsCollectionRef = collection(db, "accounts");
    const accountDocRef = await addDoc(accountsCollectionRef, {
      ownUid: route.params.uid,
      accountBank: 1, // 예시로 A Bank
      accountNo: hashedAccountNumber,
      accountPassword: hashedAccountPassword,
      transactionsId: "", // TODO: transactions.tid에 맞게 업데이트
      accountBalance: 0, // TODO: 적절한 초기 잔고 설정
    });
    return accountDocRef;
  };

  const addCardToFirestore = async (hashedCardNumber, hashedCardPassword) => {
    const cardsCollectionRef = collection(db, "cards");
    const cardDocRef = await addDoc(cardsCollectionRef, {
      ownUid: route.params.uid,
      cardCompany: 1, // 예시로 A Company
      cardNo: hashedCardNumber,
      cardPassword: hashedCardPassword,
      paymentsId: "", // TODO: payments.pid에 맞게 업데이트
    });
    return cardDocRef;
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
        <TextInput
          style={styles.input}
          placeholder="계좌번호"
          value={accountNumber}
          onChangeText={setAccountNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="계좌비밀번호"
          value={accountPassword}
          onChangeText={setAccountPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="카드번호"
          value={cardNumber}
          onChangeText={setCardNumber}
        />

        <TextInput
          style={styles.input}
          placeholder="카드비밀번호"
          value={cardPassword}
          onChangeText={setCardPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveData}>
          <Text style={styles.saveButtonText}>저장하기</Text>
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
