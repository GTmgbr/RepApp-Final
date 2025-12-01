import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

// Paleta de Colores del Figma
const colors = {
  primary: "#0066ff", // Azul/Morado intenso del header y botones
  background: "#F0F2F5", // Gris claro de fondo
  card: "#FFFFFF", // Blanco del contenedor
  textDark: "#2F2E41", // Texto oscuro para preguntas
  textLight: "#FFFFFF", // Texto claro para el header
  textGray: "#666666", // Texto gris para el footer
};

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    width: "100%",
    height: 200,
    backgroundColor: colors.primary,
    justifyContent: "center",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingBottom: 20,
  },
  subtitle: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: "400",
  },
  title: {
    color: colors.textLight,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 5,
  },
  content: {
    flex: 1,
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textDark,
    marginBottom: 10,
  },
  link: {
    fontSize: 15,
    color: colors.primary,
    lineHeight: 22,
    marginLeft: 10,
    marginBottom: 15,
  },
  buttonLabel: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginTop: 20,
    marginBottom: 15,
  },
  button: {
    width: 60,
    height: 60,
    backgroundColor: colors.primary,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 30,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  footer: {
    textAlign: "center",
    fontSize: 13,
    color: colors.textGray,
    lineHeight: 20,
  },
  footerLink: {
    fontWeight: "bold",
    color: colors.primary,
  },
});