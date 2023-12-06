// HomeScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { auth, db } from "../../firebaseConfig";
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  query,
  orderBy,
} from "firebase/firestore";
import GetDate from "../../components/GetDate";
import Box from "../../components/Box";

const HomeScreen = () => {
  const [userAllowedAmount, setUserAllowedAmount] = useState(0);
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    // Firestore에서 userAllowedAmount 가져오기
    const userId = auth.currentUser.uid;
    const userRef = doc(db, "users", userId);

    const unsubscribeUser = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUserAllowedAmount(doc.data().userAllowedAmount);
      }
    });

    return () => unsubscribeUser();
  }, []);

  useEffect(() => {
    // userAllowedAmount가 undefined인 경우 초기화
    if (userAllowedAmount === undefined) {
      setUserAllowedAmount(0);
    }
  }, [userAllowedAmount]);

  useEffect(() => {
    // Firestore에서 payment 데이터 가져오기 (실시간 업데이트)
    const userId = auth.currentUser.uid;
    const paymentsCollection = collection(db, "users", userId, "payments");
    const q = query(paymentsCollection, orderBy("timestamp", "desc"));

    const unsubscribePayments = onSnapshot(q, (querySnapshot) => {
      const paymentsData = [];
      querySnapshot.forEach((doc) => {
        paymentsData.push({
          paymentID: doc.id,
          store: doc.data().store,
          price: doc.data().price,
          timestamp: doc.data().timestamp,
        });
      });
      setPaymentData(paymentsData);
    });

    return () => unsubscribePayments();
  }, []); // 빈 배열을 전달하여 한 번만 실행되도록 설정

  const generateRandomAmount = () => {
    // 최소 1000 이상, 최대 15000 이하, 100단위로 랜덤한 금액 생성
    return Math.floor(Math.random() * 141 + 10) * 100;
  };

  const generateRandomStore = () => {
    const storeNames = ["상점A", "상점B", "상점C", "상점D", "상점E"];
    const randomIndex = Math.floor(Math.random() * storeNames.length);
    return storeNames[randomIndex];
  };

  const handleGenerateRandomData = async () => {
    // 랜덤 데이터 생성
    const randomPrice = generateRandomAmount();
    const randomStore = generateRandomStore();

    // Firestore에 데이터 저장 (users/userID/payments 서브컬렉션에 문서 생성)
    const userId = auth.currentUser.uid;
    const paymentsCollection = collection(db, "users", userId, "payments");
    await addDoc(paymentsCollection, {
      store: randomStore,
      price: randomPrice,
      timestamp: serverTimestamp(),
    });

    // userAllowedAmount 업데이트
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      userAllowedAmount: userAllowedAmount - randomPrice,
    });
  };

  const formatTimestamp = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}. ${month}. ${day}. ${hours}:${minutes}`;
  };

  const renderPaymentItem = ({ item }) => {
    const formattedTimestamp = item.timestamp
      ? formatTimestamp(item.timestamp.toDate())
      : "알 수 없음";

    return (
      <View style={styles.paymentItem}>
        <View style={styles.storePrice}>
          <Text style={styles.itemText}>{`${item.store}`}</Text>
          <Text
            style={styles.priceText}
          >{`-${item.price.toLocaleString()}`}</Text>
        </View>
        <Text style={styles.itemText}>{formattedTimestamp}</Text>
      </View>
    );
  };

  if (userAllowedAmount === undefined) {
    // userAllowedAmount가 로딩 중일 때의 처리
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.semiContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.titleText}>fingo</Text>
        </View>
        <View style={styles.textContainer}>
          <GetDate />
          <Text style={styles.text}>사용 가능한 금액</Text>
          <Text
            style={styles.amountText}
          >{`${userAllowedAmount.toLocaleString()}원`}</Text>
        </View>
        <View style={styles.boxContainer}>
          {/* <Button title="가상 데이터 생성" onPress={handleGenerateRandomData} /> */}
          <Box onPress={handleGenerateRandomData} />
        </View>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={paymentData}
          keyExtractor={(item) => item.paymentID}
          renderItem={renderPaymentItem}
          contentContainerStyle={{
            backgroundColor: "#5bebcc",
            borderRadius: 18,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  semiContainer: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 3,
    justifyContent: "center",
    marginLeft: 20,
    marginTop: 20,
  },
  boxContainer: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",

    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  text: {
    fontSize: 20,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#5bebcc",
  },
  amountText: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
  },
  paymentItem: {
    borderBottomWidth: 1,
    borderBottomColor: "white",
    marginTop: 14,
    padding: 18,
  },
  storePrice: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    fontSize: 18,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
