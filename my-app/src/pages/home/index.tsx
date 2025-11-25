import React, { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { style } from "./styles";
import { themas } from "../../global/themes";
import { getDashboardStats, getHistoricoAtividades } from "../../services/dashboardService";
import { DashboardStatsDTO, HistoricoResponseDTO } from "../../types/dashboard.types";

const { width } = Dimensions.get("window");

const userData = {
  name: "Joao",
  profileImage: null,
};

// Mock de tarefas - será substituído quando o módulo de tarefas estiver pronto
const upcomingTasks: any[] = [];

export default function Dashboard() {
  const navigation = useNavigation();

  // Estados para dados do backend
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [atividades, setAtividades] = useState<HistoricoResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Função para carregar dados do backend
  const loadDashboardData = async () => {
    try {
      const repId = await AsyncStorage.getItem("repId");

      if (!repId) {
        console.error("RepId não encontrado no AsyncStorage");
        return;
      }

      const [statsData, atividadesData] = await Promise.all([
        getDashboardStats(Number(repId)),
        getHistoricoAtividades(Number(repId)),
      ]);

      setStats(statsData);
      setAtividades(atividadesData);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Carregar dados ao montar componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Função de refresh (pull to refresh)
  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  // Mostrar loading enquanto carrega
  if (loading) {
    return (
      <View style={[style.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={themas.colors.primary} />
        <Text style={{ marginTop: 10, color: themas.colors.gray }}>Carregando dashboard...</Text>
      </View>
    );
  }

  const formatCurrency = (value: number) => {
    return `R$${value.toFixed(2).replace(".", ",")}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return themas.colors.red;
      case "medium": return "#FFA500";
      case "low": return "#4CAF50";
      default: return themas.colors.gray;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "schedule";
      case "low": return "people";
      default: return "info";
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    const months = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
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

              {/* BOTÃO DO PERFIL / CONFIGURAÇÕES */}
              <TouchableOpacity
                style={style.profileButton}
                onPress={() => navigation.navigate("Settings" as never)}
              >
                {userData.profileImage ? (
                  <Image
                    source={{ uri: userData.profileImage }}
                    style={style.profileImage}
                  />
                ) : (
                  <View style={style.profilePlaceholder}>
                    <MaterialIcons name="person" size={20} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={style.greetingContainer}>
            <View>
              <Text style={style.greeting}>Olá, {userData.name}!</Text>
              <Text style={style.welcomeText}>Bem-vindo a sua republica</Text>
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
            <Text style={style.balanceTitle}>Saldo da Republica</Text>
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
              <MaterialIcons name="arrow-downward" size={16} color={themas.colors.red} />
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

        {/* PRÓXIMAS TAREFAS */}
        <View style={style.section}>
          <View style={style.sectionHeader}>
            <Text style={style.sectionTitle}>Próximas Tarefas</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Tarefas" as never)}>
              <Text style={style.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>

          {upcomingTasks.map((task) => (
            <View key={task.id} style={style.taskCard}>
              <View style={style.taskLeft}>
                <View style={[style.taskDot, { backgroundColor: getPriorityColor(task.priority) }]} />
                <View style={style.taskInfo}>
                  <Text style={style.taskTitle}>{task.title}</Text>
                  <Text style={style.taskAssignee}>
                    {task.assignedTo} - {task.date}
                  </Text>
                </View>
              </View>

              <View style={[style.taskIconContainer, { borderColor: getPriorityColor(task.priority) }]}>
                <MaterialIcons name={getPriorityIcon(task.priority) as any} size={20} color={getPriorityColor(task.priority)} />
              </View>
            </View>
          ))}
        </View>

        {/* ATIVIDADE RECENTE */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Atividade Recente</Text>

          {atividades.length > 0 ? (
            atividades.map((atividade, index) => (
              <View key={index} style={style.activityCard}>
                <View style={style.activityProfile}>
                  {atividade.fotoAutor ? (
                    <Image
                      source={{ uri: atividade.fotoAutor }}
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
                  <Text style={style.activityTime}>{atividade.tempoDecorrido}</Text>
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
