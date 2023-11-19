import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
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
    } catch (error) {
      Alert.alert("Error", "로그인에 실패했습니다.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>로그인</Text>

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={setEmail} // onChangeText 함수 추가
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        value={password}
        onChangeText={setPassword} // onChangeText 함수 추가
        secureTextEntry
      />

      <Button title="로그인" onPress={handleSignIn} />

      <Button
        title="회원가입"
        onPress={() => navigation.navigate("SignUp")}
        color="#3F51B5"
      />
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

export default SignInScreen;
