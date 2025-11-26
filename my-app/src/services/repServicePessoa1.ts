import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import{RepublicaDTO, EnderecoDTO} from "../types";

export async function criarRepublica(
  dadosRepublica: RepublicaDTO,
  dadosEndereco: EnderecoDTO
): Promise<any>{
  try{
    // Montagem do payload aninhado
    const payload = {
      ...dadosRepublica,
      endereco: {
        ...dadosEndereco,
      },
    };

    const response = await api.post("/reps", payload);

    // Se criou com sucesso, salva o ID para desbloquear o app
    if(response.data && response.data.id){
      await AsyncStorage.setItem("repId", String(response.data.id));
    }

    return response.data;
  }catch (error: any){
    throw error.response?.data || { message: "Erro ao criar república" };
  }
}