import api from './api';
import { Tarefa, Aviso, CriarTarefaDTO, UsuarioResumo } from '../types/operacional.types';

// MOCK: ID fixo da república para testes enquanto o Login (Pessoa 1) não integra o repId real
const REP_ID_MOCK = 1;

export const operacionalService = {
  // --- TAREFAS ---
  getTarefas: async (): Promise<Tarefa[]> => {
    // Endpoint: /reps/{id}/tarefas
    const response = await api.get<Tarefa[]>(`/reps/${REP_ID_MOCK}/tarefas`);
    return response.data;
  },

  concluirTarefa: async (idTarefa: number): Promise<void> => {
    // Endpoint: PATCH /reps/{id}/tarefas/{tarefaId}/concluir
    await api.patch(`/reps/${REP_ID_MOCK}/tarefas/${idTarefa}/concluir`);
  },

  criarTarefa: async (dados: CriarTarefaDTO): Promise<Tarefa> => {
    // Endpoint: POST /reps/{id}/tarefas
    const response = await api.post<Tarefa>(`/reps/${REP_ID_MOCK}/tarefas`, dados);
    return response.data;
  },

  // --- AUXILIAR (Para o Dropdown de criação) ---
  getMoradores: async (): Promise<UsuarioResumo[]> => {
    try {
      const response = await api.get<UsuarioResumo[]>(`/reps/${REP_ID_MOCK}/moradores`);
      return response.data;
    } catch (error) {
      // Retorna Mock se o endpoint de moradores ainda não existir
      return [{ id: 10, nome: 'Eu (Mock)' }, { id: 2, nome: 'Outro Morador' }];
    }
  },

  // --- MURAL (AVISOS) ---
  getAvisos: async (): Promise<Aviso[]> => {
    // Endpoint: /reps/{id}/avisos
    const response = await api.get<Aviso[]>(`/reps/${REP_ID_MOCK}/avisos`);
    return response.data;
  }
};