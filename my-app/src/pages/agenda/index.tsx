import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { themas } from "../../global/themes";

export default function Agenda() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agenda</Text>
      <Text style={styles.subtitle}>Módulo em desenvolvimento</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: themas.colors.gray,
  },
});

