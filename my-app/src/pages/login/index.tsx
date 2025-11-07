import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { style } from "./styles";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { login } from "../../services/authService";
import { AntDesign, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function Login() {
  const navigation = useNavigation<NavigationProp<any>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function getLogin() {
    if (!email || !password) return alert("Informe email e senha!");

    try {
      setLoading(true);
      const response = await login(email.trim().toLowerCase(), password.trim());

      navigation.reset({ routes: [{ name: "Access" }] });
    } catch (error: any) {
      alert(error.response?.data?.mensagem || "Erro no login");
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

      <TouchableOpacity style={style.button} onPress={getLogin}>
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

      <TouchableOpacity style={style.googleButton}>
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

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
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
