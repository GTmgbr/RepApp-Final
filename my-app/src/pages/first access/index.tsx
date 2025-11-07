import React, { useState } from "react";
import { Text, TouchableOpacity, View, Linking, Alert } from "react-native";
import { style } from "./styles";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function PrimeiroAcesso() {
  const [repName, setRepName] = useState("Minha República Exemplo"); // Nome fixo por enquanto, pode virar input

  async function handleCadastrarRep() {
    try {
      // Salvar no armazenamento local
      await AsyncStorage.setItem("@repName", repName);

      // Enviar para API 
      const response = await axios.post("https://suaapi.com/republicas", {
        nome: repName,
      });

      Alert.alert("Sucesso", "República cadastrada com sucesso!");
      console.log("Resposta da API:", response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível cadastrar a república.");
    }
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.subtitle}>Primeiro Acesso</Text>
        <Text style={style.title}>Bem vindo ao RepApp</Text>
      </View>

      <View style={style.content}>
        <Text style={style.question}>A sua rep já foi cadastrada?</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={style.link}>
            • Contate o administrador da rep para {"\n"} obter o link de acesso. {"\n"}{"\n"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />

        <Text style={style.question}>{"\n"}Deseja cadastrar uma rep?</Text>
        <TouchableOpacity onPress={() => {}}>
          <Text style={style.link}>
            • Cadastre a sua nova rep e organize {"\n"} tudo em um só lugar.
          </Text>
        </TouchableOpacity>

        <Text style={style.buttonLabel}>{"\n"}{"\n"}{"\n"}Cadastrar Rep</Text>

        <TouchableOpacity style={style.button} onPress={handleCadastrarRep}>
          <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={style.footer}>
          Ao criar sua república, você concorda com nossos{" "}
          <Text
            style={style.footerLink}
            onPress={() => Linking.openURL("#")}
          >
            Termos de Uso
          </Text>{" "}
          e{" "}
          <Text
            style={style.footerLink}
            onPress={() => Linking.openURL("#")}
          >
            Política de Privacidade
          </Text>
          .
        </Text>
      </View>
    </View>
  );
}
