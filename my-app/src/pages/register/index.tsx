import React, { useState } from "react";
import {
  Text,
  View,
  Alert,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { style } from "./styles";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterRep() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [district, setDistrict] = useState("");
  const [cep, setCep] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  async function handleRegister() {
    if (!name || !street || !number || !district || !cep || !email) {
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
    }

    if (!validateEmail(email)) {
      return Alert.alert("Atenção", "Por favor, insira um email válido!");
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('@token');
      if (!token) {
        Alert.alert("Erro", "Sessão expirada. Faça login novamente.");
        navigation.navigate("Login");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      const payload = {
        nome: name,
        email: email,
        endereco: {
          rua: street,
          numeroCasa: parseInt(number),
          bairro: district,
          cep: cep.replace(/\D/g, ""),
          estado: "MG"
        },
        visibilidade: "PUBLICA"
      };


      const response = await api.post("/reps", payload, config);

      console.log("Rep criada:", response.data);
      await AsyncStorage.setItem("@repId", String(response.data.id));
      await AsyncStorage.setItem("@tokenCadastroRep", response.data.tokenCadastro || "");

      Alert.alert("Sucesso", "República cadastrada com sucesso!", [
        {
          text: "Ir para Home",
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            });
          }
        }
      ]);

    } catch (error: any) {
      console.error(error);
      const msg = error.response?.data?.message || "Falha ao cadastrar a república.";
      Alert.alert("Erro", msg);
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
          <TextInput style={style.input} placeholder="Número" value={number} onChangeText={setNumber} keyboardType="numeric" />
        </View>

        <View style={style.inputContainer}>
          <TextInput style={style.input} placeholder="Bairro" value={district} onChangeText={setDistrict} />
        </View>

        <View style={style.inputContainer}>
          <TextInput style={style.input} placeholder="CEP" value={formatCEP(cep)} onChangeText={setCep} keyboardType="numeric" maxLength={9} />
        </View>

        <View style={style.inputContainer}>
          <TextInput style={style.input} placeholder="Email da Rep" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        </View>

        <TouchableOpacity style={style.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={style.buttonText}>Cadastrar</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}