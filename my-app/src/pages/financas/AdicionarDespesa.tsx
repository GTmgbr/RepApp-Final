import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adicionarDespesa } from "../../services/financeiroService";
import { DespesaRequestDTO } from "../../types/financeiro.types";
import { styles } from "./AdicionarDespesaStyles";

export default function AdicionarDespesa() {
  const navigation = useNavigation();

  // Estados do formulário
  const [descricao, setDescricao] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [data, setData] = useState("");
  const [comprovante, setComprovante] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para formatar a data (dd/MM/yyyy -> yyyy-MM-dd)
  const formatDateToBackend = (dateStr: string): string => {
    // Se já está no formato yyyy-MM-dd, retorna
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;

    // Converte dd/MM/yyyy para yyyy-MM-dd
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  // Validar campos
  const validarCampos = (): boolean => {
    if (!descricao.trim()) {
      Alert.alert("Erro", "Por favor, preencha a descrição da despesa");
      return false;
    }

    if (!valorTotal || isNaN(Number(valorTotal))) {
      Alert.alert("Erro", "Por favor, insira um valor válido");
      return false;
    }

    if (!data.trim()) {
      Alert.alert("Erro", "Por favor, preencha a data da despesa");
      return false;
    }

    // Validar formato de data (aceita dd/MM/yyyy ou yyyy-MM-dd)
    const dateRegex = /^(\d{2}\/\d{2}\/\d{4})|(\d{4}-\d{2}-\d{2})$/;
    if (!dateRegex.test(data)) {
      Alert.alert("Erro", "Data inválida. Use o formato dd/MM/yyyy ou yyyy-MM-dd");
      return false;
    }

    return true;
  };

  // Função para enviar despesa
  const handleSubmit = async () => {
    if (!validarCampos()) return;

    setLoading(true);

    try {
      const repId = await AsyncStorage.getItem("repId");

      if (!repId) {
        Alert.alert("Erro", "RepId não encontrado. Faça login novamente.");
        return;
      }

      const despesa: DespesaRequestDTO = {
        descricao: descricao.trim(),
        valorTotal: Number(valorTotal),
        data: formatDateToBackend(data.trim()),
        comprovante: comprovante.trim() || undefined,
        envolvidos: [], // Array vazio = dividir entre TODOS
      };

      await adicionarDespesa(Number(repId), despesa);

      Alert.alert("Sucesso", "Despesa adicionada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      console.error("Erro ao adicionar despesa:", error);
      Alert.alert(
        "Erro",
        error.response?.data?.message || "Erro ao adicionar despesa. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Adicionar Despesa</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Descrição */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Conta de luz, Supermercado..."
            value={descricao}
            onChangeText={setDescricao}
            maxLength={100}
          />
        </View>

        {/* Valor Total */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valor Total (R$) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 150.50"
            value={valorTotal}
            onChangeText={setValorTotal}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Data */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data *</Text>
          <TextInput
            style={styles.input}
            placeholder="dd/MM/yyyy ou yyyy-MM-dd"
            value={data}
            onChangeText={setData}
            maxLength={10}
          />
          <Text style={styles.hint}>Formato: 25/11/2025 ou 2025-11-25</Text>
        </View>

        {/* Comprovante (opcional) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Comprovante (URL) - Opcional</Text>
          <TextInput
            style={styles.input}
            placeholder="https://link-para-comprovante.com/imagem.jpg"
            value={comprovante}
            onChangeText={setComprovante}
          />
        </View>

        {/* Info sobre divisão */}
        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color="#2D6CF6" />
          <Text style={styles.infoText}>
            A despesa será dividida automaticamente entre todos os moradores da república.
          </Text>
        </View>

        {/* Botão de Enviar */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <MaterialIcons name="add" size={22} color="#FFF" />
              <Text style={styles.submitButtonText}>Adicionar Despesa</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
