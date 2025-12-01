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
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterUser() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [curso, setCurso] = useState("");
  const [universidade, setUniversidade] = useState("");
  const [anoIngresso, setAnoIngresso] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  async function handleRegister() {
    if (!nome || !email || !senha || !confirmarSenha || !universidade || !anoIngresso) {
      return Alert.alert("Atenção", "Preencha todos os campos obrigatórios!");
    }

    if (!validateEmail(email)) {
      return Alert.alert("Atenção", "Por favor, insira um email válido!");
    }

    if (senha !== confirmarSenha) {
      return Alert.alert("Atenção", "As senhas não coincidem!");
    }

    try {
      setLoading(true);

      const payload = {
        nomeCompleto: nome,
        email: email,
        senha: senha,
        universidade: universidade,
        ano: parseInt(anoIngresso),
        curso: curso,
        fotoUrl: ""
      };

      const response = await api.post("/auth/cadastro", payload);

      const { token, id, nome: nomeUsuario, repId } = response.data;

      await AsyncStorage.setItem('@token', token);
      await AsyncStorage.setItem('@usuario', JSON.stringify({ id, nome: nomeUsuario }));

      Alert.alert("Sucesso", "Bem-vindo ao RepApp!");

      if (repId) {
        await AsyncStorage.setItem('@repId', String(repId));
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: 'FirstAccess' }],
        });
      }

    } catch (error: any) {
      console.error(error);
      const mensagem = error.response?.data?.message || "Falha ao cadastrar usuário!";
      Alert.alert("Erro", mensagem);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={style.container}>
      <Text style={style.subtitle}>Primeiros passos</Text>
      <Text style={style.titleScreen}>Crie sua conta</Text>

      <Text style={style.sectionTitle}>Escolha uma foto:</Text>

      <View style={style.iconContainer}>
        <MaterialIcons name="person" size={42} color="#ffffff" />
      </View>

      <Text style={style.sectionTitle}>Informe os dados necessários:</Text>

      <View style={style.card}>

        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            placeholder="Nome completo"
            value={nome}
            onChangeText={setNome}
          />
        </View>

        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            placeholder="Curso (Ex: Engenharia)"
            value={curso}
            onChangeText={setCurso}
          />
        </View>

        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            placeholder="Universidade"
            value={universidade}
            onChangeText={setUniversidade}
          />
        </View>

        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            placeholder="Ano de ingresso"
            value={anoIngresso}
            onChangeText={(t) => setAnoIngresso(t.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>

        <View style={style.inputContainer}>
          <TextInput
            style={style.input}
            placeholder="Confirmar senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={style.button} onPress={handleRegister}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={style.buttonText}>Cadastrar</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={style.footerText}>
        Já tem conta?{" "}
        <Text
          style={style.link}
          onPress={() => navigation.navigate("Login")}
        >
          Faça login
        </Text>
      </Text>
    </ScrollView>
  );
}