import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { operacionalService } from './operacionalService';
import { Tarefa } from '../types/operacional.types';

// ID Mockado do usuário logado para o filtro "Minhas" funcionar
const MEU_USER_ID = 10; 

export default function Tarefas() {
  const navigation = useNavigation<any>();
  const [todasTarefas, setTodasTarefas] = useState<Tarefa[]>([]);
  const [listaExibida, setListaExibida] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'TODAS' | 'MINHAS' | 'PENDENTES'>('TODAS');

  const carregarTarefas = async () => {
    setLoading(true);
    try {
      const dados = await operacionalService.getTarefas();
      setTodasTarefas(dados);
    } catch (error) {
      console.log("Erro ao carregar tarefas", error);
    } finally {
      setLoading(false);
    }
  };

  // Recarrega sempre que a tela ganha foco (ex: voltou da criação)
  useFocusEffect(useCallback(() => { carregarTarefas(); }, []));

  // Lógica de Filtragem das Abas
  useEffect(() => {
    let lista = todasTarefas;
    if (abaAtiva === 'PENDENTES') {
      lista = todasTarefas.filter(t => !t.concluida);
    } else if (abaAtiva === 'MINHAS') {
      lista = todasTarefas.filter(t => t.responsaveis.some(r => r.id === MEU_USER_ID));
    }
    setListaExibida(lista);
  }, [abaAtiva, todasTarefas]);

  // Checkbox: Atualização Otimista (Visual primeiro, API depois)
  const handleToggle = async (id: number) => {
    const backup = [...todasTarefas];
    
    // 1. Atualiza visualmente na hora
    setTodasTarefas(prev => prev.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t));

    try {
      // 2. Chama o PATCH no servidor
      await operacionalService.concluirTarefa(id);
    } catch (error) {
      // 3. Reverte se der erro
      setTodasTarefas(backup);
      Alert.alert("Erro", "Não foi possível concluir a tarefa");
    }
  };

  const renderItem = ({ item }: { item: Tarefa }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => handleToggle(item.id)} style={styles.checkArea}>
        <View style={[styles.checkbox, item.concluida && styles.checked]}>
          {item.concluida && <Text style={{color: '#FFF', fontWeight: 'bold'}}>✓</Text>}
        </View>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={[styles.titulo, item.concluida && styles.riscado]}>{item.titulo}</Text>
        <Text style={styles.sub}>
          Prazo: {item.prazo} • Prioridade: {item.prioridade}
        </Text>
        <Text style={styles.resp}>
          Resp: {item.responsaveis.map(r => r.nome).join(', ')}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Abas Superiores */}
      <View style={styles.tabBar}>
        {['TODAS', 'MINHAS', 'PENDENTES'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabItem, abaAtiva === tab && styles.tabItemAtivo]}
            onPress={() => setAbaAtiva(tab as any)}
          >
            <Text style={[styles.tabText, abaAtiva === tab && styles.tabTextAtivo]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? <ActivityIndicator size="large" color="#007AFF" style={{marginTop: 20}}/> : (
        <FlatList
          data={listaExibida}
          renderItem={renderItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      {/* Botão Flutuante (FAB) */}
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('NovaTarefa')}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  tabBar: { flexDirection: 'row', backgroundColor: '#FFF', elevation: 2, marginBottom: 10 },
  tabItem: { flex: 1, padding: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabItemAtivo: { borderBottomColor: '#007AFF' },
  tabText: { fontWeight: '600', color: '#888' },
  tabTextAtivo: { color: '#007AFF' },
  card: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, marginHorizontal: 10, marginBottom: 10, borderRadius: 8, elevation: 1 },
  checkArea: { justifyContent: 'center', marginRight: 15 },
  checkbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: '#007AFF', alignItems: 'center', justifyContent: 'center' },
  checked: { backgroundColor: '#007AFF' },
  titulo: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  riscado: { textDecorationLine: 'line-through', color: '#999' },
  sub: { fontSize: 12, color: '#666', marginTop: 4 },
  resp: { fontSize: 12, color: '#007AFF', marginTop: 2 },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#007AFF', alignItems: 'center', justifyContent: 'center', elevation: 5 },
  fabIcon: { color: '#FFF', fontSize: 30, marginTop: -4 }
});