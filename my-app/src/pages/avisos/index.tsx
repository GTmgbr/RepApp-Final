import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
  RefreshControl,
  Modal,
  StyleSheet
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getAvisos, toggleStatusAviso, excluirAviso } from "../../services/avisoService";
import { AvisoDTO } from "../../types/avisos.types";
import styles from "./styles";

export default function Mural() {
  const navigation = useNavigation();

  const [avisos, setAvisos] = useState<AvisoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Todos");

  // Estados Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"OPTIONS" | "CONFIRM_DELETE">("OPTIONS");
  const [avisoSelecionado, setAvisoSelecionado] = useState<AvisoDTO | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const filters = ["Todos", "Importantes", "Financeiro", "Geral", "Eventos", "Manutenção"];

  useFocusEffect(
    useCallback(() => {
      carregarAvisos();
    }, [])
  );

  const carregarAvisos = async () => {
    try {
      const repId = await AsyncStorage.getItem("@repId");
      if (!repId) return;
      const data = await getAvisos(Number(repId));
      setAvisos(data);
    } catch (error) {
      console.error("Erro ao carregar avisos", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarAvisos();
  };

  // --- LÓGICA MODAL ---
  const abrirOpcoes = (aviso: AvisoDTO) => {
    setAvisoSelecionado(aviso);
    setModalMode("OPTIONS");
    setStatusMessage(null);
    setModalVisible(true);
  };

  const handleToggleStatus = async () => {
    if (!avisoSelecionado) return;
    try {
      setActionLoading(true);
      const repId = await AsyncStorage.getItem("@repId");
      if (!repId) return;

      await toggleStatusAviso(Number(repId), avisoSelecionado.id);
      setModalVisible(false);
      carregarAvisos();
    } catch (error) {
      setStatusMessage({ type: 'error', text: "Erro ao atualizar status." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleExcluir = async () => {
    if (!avisoSelecionado) return;
    try {
      setActionLoading(true);
      const repId = await AsyncStorage.getItem("@repId");
      if (!repId) return;

      await excluirAviso(Number(repId), avisoSelecionado.id);
      setModalVisible(false);
      carregarAvisos();
    } catch (error) {
      setStatusMessage({ type: 'error', text: "Erro ao excluir. Tente novamente." });
    } finally {
      setActionLoading(false);
    }
  };

  // --- UTILS ---
  const formatTimeAgo = (isoDate: string) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return "Agora mesmo";
    if (diffInSeconds < 3600) return `Há ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Há ${Math.floor(diffInSeconds / 3600)} h`;
    const days = Math.floor(diffInSeconds / 86400);
    if (days === 1) return "Ontem";
    return `Há ${days} dias`;
  };

  const getFilteredAvisos = () => {
    if (selectedFilter === "Todos") return avisos;
    return avisos.filter((aviso) => {
      switch (selectedFilter) {
        case "Importantes": return aviso.urgencia === "ALTA";
        case "Financeiro": return aviso.categoria === "FINANCEIRO";
        case "Geral": return aviso.categoria === "GERAL";
        case "Eventos": return aviso.categoria === "EVENTO";
        case "Manutenção": return aviso.categoria === "MANUTENCAO";
        default: return true;
      }
    });
  };

  const handleShare = async (title: string, text: string) => {
    try {
      await Share.share({ message: `*${title}*\n\n${text}\n\n_Enviado via RepApp_` });
    } catch (error) { console.log(error); }
  };

  const listaFiltrada = getFilteredAvisos();

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mural de Avisos</Text>
        {/* Usamos el ícono del diseño original */}
        <Feather name="more-vertical" size={22} color="#000" />
      </View>

      {/* FILTROS */}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }} style={styles.filterScroll}>
          {filters.map((f) => (
            <TouchableOpacity key={f} style={[styles.filterButton, selectedFilter === f && styles.filterSelected]} onPress={() => setSelectedFilter(f)}>
              <Text style={[styles.filterText, selectedFilter === f && styles.filterTextSelected]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LISTA DE AVISOS */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {listaFiltrada.length === 0 ? (
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>Nenhum aviso encontrado.</Text>
        ) : (
          listaFiltrada.map((a) => {
            const isUrgent = a.urgencia === "ALTA";
            const isResolved = !a.ativo;

            return (
              <TouchableOpacity
                key={a.id}
                activeOpacity={0.8}
                onPress={() => abrirOpcoes(a)}
              >
                <View style={[styles.card, isUrgent && styles.cardWarning, isResolved && { opacity: 0.6, backgroundColor: '#F0F0F0' }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={[styles.cardTitle, isUrgent && { color: "#B30000" }, isResolved && { textDecorationLine: 'line-through' }]}>
                      {a.titulo}
                    </Text>
                    {isResolved && <Feather name="check-circle" size={18} color="green" />}
                  </View>

                  <Text style={styles.cardText}>{a.descricao}</Text>
                  {a.valor && Number(a.valor) > 0 && <Text style={{ color: '#4CAF50', fontWeight: 'bold', marginBottom: 10 }}>R$ {Number(a.valor).toFixed(2)}</Text>}

                  <View style={styles.cardFooter}>
                    <View style={[styles.tag, isUrgent && { backgroundColor: '#FFEBEE' }]}>
                      <Text style={[styles.tagText, isUrgent && { color: '#D32F2F' }]}>{a.categoria}</Text>
                    </View>
                    <Text style={styles.timeText}>{formatTimeAgo(a.dataCriacao)}</Text>
                    <View style={styles.actionRow}>
                      <TouchableOpacity onPress={() => handleShare(a.titulo, a.descricao)}>
                        <Feather name="share-2" size={20} color="#444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text style={{ fontSize: 10, color: '#AAA', marginTop: 8, textAlign: 'right' }}>Por: {a.autorNome}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CriarAviso" as never)}
      >
        <Feather name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* --- MODAL UNIFICADO --- */}
      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>
            <Text style={modalStyles.modalTitle}>{modalMode === "OPTIONS" ? avisoSelecionado?.titulo : "Tem certeza?"}</Text>

            {statusMessage && <Text style={{ color: statusMessage.type === 'error' ? 'red' : 'green', textAlign: 'center', marginBottom: 10 }}>{statusMessage.text}</Text>}

            {actionLoading ? <ActivityIndicator size="large" color="#1A73E8" /> : (
              <>
                {modalMode === "OPTIONS" && (
                  <>
                    <TouchableOpacity style={[modalStyles.button, modalStyles.buttonComplete]} onPress={handleToggleStatus}>
                      <Feather name={avisoSelecionado?.ativo ? "check-square" : "rotate-ccw"} size={20} color="#FFF" />
                      <Text style={modalStyles.textStyle}>{avisoSelecionado?.ativo ? "Marcar como Resolvido" : "Reativar Aviso"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[modalStyles.button, modalStyles.buttonDelete]} onPress={() => setModalMode("CONFIRM_DELETE")}>
                      <Feather name="trash-2" size={20} color="#FFF" />
                      <Text style={modalStyles.textStyle}>Excluir</Text>
                    </TouchableOpacity>
                  </>
                )}

                {modalMode === "CONFIRM_DELETE" && (
                  <>
                    <Text style={modalStyles.modalSubtitle}>Deseja realmente excluir este aviso?</Text>
                    <TouchableOpacity style={[modalStyles.button, modalStyles.buttonDelete]} onPress={handleExcluir}>
                      <Text style={modalStyles.textStyle}>Sim, Excluir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[modalStyles.button, { backgroundColor: '#ccc' }]} onPress={() => setModalMode("OPTIONS")}>
                      <Text style={modalStyles.textStyle}>Voltar</Text>
                    </TouchableOpacity>
                  </>
                )}

                {modalMode === "OPTIONS" && (
                  <TouchableOpacity style={[modalStyles.button, modalStyles.buttonClose]} onPress={() => setModalVisible(false)}>
                    <Text style={modalStyles.textStyleClose}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const modalStyles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalView: { width: '85%', maxWidth: 400, backgroundColor: "white", borderRadius: 20, padding: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#333" },
  modalSubtitle: { fontSize: 14, color: "#666", marginBottom: 20, textAlign: "center" },
  button: { borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  buttonComplete: { backgroundColor: "#4CAF50" },
  buttonDelete: { backgroundColor: "#FF5252" },
  buttonClose: { backgroundColor: "#F5F5F5", marginTop: 5 },
  textStyle: { color: "white", fontWeight: "bold", fontSize: 16 },
  textStyleClose: { color: "#333", fontWeight: "bold", fontSize: 16 }
});