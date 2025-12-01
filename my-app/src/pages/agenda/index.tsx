import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  Modal
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { themas } from "../../global/themes";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { getProximosEventos, getEventosPorMes, responderPresenca, excluirEvento } from "../../services/agendaService";
import { EventoDTO, StatusPresenca } from "../../types/agenda.types";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export default function Agenda() {
  const navigation = useNavigation();
  const [dataAtual, setDataAtual] = useState(new Date());

  const [proximosEventos, setProximosEventos] = useState<EventoDTO[]>([]);
  const [eventosMes, setEventosMes] = useState<EventoDTO[]>([]);
  const [diasComEventos, setDiasComEventos] = useState<{ [key: number]: number }>({});

  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"OPTIONS" | "CONFIRM_DELETE">("OPTIONS");
  const [eventoSelecionado, setEventoSelecionado] = useState<EventoDTO | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      carregarTudo();
    }, [dataAtual])
  );

  const carregarTudo = async () => {
    try {
      const repId = await AsyncStorage.getItem("@repId");
      if (!repId) return;

      const proximos = await getProximosEventos(Number(repId));
      setProximosEventos(proximos);

      const mesJava = dataAtual.getMonth() + 1;
      const eventosDoMes = await getEventosPorMes(Number(repId), dataAtual.getFullYear(), mesJava);
      setEventosMes(eventosDoMes);

      const mapaDias: { [key: number]: number } = {};
      eventosDoMes.forEach(e => {
        const dia = new Date(e.dataHora).getDate();
        mapaDias[dia] = (mapaDias[dia] || 0) + 1;
      });
      setDiasComEventos(mapaDias);

    } catch (error) {
      console.error("Erro ao carregar agenda", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventoPress = (evento: EventoDTO) => {
    setEventoSelecionado(evento);
    setModalMode("OPTIONS");
    setErrorMessage(null);
    setModalVisible(true);
  };

  const irParaEdicao = () => {
    setModalVisible(false);
    (navigation as any).navigate("CriarEvento", { evento: eventoSelecionado });
  };

  const confirmarExclusao = async () => {
    if (!eventoSelecionado) return;
    try {
      setActionLoading(true);
      const repId = await AsyncStorage.getItem("@repId");
      if (repId) {
        await excluirEvento(Number(repId), eventoSelecionado.id);
        setModalVisible(false);
        carregarTudo();
      }
    } catch (e) {
      setErrorMessage("Erro ao excluir. Apenas o criador pode apagar o evento.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResponder = async (eventoId: number, status: StatusPresenca) => {
    try {
      setProximosEventos(prev => prev.map(e =>
        e.id === eventoId ? { ...e, meuStatus: status } : e
      ));
      const repId = await AsyncStorage.getItem("@repId");
      if (repId) {
        await responderPresenca(Number(repId), eventoId, status);
        carregarTudo();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // --- UTILS ---
  const getDiasDoMes = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaSemanaInicio = primeiroDia.getDay();
    const dias: (number | null)[] = [];
    for (let i = 0; i < diaSemanaInicio; i++) { dias.push(null); }
    for (let dia = 1; dia <= diasNoMes; dia++) { dias.push(dia); }
    return dias;
  };

  const mudarMes = (direcao: number) => {
    const novaData = new Date(dataAtual);
    novaData.setMonth(dataAtual.getMonth() + direcao);
    setDataAtual(novaData);
    setLoading(true);
  };

  const formatarData = (isoDate: string) => {
    const data = new Date(isoDate);
    const hoje = new Date();
    const d1 = new Date(data.getFullYear(), data.getMonth(), data.getDate());
    const d2 = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

    if (d1.getTime() === d2.getTime()) return "Hoje";
    d2.setDate(d2.getDate() + 1);
    if (d1.getTime() === d2.getTime()) return "Amanhã";
    return `${data.getDate()} ${MESES[data.getMonth()].substring(0, 3)}`;
  };

  const getHora = (isoDate: string) => {
    const data = new Date(isoDate);
    return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const diaHoje = new Date().getDate();
  const mesHoje = new Date().getMonth();
  const anoHoje = new Date().getFullYear();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agenda Compartilhada</Text>
        </View>

        {/* Informações do mês */}
        <View style={styles.monthInfo}>
          <View>
            <Text style={styles.monthTitle}>
              {MESES[dataAtual.getMonth()]} {dataAtual.getFullYear()}
            </Text>
            <Text style={styles.eventCount}>
              {eventosMes.length} evento{eventosMes.length !== 1 ? "s" : ""} este mês
            </Text>
          </View>
          <View style={styles.monthNavigation}>
            <TouchableOpacity style={styles.navButton} onPress={() => mudarMes(-1)}>
              <Ionicons name="chevron-back" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => mudarMes(1)}>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendário */}
        <View style={styles.calendar}>
          <View style={styles.weekDays}>
            {DIAS_SEMANA.map((dia, index) => (
              <Text key={index} style={styles.weekDayText}>{dia}</Text>
            ))}
          </View>

          <View style={styles.daysGrid}>
            {getDiasDoMes().map((dia, index) => {
              const isHoje = dia === diaHoje && dataAtual.getMonth() === mesHoje && dataAtual.getFullYear() === anoHoje;
              const temEventos = dia && diasComEventos[dia] && diasComEventos[dia] > 0;

              return (
                <View key={index} style={[styles.dayCell, !dia && styles.dayEmpty]}>
                  {dia && (
                    <>
                      <View style={[isHoje && styles.dayTodayCircle]}>
                        <Text style={[styles.dayText, isHoje && styles.dayTodayText]}>
                          {dia}
                        </Text>
                      </View>
                      {temEventos && <View style={styles.eventDot} />}
                    </>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Próximos Eventos */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Próximos Eventos</Text>

          {loading ? (
            <ActivityIndicator size="large" color={themas.colors.primary} />
          ) : proximosEventos.length === 0 ? (
            <Text style={{ color: '#999', textAlign: 'center', marginTop: 10 }}>Nenhum evento próximo.</Text>
          ) : (
            proximosEventos.map((evento) => (
              <TouchableOpacity
                key={evento.id}
                onPress={() => handleEventoPress(evento)}
                activeOpacity={0.7}
              >
                <View style={styles.eventCard}>
                  <View style={styles.eventContent}>
                    <View style={styles.eventIcon}>
                      <Text style={styles.eventIconText}>📅</Text>
                    </View>

                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>{evento.titulo}</Text>
                      <Text style={styles.eventDetails}>
                        {getHora(evento.dataHora)} - {evento.local}
                      </Text>
                      <Text style={styles.participantsText}>
                        {evento.totalConfirmados} confirmado(s)
                      </Text>
                      <Text style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
                        Criado por: {evento.criadorNome}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.eventRight}>
                    <Text style={styles.eventDate}>{formatarData(evento.dataHora)}</Text>

                    {evento.meuStatus === "CONFIRMADO" && (
                      <View style={styles.statusConfirmado}>
                        <Text style={styles.statusConfirmadoText}>Confirmado</Text>
                      </View>
                    )}

                    {evento.meuStatus === "PENDENTE" && (
                      <TouchableOpacity
                        style={styles.statusResponder}
                        onPress={() => handleResponder(evento.id, "CONFIRMADO")}
                      >
                        <Text style={styles.statusResponderText}>Confirmar</Text>
                      </TouchableOpacity>
                    )}

                    {evento.meuStatus === "RECUSADO" && (
                      <Text style={{ color: '#F44336', fontSize: 12, fontWeight: 'bold' }}>Recusado</Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CriarEvento" as never)}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={modalStyles.centeredView}>
          <View style={modalStyles.modalView}>

            <Text style={modalStyles.modalTitle}>
              {modalMode === "OPTIONS" ? eventoSelecionado?.titulo : "Excluir Evento?"}
            </Text>

            {errorMessage && <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10 }}>{errorMessage}</Text>}

            {actionLoading ? (
              <ActivityIndicator size="large" color="#2D6CF6" style={{ marginVertical: 20 }} />
            ) : (
              <>

                {modalMode === "OPTIONS" && (
                  <>
                    <TouchableOpacity style={[modalStyles.button, { backgroundColor: '#2D6CF6' }]} onPress={irParaEdicao}>
                      <Feather name="edit" size={20} color="#FFF" />
                      <Text style={modalStyles.textStyle}>Editar Evento</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', gap: 10, marginVertical: 5 }}>
                      <TouchableOpacity
                        style={[modalStyles.button, { flex: 1, backgroundColor: '#4CAF50', padding: 10 }]}
                        onPress={() => { handleResponder(eventoSelecionado!.id, "CONFIRMADO"); setModalVisible(false); }}
                      >
                        <Text style={modalStyles.textStyle}>Confirmar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[modalStyles.button, { flex: 1, backgroundColor: '#FF9800', padding: 10 }]}
                        onPress={() => { handleResponder(eventoSelecionado!.id, "RECUSADO"); setModalVisible(false); }}
                      >
                        <Text style={modalStyles.textStyle}>Recusar</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={[modalStyles.button, { backgroundColor: '#FF5252' }]} onPress={() => setModalMode("CONFIRM_DELETE")}>
                      <Feather name="trash-2" size={20} color="#FFF" />
                      <Text style={modalStyles.textStyle}>Excluir Evento</Text>
                    </TouchableOpacity>
                  </>
                )}

                {modalMode === "CONFIRM_DELETE" && (
                  <>
                    <Text style={modalStyles.modalSubtitle}>Tem certeza? Essa ação não pode ser desfeita.</Text>
                    <TouchableOpacity style={[modalStyles.button, { backgroundColor: '#FF5252' }]} onPress={confirmarExclusao}>
                      <Text style={modalStyles.textStyle}>Sim, Excluir</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[modalStyles.button, { backgroundColor: '#CCC' }]} onPress={() => setModalMode("OPTIONS")}>
                      <Text style={modalStyles.textStyle}>Voltar</Text>
                    </TouchableOpacity>
                  </>
                )}

                {modalMode === "OPTIONS" && (
                  <TouchableOpacity style={[modalStyles.button, { backgroundColor: '#EEE' }]} onPress={() => setModalVisible(false)}>
                    <Text style={[modalStyles.textStyle, { color: '#333' }]}>Fechar</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { flexDirection: "row", alignItems: "center", padding: 16, paddingTop: 20 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: "600", marginLeft: 8, color: "#000" },
  monthInfo: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 24, paddingBottom: 16 },
  monthTitle: { fontSize: 20, fontWeight: "700", color: "#000" },
  eventCount: { fontSize: 14, color: "#999", marginTop: 4 },
  monthNavigation: { flexDirection: "row", gap: 8 },
  navButton: { padding: 8 },
  calendar: { paddingHorizontal: 16, marginBottom: 24 },
  weekDays: { flexDirection: "row", justifyContent: "space-around", marginBottom: 12 },
  weekDayText: { fontSize: 12, fontWeight: "600", color: "#999", width: 40, textAlign: "center" },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: { width: "14.28%", aspectRatio: 1, justifyContent: "center", alignItems: "center", position: "relative" },
  dayEmpty: { opacity: 0 },
  dayTodayCircle: { backgroundColor: themas.colors.primary, borderRadius: 50, width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  dayText: { fontSize: 14, color: "#333", fontWeight: "500", zIndex: 2 },
  dayTodayText: { color: "#FFF", fontWeight: "700" },
  eventDot: { position: "absolute", bottom: -2, width: 6, height: 6, borderRadius: 100, backgroundColor: "#FFD700", alignSelf: "center", zIndex: 1 },
  upcomingSection: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#000", marginBottom: 16 },
  eventCard: { flexDirection: "row", justifyContent: "space-between", padding: 16, backgroundColor: "#F8F9FA", borderRadius: 12, marginBottom: 12 },
  eventContent: { flexDirection: "row", flex: 1 },
  eventIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: "#E8F5E9", justifyContent: "center", alignItems: "center", marginRight: 12 },
  eventIconText: { fontSize: 24 },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 4 },
  eventDetails: { fontSize: 14, color: "#666", marginBottom: 8 },
  participantsText: { fontSize: 12, color: "#666", fontWeight: "600" },
  eventRight: { alignItems: "flex-end", justifyContent: "space-between" },
  eventDate: { fontSize: 12, color: "#999", marginBottom: 8 },
  statusConfirmado: { backgroundColor: "#4CAF50", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  statusConfirmadoText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  statusResponder: { backgroundColor: "#FFF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: themas.colors.primary },
  statusResponderText: { color: themas.colors.primary, fontSize: 12, fontWeight: "600" },
  fab: { position: "absolute", bottom: 25, right: 25, backgroundColor: themas.colors.primary, width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 4 },
});

const modalStyles = StyleSheet.create({
  centeredView: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalView: { width: '85%', maxWidth: 400, backgroundColor: "white", borderRadius: 20, padding: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#333" },
  modalSubtitle: { fontSize: 14, color: "#666", marginBottom: 20, textAlign: "center" },
  button: { borderRadius: 12, padding: 15, marginBottom: 10, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 },
  textStyle: { color: "white", fontWeight: "bold", fontSize: 16 },
  textStyleClose: { color: "#333", fontWeight: "bold", fontSize: 16 }
});