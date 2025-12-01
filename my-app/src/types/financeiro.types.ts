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
  statusTexto: string;
}

export interface DespesaDTO {
  id: number;
  descricao: string;
  valorTotal: number;
  data: string;
  pagadorNome: string;
  valorPorPessoa: number;
}

export type TipoDespesa = 'GASTO' | 'PAGAMENTO';

export interface DespesaRequestDTO {
  descricao: string;
  valorTotal: number;
  data: string;         
  comprovanteUrl?: string; 
  envolvidosIds: number[]; 
  tipo: TipoDespesa;
}