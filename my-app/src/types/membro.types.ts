export type TipoMembro = 'ADM' | 'MEMBRO' | 'AGREGADO' | 'EX_MORADOR';

export interface MembroDTO {
  usuarioId: number;
  nome: string;
  fotoUrl: string | null;
  funcao: TipoMembro;
  apelido?: string;
}

export interface ConviteRequestDTO {
  tipoMembro: TipoMembro;
  limiteUsos: number;    
  horasValidade: number;
}

export interface ConviteResponseDTO {
  link: string;
  token: string;
  dataExpiracao: string;
  mensagem: string;
}