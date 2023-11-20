import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.title}>계좌 및 카드 정보 입력</Text>

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

      <Button title="저장하기" onPress={handleSaveData} />
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
});

export default GetFinfoScreen;
