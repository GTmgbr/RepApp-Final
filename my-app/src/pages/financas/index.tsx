import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { style } from "./styles";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MoradorSaldoCard from "../../components/MoradorSaldoCard";
import DespesaCard from "../../components/DespesaCard";
import { getResumoFinanceiro } from "../../services/financeiroService";
import { FinanceiroResumoDTO } from "../../types/financeiro.types";

export default function Financas() {
  const navigation = useNavigation();

  // Estados
  const [resumo, setResumo] = useState<FinanceiroResumoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Função para carregar dados financeiros
  const loadFinanceiroData = async () => {
    try {
      const repId = await AsyncStorage.getItem("repId");

      if (!repId) {
        console.error("RepId não encontrado no AsyncStorage");
        return;
      }

      const data = await getResumoFinanceiro(Number(repId));
      setResumo(data);
    } catch (error) {
      console.error("Erro ao carregar dados financeiros:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar dados ao montar componente
  useEffect(() => {
    loadFinanceiroData();
  }, []);

  // Função de refresh
  const onRefresh = () => {
    setRefreshing(true);
    loadFinanceiroData();
  };

  // Função para formatar data (yyyy-MM-dd -> dd/MM/yyyy)
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  // Mostrar loading enquanto carrega
  if (loading) {
    return (
      <View style={[style.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#2D6CF6" />
        <Text style={{ marginTop: 10, color: "#666" }}>Carregando dados financeiros...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={style.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={style.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={style.headerTitle}>Módulo Financeiro</Text>
        <Feather name="more-vertical" size={22} color="#000" />
      </View>

      {/* Saldo dos Moradores */}
      <Text style={style.sectionTitle}>Saldo dos Moradores</Text>

      <View style={style.card}>
        {resumo?.saldos && resumo.saldos.length > 0 ? (
          resumo.saldos.map((morador, index) => (
            <MoradorSaldoCard
              key={index}
              nome={morador.nome}
              valor={morador.valor}
              tipo={morador.valor >= 0 ? "receber" : "pagar"}
              foto={morador.fotoUrl || "https://via.placeholder.com/50"}
            />
          ))
        ) : (
          <Text style={{ textAlign: "center", color: "#666", padding: 20 }}>
            Nenhum saldo registrado
          </Text>
        )}
      </View>

      {/* Botão adicionar */}
      <TouchableOpacity
        style={style.addButton}
        onPress={() => navigation.navigate("AdicionarDespesa" as never)}
      >
        <MaterialIcons name="add" size={22} color="#FFF" />
        <Text style={style.addButtonText}>Adicionar Despesa</Text>
      </TouchableOpacity>

      {/* Despesas Recentes */}
      <Text style={style.sectionTitle}>Despesas Recentes</Text>

      {resumo?.despesasRecentes && resumo.despesasRecentes.length > 0 ? (
        resumo.despesasRecentes.map((despesa, index) => (
          <DespesaCard
            key={index}
            titulo={despesa.descricao}
            valor={despesa.valorTotal}
            pagoPor={despesa.pagadorNome}
            data={formatDate(despesa.data)}
            porPessoa={despesa.valorPorPessoa}
            arquivo="Comprovante disponível"
            divisao={[]}
          />
        ))
      ) : (
        <Text style={{ textAlign: "center", color: "#666", padding: 20 }}>
          Nenhuma despesa recente
        </Text>
      )}
    </ScrollView>
  );
}
