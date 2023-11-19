import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";

const AdminScreen = () => {
  const navigation = useNavigation();
  const [userAllowedAmount, setUserAllowedAmount] = useState(0);

  useEffect(() => {
    const userDoc = doc(db, "users", auth.currentUser.uid);

    const fetchUserAllowedAmount = async () => {
      const userDocSnapshot = await getDoc(userDoc);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUserAllowedAmount(userData.userAllowedAmount);
      }
    };

    fetchUserAllowedAmount();
  }, []);

  const generateRandomData = () => {
    const randomAmount = Math.floor(Math.random() * 1000) + 1000; // 최소 1000 이상의 랜덤한 값
    const roundedAmount = Math.round(randomAmount / 100) * 100; // 100원 단위로 반올림

    const randomStoreName = `Store_${Math.floor(Math.random() * 100)}`;
    const randomTimestamp = new Date().toISOString();

    return {
      usedAmount: roundedAmount,
      storeName: randomStoreName,
      timestamp: randomTimestamp,
    };
  };

  const generateAndSaveData = async () => {
    try {
      const transactionsCollection = collection(db, "transactions");
      const paymentsCollection = collection(db, "payments");
      const userDoc = doc(db, "users", auth.currentUser.uid);

      const generatedTransactionData = generateRandomData();
      const generatedPaymentData = generateRandomData();

      // transactions 데이터 생성 및 저장
      const transactionsDocRef = doc(
        transactionsCollection,
        auth.currentUser.uid
      );
      await updateDoc(transactionsDocRef, {
        transactionHistory: arrayUnion(generatedTransactionData),
      });

      // payments 데이터 생성 및 저장
      const paymentsDocRef = doc(paymentsCollection, auth.currentUser.uid);
      await updateDoc(paymentsDocRef, {
        paymentsHistory: arrayUnion(generatedPaymentData),
      });

      // userAllowedAmount 업데이트
      const updatedUserAllowedAmount =
        userAllowedAmount - generatedTransactionData.usedAmount;
      setUserAllowedAmount(updatedUserAllowedAmount);
      await updateDoc(userDoc, {
        userAllowedAmount: updatedUserAllowedAmount,
      });

      console.log("Data generated successfully!");
    } catch (error) {
      console.error("Error generating data:", error.message);
    }
  };

  return (
    <View>
      <Text>Admin Screen</Text>
      <Text>{`User Allowed Amount: ${userAllowedAmount}`}</Text>
      <Button title="Generate Data" onPress={generateAndSaveData} />
    </View>
  );
};

export default AdminScreen;
