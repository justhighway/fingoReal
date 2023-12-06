import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Calendar } from "react-native-calendars";

export default function CalendarTracker() {
  return (
    <Calendar
      // 날짜를 누르면 실행되는 핸들러. default = undefined
      onDayPress={(day) => {
        console.log("선택된 날짜", day);
      }}
      // 날짜를 길게 누르면 실행되는 핸들러. default = undefined
      onDayLongPress={(day) => {
        console.log("길게 선택된 날짜", day);
      }}
      // 달력 제목의 월 형식. 형식 지정 값: http://arshaw.com/xdate/#Formatting
      monthFormat={"yyyy MM"}
      // 달력에서 가시적인 달이 변경될 때 실행되는 핸들러. default = undefined
      onMonthChange={(month) => {
        console.log("월이 변경되었습니다", month);
      }}
      // 월 탐색 화살표 숨김. default = false
      //hideArrows={true}
      // 기본 화살표를 사용자 지정 화살표로 바꿉니다 (방향은 'left' 또는 'right'가 될 수 있음)
      //renderArrow={(direction) => <Arrow />}
      // 월 페이지에서 다른 달의 날짜를 탭하면 월이 전환되지 않습니다. default = false
      //hideExtraDays={true}
      // hideArrows = false이고 hideExtraDays = false인 경우 다른 달의 회색 날짜를 탭할 때 월 전환되지 않습니다.
      disableMonthChange={true}
      // firstDay = 1이면 월요일부터 주가 시작됩니다. 주의: dayNames 및 dayNamesShort는 여전히 일요일부터 시작해야 합니다.
      firstDay={1}
      // 요일 이름 숨김. default = false
      //hideDayNames={true}
      // 왼쪽에 주 번호 표시. default = false
      //showWeekNumbers={true}
      // 좌측 화살표 아이콘을 누를 때 실행되는 핸들러. 콜백을 사용하여 이전 달로 이동할 수 있습니다
      onPressArrowLeft={(subtractMonth) => subtractMonth()}
      // 우측 화살표 아이콘을 누를 때 실행되는 핸들러. 콜백을 사용하여 다음 달로 이동할 수 있습니다
      onPressArrowRight={(addMonth) => addMonth()}
      // 왼쪽 화살표 비활성화. default = false
      //disableArrowLeft={true}
      // 오른쪽 화살표 비활성화. default = false
      //disableArrowRight={true}
      // 비활성화된 날짜에 대한 모든 터치 이벤트 비활성화. markedDates의 'disableTouchEvent'로 재정의할 수 있습니다. default = false
      disableAllTouchEventsForDisabledDays={true}
      // 기본 제목 대신 사용자 정의 제목으로 교체합니다. 함수는 매개변수로 날짜를 받습니다
      renderHeader={(date) => {
        {
          date;
        }
      }}
      // 월 간 스와이프 옵션 활성화. default = false
      enableSwipeMonths={true}
    />
  );
}

const styles = StyleSheet.create({});
