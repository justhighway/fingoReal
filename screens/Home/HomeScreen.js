// HomeScreen.js:
import React, { useEffect, useState } from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { onSnapshot, collection, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebaseConfig";

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

  return (
    <View>
      <Text>{`User Allowed Amount: ${userAllowedAmount}`}</Text>
      <Button
        title="Go to Calendar Screen"
        onPress={() => navigation.navigate("CalendarScreen")}
      />
      <View>
        <Text>Transactions:</Text>
        {transactions.map((transaction) => (
          <View key={transaction.id}>
            <Text>{`Withdrawer: ${transaction.withDrawerName}`}</Text>
            <Text>{`Used Amount: ${transaction.usedAmount}`}</Text>
            <Text>{`Timestamp: ${transaction.timestamp}`}</Text>
          </View>
        ))}
      </View>
      <View>
        <Text>Payments:</Text>
        {payments.map((payment) => (
          <View key={payment.id}>
            <Text>{`Store Name: ${payment.storeName}`}</Text>
            <Text>{`Used Amount: ${payment.usedAmount}`}</Text>
            <Text>{`Timestamp: ${payment.timestamp}`}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default HomeScreen;
