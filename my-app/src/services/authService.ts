// src/services/authService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export async function login(email: string, senha: string) {
  const response = await api.post("/auth/login", { email, senha });
  const token = response.data?.token;

  if (token) {
    await AsyncStorage.setItem("token", token);
  }

  return response.data;
}

export async function logout() {
  await AsyncStorage.removeItem("token");
}

export async function register(
  nome: string,
  email: string,
  senha: string,
  telefone: string,
  universidade: string,
  anoIngresso: string
) {
  const response = await api.post("/auth/register", {
    nome,
    email,
    senha,
    telefone,
    universidade,
    anoIngresso,
  });

  return response.data;
}
