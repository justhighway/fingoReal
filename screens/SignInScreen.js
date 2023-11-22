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
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../firebaseConfig";
import { useUser } from "../context/userContext";

const SignInScreen = ({ navigation }) => {
  const { user, loginUser } = useUser();
  const [email, setEmail] = useState(""); // email 상태 추가
  const [password, setPassword] = useState(""); // password 상태 추가

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await AsyncStorage.setItem("user", JSON.stringify(user));
      navigation.replace("MainDrawer", { uid: user.uid });
      console.log("로그인 성공! 유저 정보:", user);
    } catch (error) {
      Alert.alert("Error", "로그인에 실패했습니다.");
    }
  };

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Fingo</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={email}
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
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
    shadowColor: "gray",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.8,
  },
  input: {
    width: "90%",
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 14,
    borderRadius: 14,
    padding: 12,
    shadowColor: "gray",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 0.8,
  },
  loginButton: {
    width: "90%",
    height: 60,
    borderRadius: 14,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#38eff2",
    shadowColor: "gray",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.4,
  },
  loginText: {
    color: "white",
    fontSize: 20,
    shadowColor: "gray",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 0.4,
  },
});

export default SignInScreen;
