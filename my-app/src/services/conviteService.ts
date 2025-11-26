import api from "./api";

export async function fazerJoinNaRep(tokenUUID: string) {
  try {
    const response = await api.post("/convites/entrar", {
      token: tokenUUID,
    });

    console.log("Resposta do backend:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao entrar na república:",
      error.response?.data || error.message
    );
    throw error;
  }
}
