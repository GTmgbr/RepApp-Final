import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
// Se não usar Expo, substitua Feather por um componente de texto simples
import { Feather } from '@expo/vector-icons'; 
import { operacionalService } from '../services/operacionalService';
import { Aviso } from '../types/operacional.types';

export default function Mural() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);

  useEffect(() => {
    operacionalService.getAvisos().then(setAvisos).catch(console.error);
  }, []);

  // Lógica Visual: Cores baseadas na Urgência
  const getCorUrgencia = (urgencia: string) => {
    switch(urgencia) {
      case 'ALTA': return '#dc3545'; // Vermelho
      case 'MEDIA': return '#ffc107'; // Amarelo
      default: return '#28a745';     // Verde
    }
  };

  // Lógica Visual: Ícones baseados na Categoria
  const getIcone = (categoria: string) => {
    switch(categoria) {
      case 'MANUTENCAO': return 'tool';
      case 'FINANCEIRO': return 'dollar-sign';
      case 'REGRAS': return 'alert-circle';
      default: return 'info';
    }
  };

  const renderAviso = ({ item }: { item: Aviso }) => (
    <View style={[styles.card, { borderLeftColor: getCorUrgencia(item.urgencia) }]}>
      <View style={styles.header}>
        <Feather name={getIcone(item.categoria) as any} size={24} color="#555" />
        <Text style={styles.titulo}>{item.titulo}</Text>
      </View>
      <Text style={styles.descricao}>{item.descricao}</Text>
      <View style={styles.footer}>
        <Text style={styles.tag}>{item.categoria}</Text>
        <Text style={styles.data}>{item.dataCriacao}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={avisos}
        keyExtractor={item => String(item.id)}
        renderItem={renderAviso}
        contentContainerStyle={{ padding: 15 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#FFF', borderRadius: 8, padding: 15, marginBottom: 15, borderLeftWidth: 6, elevation: 2 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  titulo: { fontSize: 18, fontWeight: 'bold', marginLeft: 10, color: '#333' },
  descricao: { fontSize: 14, color: '#555', marginBottom: 12, lineHeight: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between' },
  tag: { fontSize: 10, fontWeight: 'bold', backgroundColor: '#EEE', paddingHorizontal: 6, paddingVertical: 4, borderRadius: 4, color: '#666' },
  data: { fontSize: 12, color: '#999' }
});