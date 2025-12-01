import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Substitua pelo IP da sua máquina ou localhost adequado
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, 
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
