import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  onSnapshot,
  collection,
  doc,
  getDoc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";
import { Notifications } from "expo";
import AdminScreen from "../AdminScreen";

const HomeScreen = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [userAllowedAmount, setUserAllowedAmount] = useState(0);

  useEffect(() => {
    const transactionsCollection = collection(db, "transactions");
    const paymentsCollection = collection(db, "payments");
    const userDoc = doc(db, "users", auth.currentUser.uid);

    const unsubscribeTransactions = onSnapshot(
      transactionsCollection,
      (snapshot) => {
        const transactionsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data().transactionHistory[0], // 첫 번째 인덱스의 데이터 추출
        }));
        console.log("transaction data:", transactionsData);
        setTransactions(transactionsData);
        updateAllowedAmount();
      }
    );

    const unsubscribePayments = onSnapshot(paymentsCollection, (snapshot) => {
      const paymentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data().paymentsHistory[0], // 첫 번째 인덱스의 데이터 추출
      }));
      console.log("payments data:", paymentsData);
      setPayments(paymentsData);
      updateAllowedAmount();
    });

    const fetchUserAllowedAmount = async () => {
      const userDocSnapshot = await getDoc(userDoc);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUserAllowedAmount(userData.userAllowedAmount);
      }
    };

    const updateAllowedAmount = () => {
      fetchUserAllowedAmount();
    };

    fetchUserAllowedAmount();

    return () => {
      unsubscribeTransactions();
      unsubscribePayments();
    };
  }, []);

  const handleNotification = async () => {
    try {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);

      if (status === "granted") {
        await Notifications.presentNotificationAsync({
          title: "Notification Title",
          body: "Notification Body",
        });
      }
    } catch (error) {
      console.error("Error presenting notification:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          borderBottomWidth: 2,
          borderBottomColor: "black",
        }}
      >{`사용 가능한 금액: ${userAllowedAmount.toLocaleString()}`}</Text>
      <View>
        <Text>출금내역:</Text>
        {transactions.map((transaction) => (
          <View key={transaction.id}>
            <Text>{`출금자명: ${transaction.storeName}`}</Text>
            <Text>{`출금액: ${transaction.usedAmount}`}</Text>
            <Text>{`출금시간: ${transaction.timestamp}`}</Text>
          </View>
        ))}
      </View>
      <View>
        <Text>카드승인내역:</Text>
        {payments.map((payment) => (
          <View key={payment.id}>
            <Text>{`결제처: ${payment.storeName}`}</Text>
            <Text>{`결제금액: ${payment.usedAmount}`}</Text>
            <Text>{`결제시간: ${payment.timestamp}`}</Text>
          </View>
        ))}
      </View>
      <AdminScreen />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
