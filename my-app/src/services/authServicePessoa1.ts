import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { AuthResponse, User } from "../types";

// ... (As funções login, register e logout permanecem iguais) ...

export async function login(email: string, senha: string): Promise<AuthResponse> {
  try{
    const response = await api.post<AuthResponse>("/auth/login", { email, senha });
    const{token, user} = response.data;

    await AsyncStorage.setItem("token", token);

    if(user.repId){
      await AsyncStorage.setItem("repId", String(user.repId));
    }else{
      await AsyncStorage.removeItem("repId");
    }

    return{token, user};
  } catch (error: any) {
    throw error.response?.data || { message: "Erro ao realizar login" };
  }
}

export async function register(
  nome: string,
  email: string,
  senha: string,
  telefone: string,
  universidade: string,
  anoIngresso: string
): Promise<User> {
  try{
    const response = await api.post<User>("/auth/cadastro", {
      nome,
      email,
      senha,
      telefone,
      universidade,
      anoIngresso,
    });
    return response.data;
  }catch(error: any){
    throw error.response?.data || { message: "Erro no cadastro de usuário" };
  }
}

export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove(["token", "repId"]);
}

export type InitialState = "login" | "first access" | "home";

export async function verificarEstadoInicial(): Promise<InitialState>{
  const token = await AsyncStorage.getItem("token");
  const repId = await AsyncStorage.getItem("repId");

  if(!token) return "Login"; // Não tem token -> Login
  
  if(!repId) return "PrimeiroAcesso"; // Tem token, mas não tem rep -> Tela Azul (Primeiro Acesso)
  
  return "home"; // Tem token e tem rep -> Home
}