export interface User{
  id: number;
  nome: string;
  email: string;
  repId: number | null; // Pode ser null se ele ainda não tiver república
}

// Resposta do Login
export interface AuthResponse{
  token: string;
  user: User;
}

export interface EnderecoDTO{
  nome: string;
  rua: string;
  numero: string;
  bairro: string;
  cep: string;
  email: string;
}