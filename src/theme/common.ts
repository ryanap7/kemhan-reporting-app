import { StyleSheet } from "react-native";

export const GlobalStyles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  between: {
    justifyContent: "space-between",
  },
});
