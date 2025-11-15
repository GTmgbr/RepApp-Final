import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
  TabArea: {
    height: 70,
    backgroundColor: "#FFF",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: themas.colors.lightGray,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    paddingBottom: 5,
  },
  TabItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  TabItemContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  TabItemLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});
