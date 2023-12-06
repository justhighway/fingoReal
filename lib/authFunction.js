// lib/authFunctions.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import * as Crypto from "expo-crypto";

// SHA256 해싱 함수
export const getHashedValue = async (value) => {
  try {
    const hashedValue = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      value
    );
    return hashedValue;
  } catch (error) {
    throw new Error("값 해싱에 실패했습니다.");
  }
};

// 로그인 함수
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(
      "로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요."
    );
  }
};

// 회원가입 함수
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    throw new Error(
      "회원가입에 실패했습니다. 이미 가입된 이메일인지 확인해주세요."
    );
  }
};
