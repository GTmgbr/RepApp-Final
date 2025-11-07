import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logo: {
    width: 90,
    height: 90,
    marginTop: 60,
  },
  appName: {
    fontSize: 26,
    fontWeight: "700",
    marginTop: 16,
    color: "#2A2A2A",
  },
  subtitle: {
    fontSize: 16,
    color: "#444",
    marginTop: 6,
  },
  description: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#FFF",
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    backgroundColor: "#0066FF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#DADADA",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#888",
  },
  googleButton: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FFF",
  },
  googleButtonText: {
    fontSize: 15,
    color: "#000",
  },
  featuresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 35,
  },
  featureBox: {
    alignItems: "center",
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    marginTop: 4,
    fontSize: 14,
    color: "#444",
  },
  signUpText: {
    fontSize: 14,
    marginTop: 35,
    color: "#444",
  },
  signUpLink: {
    fontWeight: "bold",
    color: "#0066FF",
  },
  forgotPassword: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
  },
});
