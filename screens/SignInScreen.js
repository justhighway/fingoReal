import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// 공통으로 사용되는 그림자 스타일 함수
const shadow = {
  shadowColor: "gray",
  shadowOpacity: 0.3,
  shadowOffset: { width: 0, height: 1 },
  shadowRadius: 0.8,
};

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await initializeUserDocument(user.uid, email);

      navigation.replace("MainDrawer", { uid: user.uid });
      console.log("로그인 성공! 유저 정보:", user.uid); // 프로덕션 빌드에선 주석 처리
    } catch (error) {
      console.log(error);
      Alert.alert("로그인 실패", "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const initializeUserDocument = async (uid, userEmail) => {
    const userData = {
      uid: uid,
      userEmail: userEmail,
      userAccountID: "",
      userCardID: "",
      userAllowedAmout: 0,
      userIncome: 0,
      userFixedCost: 0,
      userSavings: 0,
      userTargetDate: null,
    };

    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, userData);
  };

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Fingo</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, shadow]}
          placeholder="이메일"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, shadow]}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.loginButton, shadow]}
          onPress={handleSignIn}
        >
          <Text style={styles.loginText}>로그인</Text>
        </TouchableOpacity>
        <Button
          title="계정이 없으신가요? 회원가입"
          onPress={() => navigation.navigate("SignUp")}
          color="gray"
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#38eff2",
    ...shadow, // 그림자 스타일 적용
  },
  input: {
    width: "90%",
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 14,
    borderRadius: 14,
    padding: 12,
    ...shadow, // 그림자 스타일 적용
  },
  loginButton: {
    width: "90%",
    height: 60,
    borderRadius: 14,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#38eff2",
    ...shadow, // 그림자 스타일 적용
  },
  loginText: {
    color: "white",
    fontSize: 20,
    ...shadow, // 그림자 스타일 적용
  },
});

export default SignInScreen;
