import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },

  subtitle: {
    marginTop: 20,
    fontSize: 16,
    color: "#5A5A5A",
    marginBottom: 5,
  },

  titleScreen: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
    color: "#1E1E1E",
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
    alignSelf: "flex-start",
    color: "#1E1E1E",
  },

  iconContainer: {
  width: 70,
  height: 70,
  borderRadius: 50,
  backgroundColor: "#9CA3AF",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 25,
  alignSelf: "flex-start",
},

  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    marginTop: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
  },

  input: {
    flex: 1,
    fontSize: 15,
  },

  button: {
    marginTop: 25,
    height: 50,
    backgroundColor: "#0052AA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },

  footerText: {
    marginTop: 22,
    fontSize: 15,
    color: "#555",
  },

  link: {
    color: "#0052AA",
    fontWeight: "bold",
  },
});
