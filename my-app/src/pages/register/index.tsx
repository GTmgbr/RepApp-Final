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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCEP = (cep: string) => {
    const cepRegex = /^\d{5}-?\d{3}$/;
    return cepRegex.test(cep.replace(/\D/g, ""));
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) {
      return numbers;
    }
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  async function handleRegister() {
    if (!name || !street || !district || !cep || !email) {
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
    }

    if (!validateEmail(email)) {
      return Alert.alert("Atenção", "Por favor, insira um email válido!");
    }

    if (!validateCEP(cep)) {
      return Alert.alert("Atenção", "Por favor, insira um CEP válido! (Formato: 12345-678)");
    }

    try {
      setLoading(true);

      // TODO: Implementar chamada à API
      // await api.post("/republicas", { name, street, district, cep, email });
      
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
          <TextInput 
            style={style.input} 
            placeholder="CEP" 
            value={formatCEP(cep)} 
            onChangeText={(text) => setCep(text.replace(/\D/g, ""))} 
            keyboardType="numeric"
            maxLength={9}
          />
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
