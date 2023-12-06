// PushNotificationHelper.js
import { scheduleNotificationAsync } from "expo-notifications";

export const SendPushNotification = async (latestPayment, remainingAmount) => {
  const { price } = latestPayment;

  // 푸시 알림 전송
  const notificationContent = {
    title: "결제 알림",
    body: `${price}원을 사용하셨어요. 남은 가용 자산: ${remainingAmount}원`,
  };

  await scheduleNotificationAsync({
    content: notificationContent,
    trigger: null, // trigger를 null로 설정하여 즉시 푸시 알림 전송
  });
};
