import React from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { MaterialIcons, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { style } from "./styles";
import { themas } from "../../global/themes";

const { width } = Dimensions.get("window");

// Dados mockados - substituir por dados reais depois
const userData = {
  name: "Joao",
  profileImage: null, // URL da imagem ou null
};

const balanceData = {
  total: 1247.5,
  received: 320,
  spent: 180,
};

const upcomingTasks = [
  {
    id: 1,
    title: "Limpeza da cozinha",
    assignedTo: "Maria",
    date: "Hoje, 14:00",
    priority: "high", // high, medium, low
  },
  {
    id: 2,
    title: "Compras do mes",
    assignedTo: "Pedro",
    date: "Amanha, 10:00",
    priority: "medium",
  },
  {
    id: 3,
    title: "Reunião mensal",
    assignedTo: "Todos",
    date: "22 Set, 19:00",
    priority: "low",
  },
];

const recentActivities = [
  {
    id: 1,
    user: "Ana",
    action: "adicionou uma nova despesa",
    details: "Supermercado - R$ 85,40",
    time: "há 2h",
    profileImage: null,
  },
  {
    id: 2,
    user: "Carlos",
    action: "completou uma tarefa",
    details: "Limpeza do banheiro",
    time: "há 4h",
    profileImage: null,
  },
  {
    id: 3,
    user: "Luisa",
    action: "criou um evento",
    details: "Churrasco de domingo",
    time: "ontem",
    profileImage: null,
  },
];

const summaryData = {
  tasksCompleted: 12,
  newExpenses: 8,
};

export default function Dashboard() {
  const navigation = useNavigation();

  const formatCurrency = (value: number) => {
    return `R$${value.toFixed(2).replace(".", ",")}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return themas.colors.red;
      case "medium":
        return "#FFA500";
      case "low":
        return "#4CAF50";
      default:
        return themas.colors.gray;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "error";
      case "medium":
        return "schedule";
      case "low":
        return "people";
      default:
        return "info";
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
  };

  return (
    <View style={style.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.scrollContent}
      >
        {/* Header */}
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
              <TouchableOpacity style={style.profileButton}>
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

        {/* Saldo da República */}
        <View style={style.balanceCard}>
          <View style={style.balanceHeader}>
            <Text style={style.balanceTitle}>Saldo da Republica</Text>
            <MaterialIcons name="account-balance-wallet" size={24} color="#FFF" />
          </View>
          <Text style={style.balanceAmount}>{formatCurrency(balanceData.total)}</Text>
          <View style={style.balanceDetails}>
            <View style={style.balanceItem}>
              <MaterialIcons name="arrow-upward" size={16} color="#4CAF50" />
              <Text style={style.balanceReceived}>
                R$ {balanceData.received.toFixed(0)} recebidos
              </Text>
            </View>
            <View style={style.balanceItem}>
              <MaterialIcons name="arrow-downward" size={16} color={themas.colors.red} />
              <Text style={style.balanceSpent}>
                R$ {balanceData.spent.toFixed(0)} gastos
              </Text>
            </View>
          </View>
        </View>

        {/* Cards de Navegação */}
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

        {/* Próximas Tarefas */}
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
                <View
                  style={[
                    style.taskDot,
                    { backgroundColor: getPriorityColor(task.priority) },
                  ]}
                />
                <View style={style.taskInfo}>
                  <Text style={style.taskTitle}>{task.title}</Text>
                  <Text style={style.taskAssignee}>
                    {task.assignedTo} - {task.date}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  style.taskIconContainer,
                  { borderColor: getPriorityColor(task.priority) },
                ]}
              >
                <MaterialIcons
                  name={getPriorityIcon(task.priority) as any}
                  size={20}
                  color={getPriorityColor(task.priority)}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Atividade Recente */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>Atividade Recente</Text>
          {recentActivities.map((activity) => (
            <View key={activity.id} style={style.activityCard}>
              <View style={style.activityProfile}>
                {activity.profileImage ? (
                  <Image
                    source={{ uri: activity.profileImage }}
                    style={style.activityProfileImage}
                  />
                ) : (
                  <View style={style.activityProfilePlaceholder}>
                    <MaterialIcons name="person" size={16} color="#FFF" />
                  </View>
                )}
              </View>
              <View style={style.activityContent}>
                <Text style={style.activityText}>
                  <Text style={style.activityUserName}>{activity.user}</Text>{" "}
                  {activity.action}
                </Text>
                <Text style={style.activityDetails}>{activity.details}</Text>
                <Text style={style.activityTime}>{activity.time}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Cards de Resumo */}
        <View style={style.summaryCards}>
          <View style={style.summaryCard}>
            <View style={[style.summaryIconContainer, { backgroundColor: "#E8F5E9" }]}>
              <MaterialIcons name="check-circle" size={24} color="#4CAF50" />
            </View>
            <Text style={style.summaryPeriod}>Esta semana</Text>
            <Text style={style.summaryNumber}>{summaryData.tasksCompleted}</Text>
            <Text style={style.summaryLabel}>Tarefas concluídas</Text>
          </View>
          <View style={style.summaryCard}>
            <View style={[style.summaryIconContainer, { backgroundColor: "#E3F2FD" }]}>
              <MaterialIcons name="receipt" size={24} color={themas.colors.primary} />
            </View>
            <Text style={style.summaryPeriod}>Este mes</Text>
            <Text style={style.summaryNumber}>{summaryData.newExpenses}</Text>
            <Text style={style.summaryLabel}>Novas despesas</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
