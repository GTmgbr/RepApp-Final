import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { style } from "./styles";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { AntDesign, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import api from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function getLogin() {
    if (!email || !password) {
      return Alert.alert("Atenção", "Informe email e senha!");
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        senha: password.trim()
      });

      console.log("Login realizado:", response.data);

      const { token, id, nome, repId } = response.data;

      await AsyncStorage.setItem("@token", token);
      await AsyncStorage.setItem("@usuario", JSON.stringify({ id, nome }));
      if (repId) {
        await AsyncStorage.setItem("@repId", String(repId));
      } else {
        await AsyncStorage.removeItem("@repId");
      }

      if (repId) {
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Access" }],
        });
      }

    } catch (error: any) {
      console.error("Erro no login:", error);

      let mensagem = "Não foi possível realizar o login.";

      if (error.response) {
        // O servidor respondeu com um status de erro (ex: 401, 403)
        if (error.response.status === 401 || error.response.status === 403) {
          mensagem = "Email ou senha incorretos.";
        } else {
          mensagem = error.response.data?.message || "Erro no servidor.";
        }
      } else if (error.request) {
        mensagem = "Sem conexão com o servidor. Verifique sua internet ou o IP configurado.";
      }

      Alert.alert("Erro", mensagem);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={style.container}>
      <Image
        source={require("../../assets/logo.png")}
        style={style.logo}
        resizeMode="contain"
      />

      <Text style={style.appName}>RepApp</Text>
      <Text style={style.subtitle}>Organize sua vida em república</Text>
      <Text style={style.description}>
        Gerencie tarefas, finanças e eventos {"\n"}de forma simples e colaborativa
      </Text>

      <View style={style.inputContainer}>
        <TextInput
          style={style.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor="#8A8A8A"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={style.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          placeholderTextColor="#8A8A8A"
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={style.button} onPress={getLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={style.buttonText}>Entrar</Text>
        )}
      </TouchableOpacity>

      <View style={style.separatorContainer}>
        <View style={style.separatorLine} />
        <Text style={style.separatorText}>ou</Text>
        <View style={style.separatorLine} />
      </View>

      <TouchableOpacity style={style.googleButton} onPress={() => Alert.alert("Em breve", "Login com Google")}>
        <AntDesign name="google" size={20} color="#000" />
        <Text style={style.googleButtonText}>Continuar com Google</Text>
      </TouchableOpacity>

      <View style={style.featuresRow}>
        <View style={style.featureBox}>
          <Text style={style.featureIcon}>💲</Text>
          <Text style={style.featureText}>Finanças</Text>
        </View>
        <View style={style.featureBox}>
          <MaterialIcons name="checklist" size={22} color="#333" />
          <Text style={style.featureText}>Tarefas</Text>
        </View>
        <View style={style.featureBox}>
          <FontAwesome5 name="calendar-alt" size={20} color="#333" />
          <Text style={style.featureText}>Eventos</Text>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("RegisterUser")}>
        <Text style={style.signUpText}>
          Não tem conta? <Text style={style.signUpLink}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity>
        <Text style={style.forgotPassword}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}