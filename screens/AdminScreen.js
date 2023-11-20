import React, { useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import * as Notifications from "expo-notifications";

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
    const randomAmount = Math.floor(Math.random() * 1000) + 1000;
    const roundedAmount = Math.round(randomAmount / 100) * 100;
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

      const transactionsDocRef = doc(
        transactionsCollection,
        auth.currentUser.uid
      );
      const transactionsDocSnapshot = await getDoc(transactionsDocRef);

      if (transactionsDocSnapshot.exists()) {
        await updateDoc(transactionsDocRef, {
          transactionHistory: arrayUnion(generatedTransactionData),
        });
      } else {
        // 문서가 없는 경우, 새로운 문서를 생성하고 업데이트
        await setDoc(transactionsDocRef, {
          transactionHistory: [generatedTransactionData],
        });
      }

      const paymentsDocRef = doc(paymentsCollection, auth.currentUser.uid);
      const paymentsDocSnapshot = await getDoc(paymentsDocRef);

      if (paymentsDocSnapshot.exists()) {
        await updateDoc(paymentsDocRef, {
          paymentsHistory: arrayUnion(generatedPaymentData),
        });
      } else {
        // 문서가 없는 경우, 새로운 문서를 생성하고 업데이트
        await setDoc(paymentsDocRef, {
          paymentsHistory: [generatedPaymentData],
        });
      }

      // userAllowedAmount 업데이트
      const updatedUserAllowedAmount =
        userAllowedAmount - generatedTransactionData.usedAmount;
      setUserAllowedAmount(updatedUserAllowedAmount);
      await setDoc(userDoc, {
        userAllowedAmount: updatedUserAllowedAmount,
      });

      console.log("Data generated successfully!");
    } catch (error) {
      console.error("Error generating data:", error.message);
    }
  };

  const schedulePushNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "데이터 생성됨",
        body: "데이터가 성공적으로 생성되었습니다!",
      },
      trigger: { seconds: 2 },
    });
  };

  return (
    <View>
      <Button title="가상 데이터 생성" onPress={generateAndSaveData} />
    </View>
  );
};

export default AdminScreen;
