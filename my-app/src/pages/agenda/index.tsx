import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { themas } from "../../global/themes";

// Tipos
interface Evento {
  id: number;
  titulo: string;
  data: Date;
  hora: string;
  local: string;
  tipo: "churrasco" | "aniversario" | "faxina" | "outros";
  participantes?: string[];
  status: "confirmado" | "pendente" | "responder";
  obrigatorio?: boolean;
}

// Dados mock - em produção virão da API
const EVENTOS_MOCK: Evento[] = [
  {
    id: 1,
    titulo: "Churrasco da Rep",
    data: new Date(2025, 11, 15),
    hora: "18:00",
    local: "Área da churrasqueira",
    tipo: "churrasco",
    participantes: ["A", "B", "C"],
    status: "confirmado",
  },
  {
    id: 2,
    titulo: "Aniversário da Maria",
    data: new Date(2025, 11, 25),
    hora: "20:00",
    local: "Sala de estar",
    tipo: "aniversario",
    participantes: ["M", "J"],
    status: "responder",
  },
  {
    id: 3,
    titulo: "Faxina Geral",
    data: new Date(2025, 11, 28),
    hora: "09:00",
    local: "Toda a casa",
    tipo: "faxina",
    status: "pendente",
    obrigatorio: true,
  },
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function Agenda() {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [eventos, setEventos] = useState<Evento[]>(EVENTOS_MOCK);
  const [diasComEventos, setDiasComEventos] = useState<{
    [key: string]: number;
  }>({});

  // Atualiza dados em tempo real
  useEffect(() => {
    // Aqui você pode adicionar um listener para atualizar os eventos em tempo real
    // Por exemplo, usando WebSocket ou polling
    const intervalo = setInterval(() => {
      // Simula atualização em tempo real
      // Em produção, isso seria substituído por chamadas à API
    }, 60000); // Atualiza a cada minuto

    return () => clearInterval(intervalo);
  }, []);

  // Calcula dias com eventos
  useEffect(() => {
    const diasEventos: { [key: string]: number } = {};
    eventos.forEach((evento) => {
      const dataEvento = new Date(evento.data);
      if (
        dataEvento.getMonth() === dataAtual.getMonth() &&
        dataEvento.getFullYear() === dataAtual.getFullYear()
      ) {
        const dia = dataEvento.getDate();
        diasEventos[dia] = (diasEventos[dia] || 0) + 1;
      }
    });
    setDiasComEventos(diasEventos);
  }, [eventos, dataAtual]);

  const getDiasDoMes = () => {
    const ano = dataAtual.getFullYear();
    const mes = dataAtual.getMonth();

    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);
    const diasNoMes = ultimoDia.getDate();
    const diaSemanaInicio = primeiroDia.getDay();

    const dias: (number | null)[] = [];

    // Adiciona espaços vazios para dias do mês anterior
    for (let i = 0; i < diaSemanaInicio; i++) {
      dias.push(null);
    }

    // Adiciona os dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
      dias.push(dia);
    }

    return dias;
  };

  const mudarMes = (direcao: number) => {
    const novaData = new Date(dataAtual);
    novaData.setMonth(dataAtual.getMonth() + direcao);
    setDataAtual(novaData);
  };

  const getEventosProximos = () => {
    const hoje = new Date();
    return eventos
      .filter((evento) => new Date(evento.data) >= hoje)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, 5);
  };

  const getIconeEvento = (tipo: string) => {
    switch (tipo) {
      case "churrasco":
        return "🍴";
      case "aniversario":
        return "🎂";
      case "faxina":
        return "🧹";
      default:
        return "📅";
    }
  };

  const formatarData = (data: Date) => {
    const hoje = new Date();
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    if (data.toDateString() === hoje.toDateString()) {
      return "Hoje";
    } else if (data.toDateString() === amanha.toDateString()) {
      return "Amanhã";
    } else {
      return `${data.getDate()} ${MESES[data.getMonth()].substring(0, 3)}`;
    }
  };

  const eventosDoMes = eventos.filter((evento) => {
    const dataEvento = new Date(evento.data);
    return (
      dataEvento.getMonth() === dataAtual.getMonth() &&
      dataEvento.getFullYear() === dataAtual.getFullYear()
    );
  }).length;

  const diaHoje = new Date().getDate();
  const mesHoje = new Date().getMonth();
  const anoHoje = new Date().getFullYear();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
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
              {eventosDoMes} evento{eventosDoMes !== 1 ? "s" : ""} este mês
            </Text>
          </View>
          <View style={styles.monthNavigation}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => mudarMes(-1)}
            >
              <Ionicons name="chevron-back" size={20} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => mudarMes(1)}
            >
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendário */}
        <View style={styles.calendar}>
          {/* Dias da semana */}
          <View style={styles.weekDays}>
            {DIAS_SEMANA.map((dia, index) => (
              <Text key={index} style={styles.weekDayText}>
                {dia}
              </Text>
            ))}
          </View>

          {/* Grid de dias */}
          <View style={styles.daysGrid}>
            {getDiasDoMes().map((dia, index) => {
              const isHoje =
                dia === diaHoje &&
                dataAtual.getMonth() === mesHoje &&
                dataAtual.getFullYear() === anoHoje;
              const temEventos = dia && diasComEventos[dia];

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    !dia && styles.dayEmpty,
                  ]}
                  disabled={!dia}
                >
                  {dia && (
                    <>
                      <View style={[isHoje && styles.dayTodayCircle]}>
                        <Text
                          style={[
                            styles.dayText,
                            isHoje && styles.dayTodayText,
                          ]}
                        >
                          {dia}
                        </Text>
                      </View>
                      {temEventos && (
                        <View style={styles.eventDot} />
                      )}
                    </>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Próximos Eventos */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Próximos Eventos</Text>

          {getEventosProximos().map((evento) => (
            <View key={evento.id} style={styles.eventCard}>
              {/* Ícone e informações */}
              <View style={styles.eventContent}>
                <View style={styles.eventIcon}>
                  <Text style={styles.eventIconText}>
                    {getIconeEvento(evento.tipo)}
                  </Text>
                </View>

                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>{evento.titulo}</Text>
                  <Text style={styles.eventDetails}>
                    {evento.hora} - {evento.local}
                  </Text>

                  {/* Participantes */}
                  {evento.participantes && (
                    <View style={styles.participantsRow}>
                      {evento.participantes.map((participante, idx) => (
                        <View key={idx} style={styles.avatarCircle}>
                          <Text style={styles.avatarText}>{participante}</Text>
                        </View>
                      ))}
                      {evento.participantes.length > 2 && (
                        <Text style={styles.moreParticipants}>
                          +{evento.participantes.length - 2}
                        </Text>
                      )}
                    </View>
                  )}

                  {/* Tags adicionais */}
                  {evento.obrigatorio && (
                    <View style={styles.tags}>
                      <View style={styles.tagObrigatorio}>
                        <Text style={styles.tagText}>Obrigatório</Text>
                      </View>
                    </View>
                  )}
                </View>
              </View>

              {/* Data e Status */}
              <View style={styles.eventRight}>
                <Text style={styles.eventDate}>
                  {formatarData(evento.data)}
                </Text>
                {evento.status === "confirmado" && (
                  <View style={styles.statusConfirmado}>
                    <Text style={styles.statusConfirmadoText}>Confirmado</Text>
                  </View>
                )}
                {evento.status === "responder" && (
                  <TouchableOpacity style={styles.statusResponder}>
                    <Text style={styles.statusResponderText}>Responder</Text>
                  </TouchableOpacity>
                )}
                {evento.status === "pendente" && (
                  <View style={styles.statusPendente}>
                    <Text style={styles.statusPendenteText}>Pendente</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Botões de ação */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.buttonPrimary}>
            <Ionicons name="add" size={20} color="#FFF" />
            <Text style={styles.buttonPrimaryText}>Novo Evento</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <Text style={styles.buttonSecondaryText}>Ver Calendário</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#000",
  },
  monthInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },
  eventCount: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  monthNavigation: {
    flexDirection: "row",
    gap: 8,
  },
  navButton: {
    padding: 8,
  },
  calendar: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 12,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
    width: 40,
    textAlign: "center",
  },
  daysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dayEmpty: {
    opacity: 0,
  },
  dayTodayCircle: {
    backgroundColor: themas.colors.primary,
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
    zIndex: 2,
  },
  dayTodayText: {
    color: "#FFF",
    fontWeight: "700",
  },
  eventDot: {
    position: "absolute",
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: "#FFD700",
    alignSelf: "center",
    zIndex: 1,
  },
  upcomingSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginBottom: 16,
  },
  eventCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    marginBottom: 12,
  },
  eventContent: {
    flexDirection: "row",
    flex: 1,
  },
  eventIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  eventIconText: {
    fontSize: 24,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  eventDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  participantsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  avatarCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  avatarText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#666",
  },
  moreParticipants: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  tags: {
    flexDirection: "row",
    marginTop: 8,
  },
  tagObrigatorio: {
    backgroundColor: "#FFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  tagText: {
    fontSize: 12,
    color: "#666",
  },
  eventRight: {
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  eventDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  statusConfirmado: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusConfirmadoText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  statusResponder: {
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: themas.colors.primary,
  },
  statusResponderText: {
    color: themas.colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  statusPendente: {
    backgroundColor: "#FFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  statusPendenteText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 80,
  },
  buttonPrimary: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: themas.colors.primary,
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonPrimaryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonSecondary: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  buttonSecondaryText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});
