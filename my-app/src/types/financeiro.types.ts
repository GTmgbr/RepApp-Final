// Tipos baseados nos DTOs do backend para Financeiro

export interface FinanceiroResumoDTO {
  saldoTotalRep: number;
  saldos: SaldoMoradorDTO[];
  despesasRecentes: DespesaDTO[];
}

export interface SaldoMoradorDTO {
  usuarioId: number;
  nome: string;
  fotoUrl: string | null;
  valor: number;
  statusTexto: string; // "Deve receber" ou "Devedor"
}

export interface DespesaDTO {
  id: number;
  descricao: string;
  valorTotal: number;
  data: string; // formato "yyyy-MM-dd"
  pagadorNome: string;
  valorPorPessoa: number;
}

export interface DespesaRequestDTO {
  descricao: string;
  valorTotal: number;
  data: string; // formato "yyyy-MM-dd"
  comprovante?: string; // URL opcional
  envolvidos: number[]; // Array de IDs dos usuários. Vazio [] = dividir entre todos
}
