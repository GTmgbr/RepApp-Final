export type CategoriaAviso = 'GERAL' | 'FINANCEIRO' | 'LIMPEZA' | 'EVENTO' | 'MANUTENCAO';
export type UrgenciaAviso = 'BAIXA' | 'MEDIA' | 'ALTA';

export interface AvisoDTO {
  id: number;
  titulo: string;
  descricao: string;
  categoria: CategoriaAviso;
  urgencia: UrgenciaAviso;
  valor?: number; 
  ativo: boolean;
  
  autorId: number;
  autorNome: string;
  autorFoto?: string;
  
  dataCriacao: string;
}

export interface AvisoRequestDTO {
  titulo: string;
  descricao: string;
  categoria: CategoriaAviso;
  urgencia: UrgenciaAviso;
  valor?: number;
}