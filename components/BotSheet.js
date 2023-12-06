// BotSheet.js
import React, { useCallback, useMemo } from "react";
import { View, StyleSheet, Text } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

const BotSheet = ({ isVisible, onClose, transactions, payments }) => {
  const snapPoints = useMemo(() => ["43%", "58%", "85%"], []);
  const transactionsData = transactions || [];
  const paymentsData = payments || [];

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  const renderItem = useCallback(
    ({ item, index }) => (
      <View style={styles.itemContainer} key={index}>
        <View style={styles.placeDate}>
          <Text style={styles.text}>
            {item.withDrawerName || item.storeName}
          </Text>
          <Text style={styles.text}>{item.timestamp}</Text>
        </View>
        <Text style={styles.priceText}>
          -{item.usedAmount.toLocaleString()}
        </Text>
      </View>
    ),
    []
  );

  return (
    <BottomSheet
      isVisible={isVisible}
      onClose={onClose}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      backgroundStyle={{
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
      }}
    >
      <Text style={styles.spendDetail}>지출내역</Text>
      <BottomSheetFlatList
        data={[...transactionsData, ...paymentsData]}
        keyExtractor={(item, index) => item.id + index.toString()} // 수정: 유니크한 키로 수정
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "white",
    padding: "3%",
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  spendDetail: {
    marginLeft: "6%",
    color: "gray",
    fontWeight: "bold",
    padding: 10,
    marginBottom: 10,
  },
  placeDate: {
    marginLeft: "15%",
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18d6c0",
  },
});

export default BotSheet;
