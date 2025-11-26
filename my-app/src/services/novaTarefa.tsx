import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { operacionalService } from '../services/operacionalService';
import { UsuarioResumo, Prioridade } from '../types/operacional.types';

export default function NovaTarefa() {
  const navigation = useNavigation();
  const [titulo, setTitulo] = useState('');
  const [prazo, setPrazo] = useState('');
  const [prioridade, setPrioridade] = useState<Prioridade>('MEDIA');
  
  // Dropdown Data
  const [moradores, setMoradores] = useState<UsuarioResumo[]>([]);
  const [respSelecionado, setRespSelecionado] = useState<number | null>(null);

  useEffect(() => {
    operacionalService.getMoradores().then(setMoradores);
  }, []);

  const handleSalvar = async () => {
    if (!titulo || !prazo || !respSelecionado) {
      return Alert.alert("Atenção", "Preencha título, prazo e responsável.");
    }

    try {
      await operacionalService.criarTarefa({
        titulo,
        prazo,
        prioridade,
        responsaveisIds: [respSelecionado]
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar tarefa.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Título</Text>
      <TextInput style={styles.input} value={titulo} onChangeText={setTitulo} placeholder="Ex: Comprar itens de limpeza" />

      <Text style={styles.label}>Prazo (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={prazo} onChangeText={setPrazo} placeholder="2025-12-01" keyboardType="numeric" />

      <Text style={styles.label}>Prioridade</Text>
      <View style={styles.row}>
        {(['BAIXA', 'MEDIA', 'ALTA'] as Prioridade[]).map(p => (
          <TouchableOpacity 
            key={p} 
            onPress={() => setPrioridade(p)}
            style={[styles.btnOption, prioridade === p && styles.btnOptionSel]}
          >
            <Text style={[styles.txtOption, prioridade === p && styles.txtOptionSel]}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Responsável</Text>
      <View style={styles.wrap}>
        {moradores.map(m => (
          <TouchableOpacity 
            key={m.id} 
            onPress={() => setRespSelecionado(m.id)}
            style={[styles.chip, respSelecionado === m.id && styles.chipSel]}
          >
            <Text style={respSelecionado === m.id ? styles.txtOptionSel : styles.txtOption}>
              {m.nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.btnSalvar} onPress={handleSalvar}>
        <Text style={styles.txtSalvar}>CRIAR TAREFA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FFF' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 12, fontSize: 16 },
  row: { flexDirection: 'row' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  btnOption: { flex: 1, padding: 10, borderWidth: 1, borderColor: '#DDD', alignItems: 'center', margin: 2, borderRadius: 6 },
  btnOptionSel: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  txtOption: { color: '#333' },
  txtOptionSel: { color: '#FFF', fontWeight: 'bold' },
  chip: { padding: 10, borderWidth: 1, borderColor: '#DDD', borderRadius: 20, marginRight: 8, marginBottom: 8 },
  chipSel: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  btnSalvar: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 30 },
  txtSalvar: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});