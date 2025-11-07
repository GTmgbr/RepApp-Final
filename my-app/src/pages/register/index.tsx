import React, { useState } from "react";
import {
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { style } from "./styles";

export default function RegisterRep() {

  const navigation = useNavigation<NavigationProp<any>>();

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [cep, setCep] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!name || !street || !district || !cep || !email) {
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
    }

    try {
      setLoading(true);

      
      Alert.alert("Sucesso", "Rep cadastrada com sucesso!");
    } catch {
      Alert.alert("Erro", "Falha ao cadastrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={style.container}>

      <Text style={style.subtitle}>Primeiros passos</Text>
      <Text style={style.titleScreen}>Cadastre sua Rep</Text>

      <Text style={style.sectionTitle}>Escolha uma foto:</Text>

      <View style={style.iconContainer}>
        <MaterialIcons name="home" size={42} color="#ffffff" />
      </View>

      <Text style={style.sectionTitle}>Informe os dados necessários:</Text>

      <View style={style.card}>

        <View style={style.inputContainer}>
          <TextInput style={style.input} placeholder="Nome" value={name} onChangeText={setName} />
        </View>

        <View style={style.inputContainer}>
          <TextInput style={style.input} placeholder="Rua" value={street} onChangeText={setStreet} />
        </View>

        <View style={style.inputContainer}>
          <TextInput style={style.input} placeholder="Bairro" value={district} onChangeText={setDistrict} />
        </View>

        <View style={style.inputContainer}>
          <TextInput style={style.input} placeholder="CEP" value={cep} onChangeText={setCep} keyboardType="numeric" />
        </View>

        <View style={style.inputContainer}>
          <TextInput style={style.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        </View>

        <TouchableOpacity style={style.button} onPress={handleRegister}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={style.buttonText}>Cadastrar</Text>}
        </TouchableOpacity>
      </View>

      <Text style={style.footerText}>
        Já tem conta? <Text style={style.link} onPress={() => navigation.navigate("Login")}>Faça login</Text>
      </Text>

    </ScrollView>
  );
}
