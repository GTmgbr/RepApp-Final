import React, { useState, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { style } from "./styles";
import { themas } from "../../global/themes";
import { getDashboardStats, getAtividadesRecentes } from "../../services/dashboardService";
import { getTarefasDashboard } from "../../services/tarefaService";
import { DashboardStatsDTO, HistoricoResponseDTO } from "../../types/dashboard.types";
import { TarefaDTO } from "../../types/tarefas.types";

const { width } = Dimensions.get("window");

export default function Dashboard() {
  const navigation = useNavigation();

  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [atividades, setAtividades] = useState<HistoricoResponseDTO[]>([]);
  const [tarefasDashboard, setTarefasDashboard] = useState<TarefaDTO[]>([]);
  const [userName, setUserName] = useState("Morador");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const loadDashboardData = async () => {
    try {
      const repId = await AsyncStorage.getItem("@repId");
      const usuarioJson = await AsyncStorage.getItem("@usuario");

      if (usuarioJson) {
        const usuario = JSON.parse(usuarioJson);
        setUserName(usuario.nome || "Morador");
      }

      if (!repId) {
        console.error("RepId não encontrado");
        return;
      }

      const [statsData, atividadesData, tarefasData] = await Promise.all([
        getDashboardStats(Number(repId)),
        getAtividadesRecentes(Number(repId)),
        getTarefasDashboard(Number(repId))
      ]);

      setStats(statsData);
      setAtividades(atividadesData);
      setTarefasDashboard(tarefasData);

    } catch (error) {
      console.error("Erro ao carregar dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  if (loading) {
    return (
      <View style={[style.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={themas.colors.primary} />
        <Text style={{ marginTop: 10, color: themas.colors.gray }}>Carregando...</Text>
      </View>
    );
  }

  const formatCurrency = (value: number) => `R$${value.toFixed(2).replace(".", ",")}`;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENTE": return themas.colors.red;
      case "ALTA": return "#FF5252";
      case "MEDIA": return "#FFA500";
      case "BAIXA": return "#4CAF50";
      default: return themas.colors.gray;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "URGENTE": return "error";
      case "ALTA": return "warning";
      case "MEDIA": return "schedule";
      case "BAIXA": return "check-circle";
      default: return "info";
    }
  };

  const formatDate = (isoDate: string) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const getCurrentDate = () => {
    const date = new Date();
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  return (
    <View style={style.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* HEADER */}
        <View style={style.header}>
          <View style={style.headerTop}>
            <View style={style.logoContainer}>
              <View style={style.logoBox}>
                <MaterialIcons name="home" size={24} color={themas.colors.primary} />
              </View>
              <Text style={style.logoText}>RepApp</Text>
            </View>

            <View style={style.headerIcons}>
              <TouchableOpacity style={style.iconButton}>
                <MaterialIcons name="notifications" size={24} color="#000" />
              </TouchableOpacity>

              <TouchableOpacity
                style={style.profileButton}
                onPress={() => navigation.navigate("Settings" as never)}
              >
                <View style={style.profilePlaceholder}>
                  <MaterialIcons name="person" size={20} color="#FFF" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={style.greetingContainer}>
            <View>
              <Text style={style.greeting}>Olá, {userName}!</Text>
              <Text style={style.welcomeText}>Bem-vindo a sua república</Text>
            </View>
            <View style={style.dateContainer}>
              <Text style={style.dateLabel}>Hoje</Text>
              <Text style={style.dateValue}>{getCurrentDate()}</Text>
            </View>
          </View>
        </View>

        {/* SALDO */}
        <View style={style.balanceCard}>
          <View style={style.balanceHeader}>
            <Text style={style.balanceTitle}>Saldo da República</Text>
            <MaterialIcons name="account-balance-wallet" size={24} color="#FFF" />
          </View>
          <Text style={style.balanceAmount}>
            {formatCurrency(stats?.saldoAtual ?? 0)}
          </Text>

          <View style={style.balanceDetails}>
            <View style={style.balanceItem}>
              <MaterialIcons name="arrow-upward" size={16} color="#4CAF50" />
              <Text style={style.balanceReceived}>
                {formatCurrency(stats?.totalEntradasMes ?? 0)} recebidos
              </Text>
            </View>
            <View style={style.balanceItem}>
              <MaterialIcons name="arrow-downward" size={16} color="#FFCDD2" />
              <Text style={style.balanceSpent}>
                {formatCurrency(stats?.totalSaidasMes ?? 0)} gastos
              </Text>
            </View>
          </View>
        </View>

        {/* CARDS DE NAVEGAÇÃO */}
        <View style={style.navigationCards}>
          <TouchableOpacity style={style.navCard} onPress={() => navigation.navigate("Financas" as never)}>
            <MaterialIcons name="trending-up" size={32} color={themas.colors.primary} />
            <Text style={style.navCardText}>Finanças</Text>
          </TouchableOpacity>

          <TouchableOpacity style={style.navCard} onPress={() => navigation.navigate("Tarefas" as never)}>
            <MaterialIcons name="checklist" size={32} color="#4CAF50" />
            <Text style={style.navCardText}>Tarefas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={style.navCard} onPress={() => navigation.navigate("Agenda" as never)}>
            <MaterialIcons name="event" size={32} color="#FFA500" />
            <Text style={style.navCardText}>Agenda</Text>
          </TouchableOpacity>

          <TouchableOpacity style={style.navCard} onPress={() => navigation.navigate("Avisos" as never)}>
            <Ionicons name="megaphone" size={32} color="#9C27B0" />
            <Text style={style.navCardText}>Mural</Text>
          </TouchableOpacity>
        </View>

        {/* PRÓXIMAS TAREFAS*/}
        <View style={style.section}>
          <View style={style.sectionHeader}>
            <Text style={style.sectionTitle}>Próximas Tarefas</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Tarefas" as never)}>
              <Text style={style.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {tarefasDashboard.length > 0 ? (
            tarefasDashboard.map((task) => (
              <View key={task.id} style={style.taskCard}>
                <View style={style.taskLeft}>
                  <View style={[style.taskDot, { backgroundColor: getPriorityColor(task.prioridade) }]} />
                  <View style={style.taskInfo}>
                    <Text style={style.taskTitle}>{task.titulo}</Text>
                    <Text style={style.taskAssignee}>
                      {task.responsavelNome || "Sem responsável"} - {formatDate(task.dataPrazo)}
                    </Text>
                  </View>
                </View>

                <View style={[style.taskIconContainer, { borderColor: getPriorityColor(task.prioridade) }]}>
                  <MaterialIcons name={getPriorityIcon(task.prioridade) as any} size={20} color={getPriorityColor(task.prioridade)} />
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: 'center', color: '#999', marginVertical: 10 }}>
              Nenhuma tarefa pendente.
            </Text>
          )}
        </View>

        {/* ATIVIDADE RECENTE */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Atividade Recente</Text>

          {atividades.length > 0 ? (
            atividades.map((atividade, index) => (
              <View key={index} style={style.activityCard}>
                <View style={style.activityProfile}>
                  {atividade.autorFoto ? (
                    <Image
                      source={{ uri: atividade.autorFoto }}
                      style={style.profileImage}
                    />
                  ) : (
                    <View style={style.activityProfilePlaceholder}>
                      <MaterialIcons name="person" size={16} color="#FFF" />
                    </View>
                  )}
                </View>

                <View style={style.activityContent}>
                  <Text style={style.activityText}>
                    <Text style={style.activityUserName}>{atividade.titulo}</Text>
                  </Text>
                  <Text style={style.activityDetails}>{atividade.descricao}</Text>
                  <Text style={style.activityTime}>
                    {formatDate(atividade.dataHora)} - {atividade.tempoDecorrido || "Recente"}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ textAlign: "center", color: themas.colors.gray, marginTop: 10 }}>
              Nenhuma atividade recente
            </Text>
          )}
        </View>

        {/* RESUMO */}
        <View style={style.summaryCards}>
          <View style={style.summaryCard}>
            <View style={[style.summaryIconContainer, { backgroundColor: "#E8F5E9" }]}>
              <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            </View>
            <Text style={style.summaryPeriod}>Esta semana</Text>
            <Text style={style.summaryNumber}>{stats?.tarefasConcluidasSemana ?? 0}</Text>
            <Text style={style.summaryLabel}>Tarefas concluídas</Text>
          </View>

          <View style={style.summaryCard}>
            <View style={[style.summaryIconContainer, { backgroundColor: "#E3F2FD" }]}>
              <MaterialIcons name="receipt" size={24} color={themas.colors.primary} />
            </View>
            <Text style={style.summaryPeriod}>Este mês</Text>
            <Text style={style.summaryNumber}>{stats?.despesasCriadasMes ?? 0}</Text>
            <Text style={style.summaryLabel}>Novas despesas</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}