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
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, db } from "../firebaseConfig";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        userEmail: email,
        userTargetedAid: "",
        userTargetedCid: "",
        userAllowedAmout: 0,
        userIncome: 0,
        userFixedCost: 0,
        userSavings: 0,
        userTargetDate: null,
      });

      await AsyncStorage.setItem("user", JSON.stringify(user));

      navigation.replace("GetFinfo", { uid: user.uid });
    } catch (error) {
      Alert.alert("Error", "회원가입에 실패했습니다.");
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
        <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
          <Text style={styles.loginText}>회원가입</Text>
        </TouchableOpacity>
        <Button
          title="이미 회원이신가요? 로그인"
          onPress={() => navigation.pop()}
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

export default SignUpScreen;
