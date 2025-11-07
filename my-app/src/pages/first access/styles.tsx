import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    width: "100%",
    height: Dimensions.get("window").height / 4.5,
    backgroundColor: "#1E5620",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "white",
    marginLeft: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 4,
    marginLeft: 10,
  },
  content: {
    marginTop: 70,
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  question: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: -90,
    textAlign: "center",
  },
  link: {
    fontSize: 15,
    color: "#0F7B4A",
    textAlign: "left",
    marginLeft: -50,
  },
  button: {
    marginTop: 130,
    backgroundColor: "#103C1F",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    elevation: 10,
  },
  footer: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
    marginTop: 30,
  },
  footerLink: {
    color: "#0F7B4A",
    textDecorationLine: "underline",
  },
  buttonLabel: {
  fontSize: 16,
  fontWeight: "bold",
  marginTop: 10,
  marginBottom: -120,
  textAlign: "center",
},
});
