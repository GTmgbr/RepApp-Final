import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

export async function login(email: string, senha: string) {
  try {
    const response = await api.post("/auth/login", { email, senha });
    const { token, user } = response.data;

    await AsyncStorage.setItem("token", token);
    return { token, user };
  } catch (error: any) {
    throw error.response?.data || { message: "Erro no login" };
  }
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
  try {
    const response = await api.post("/auth/register", {
      nome,
      email,
      senha,
      telefone,
      universidade,
      anoIngresso,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Erro no registro" };
  }
}
