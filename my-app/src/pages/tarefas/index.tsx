import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StyleSheet
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import TabsFiltro from "../../components/tarefas/TabsFiltro";
import TarefaCard from "../../components/tarefas/TarefaCard";
import { getTarefas, concluirTarefa, excluirTarefa } from "../../services/tarefaService";
import { TarefaDTO } from "../../types/tarefas.types";

import styles from "./styles";

export default function Tarefas() {
  const navigation = useNavigation();
  const [filtro, setFiltro] = useState("Todas");
  const [tarefas, setTarefas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"OPTIONS" | "CONFIRM_DELETE">("OPTIONS");
  const [tarefaSelecionada, setTarefaSelecionada] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("@usuario").then(json => {
        if (json) {
          const user = JSON.parse(json);
          setUserId(user.id);
        }
      });
      carregarTarefas();
    }, [])
  );

  const carregarTarefas = async () => {
    try {
      setLoading(true);
      const repId = await AsyncStorage.getItem("@repId");
      if (!repId) return;

      const dadosBackend = await getTarefas(Number(repId));

      const tarefasFormatadas = dadosBackend.map((t: TarefaDTO) => ({
        id: t.id,
        titulo: t.titulo,
        descricao: t.descricao || "Sem descrição",
        usuario: {
          nome: t.responsavelNome || "Não atribuída",
          foto: t.responsavelFoto || null,
          id: t.responsavelId
        },
        status: t.status,
        prioridade: t.prioridade,
        quando: new Date(t.dataPrazo).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        concluida: t.status === 'CONCLUIDA'
      }));

      setTarefas(tarefasFormatadas);
    } catch (error) {
      console.error("Erro ao carregar tarefas", error);
    } finally {
      setLoading(false);
    }
  };

  const abrirOpcoes = (tarefa: any) => {
    setTarefaSelecionada(tarefa);
    setModalMode("OPTIONS");
    setStatusMessage(null);
    setModalVisible(true);
  };

  const handleConcluir = async () => {
    if (!tarefaSelecionada) return;
    try {
      setActionLoading(true);
      const repId = await AsyncStorage.getItem("@repId");
      if (!repId) return;

      await concluirTarefa(Number(repId), tarefaSelecionada.id);

      setModalVisible(false);
      carregarTarefas();
    } catch (error) {
      setStatusMessage({ type: 'error', text: "Falha ao atualizar tarefa" });
    } finally {
      setActionLoading(false);
    }
  };

  const solicitarExclusao = () => {
    setModalMode("CONFIRM_DELETE");
  };

  const confirmarExclusao = async () => {
    if (!tarefaSelecionada) return;
    try {
      setActionLoading(true);
      const repId = await AsyncStorage.getItem("@repId");
      if (!repId) return;

      await excluirTarefa(Number(repId), tarefaSelecionada.id);

      setModalVisible(false);
      carregarTarefas();
    } catch (error) {
      setStatusMessage({ type: 'error', text: "Não foi possível excluir. Verifique o backend." });
    } finally {
      setActionLoading(false);
    }
  };

  const tarefasFiltradas =
    filtro === "Todas"
      ? tarefas
      : tarefas.filter((t) =>
        filtro === "Pendentes"
          ? !t.concluida
          : filtro === "Concluídas"
            ? t.concluida
            : filtro === "Minhas"
              ? t.usuario.id === userId
              : true
      );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      <View style={styles.header}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>Tarefas</Text>
        <TouchableOpacity onPress={() => navigation.navigate("CriarTarefa" as never)}>
          <MaterialIcons name="add" size={26} color="#FFF" style={styles.addBtn} />
        </TouchableOpacity>
      </View>

      <TabsFiltro filtro={filtro} setFiltro={setFiltro} />

      {loading ? (
        <ActivityIndicator size="large" color="#2D6CF6" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
        >
          {tarefasFiltradas.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#999', marginTop: 20 }}>
              Nenhuma tarefa encontrada.
            </Text>
          ) : (
            tarefasFiltradas.map((tarefa, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => abrirOpcoes(tarefa)}
                activeOpacity={0.7}
              >
                <TarefaCard data={tarefa} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>

            {/* Título Dinámico */}
            <Text style={modalStyles.modalTitle}>
              {modalMode === "OPTIONS" ? tarefaSelecionada?.titulo : "Tem certeza?"}
            </Text>

            {statusMessage && (
              <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
                {statusMessage.text}
              </Text>
            )}

            {actionLoading ? (
              <ActivityIndicator size="large" color="#2D6CF6" style={{ marginVertical: 20 }} />
            ) : (
              <>
                {modalMode === "OPTIONS" && (
                  <>
                    <Text style={modalStyles.modalSubtitle}>Selecione uma ação:</Text>

                    <TouchableOpacity
                      style={[modalStyles.button, modalStyles.buttonComplete]}
                      onPress={handleConcluir}
                    >
                      <Feather name={tarefaSelecionada?.concluida ? "rotate-ccw" : "check-circle"} size={20} color="#FFF" />
                      <Text style={modalStyles.textStyle}>
                        {tarefaSelecionada?.concluida ? "Reabrir Tarefa" : "Concluir Tarefa"}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[modalStyles.button, modalStyles.buttonDelete]}
                      onPress={solicitarExclusao}
                    >
                      <Feather name="trash-2" size={20} color="#FFF" />
                      <Text style={modalStyles.textStyle}>Excluir Tarefa</Text>
                    </TouchableOpacity>
                  </>
                )}
                {modalMode === "CONFIRM_DELETE" && (
                  <>
                    <Text style={modalStyles.modalSubtitle}>
                      Essa ação não pode ser desfeita. Deseja realmente excluir?
                    </Text>

                    <TouchableOpacity
                      style={[modalStyles.button, modalStyles.buttonDelete]}
                      onPress={confirmarExclusao}
                    >
                      <Feather name="trash-2" size={20} color="#FFF" />
                      <Text style={modalStyles.textStyle}>Sim, Excluir</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[modalStyles.button, { backgroundColor: '#ccc' }]}
                      onPress={() => setModalMode("OPTIONS")}
                    >
                      <Text style={modalStyles.textStyle}>Voltar</Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* Botão Cancelar*/}
                {modalMode === "OPTIONS" && (
                  <TouchableOpacity
                    style={[modalStyles.button, modalStyles.buttonClose]}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={modalStyles.textStyleClose}>Cancelar</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: '85%',
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonComplete: {
    backgroundColor: "#4CAF50",
  },
  buttonDelete: {
    backgroundColor: "#FF5252",
  },
  buttonClose: {
    backgroundColor: "#F5F5F5",
    marginTop: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  textStyleClose: {
    color: "#333",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  }
});