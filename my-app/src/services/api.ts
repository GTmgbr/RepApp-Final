import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Substitua pelo IP da sua máquina ou localhost adequado
const api = axios.create({
  baseURL: "http://10.0.0.101:8081/api", 
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");

    // --- MUDANÇA AQUI ---
    // Se não tiver token real (login não feito), usa esse token falso para não travar suas requisições
    const tokenFinal = token || "TOKEN_MOCK_PESSOA_2"; 
    
    if (tokenFinal) {
      config.headers.Authorization = `Bearer ${tokenFinal}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;