import axios,{InternalAxiosRequestConfig, AxiosError} from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.X.X:8080/api",
});

// Interceptor de Requisição
api.interceptors.request.use(
  async(config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem("token");
    if(token){
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default api;