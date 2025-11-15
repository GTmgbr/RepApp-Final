import { StyleSheet, Dimensions } from "react-native";
import { themas } from "../../global/themes";

const { width } = Dimensions.get("window");

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  // Header
  header: {
    width: "100%",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoBox: {
    width: 40,
    height: 40,
    backgroundColor: "#FFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: themas.colors.lightGray,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profilePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: themas.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  greetingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 14,
    color: themas.colors.gray,
  },
  dateContainer: {
    alignItems: "flex-end",
  },
  dateLabel: {
    fontSize: 12,
    color: themas.colors.gray,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  // Saldo da República
  balanceCard: {
    backgroundColor: "#1b64f0",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  balanceTitle: {
    fontSize: 14,
    color: "#FFF",
    opacity: 0.9,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 15,
  },
  balanceDetails: {
    flexDirection: "row",
    gap: 20,
  },
  balanceItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  balanceReceived: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "600",
  },
  balanceSpent: {
    fontSize: 12,
    color: themas.colors.red,
    fontWeight: "600",
  },
  // Cards de Navegação
  navigationCards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 15,
  },
  navCard: {
    width: (width - 60) / 2,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: themas.colors.lightGray,
  },
  navCardText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginTop: 10,
  },
  // Seções
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  seeAllText: {
    fontSize: 14,
    color: themas.colors.primary,
    fontWeight: "600",
  },
  // Tarefas
  taskCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: themas.colors.lightGray,
  },
  taskLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  taskDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  taskAssignee: {
    fontSize: 12,
    color: themas.colors.gray,
  },
  taskIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  // Atividade Recente
  activityCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
    gap: 12,
  },
  activityProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  activityProfileImage: {
    width: "100%",
    height: "100%",
  },
  activityProfilePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: themas.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: "#000",
    marginBottom: 4,
  },
  activityUserName: {
    fontWeight: "600",
  },
  activityDetails: {
    fontSize: 13,
    color: themas.colors.gray,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 11,
    color: themas.colors.gray,
  },
  // Cards de Resumo
  summaryCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: themas.colors.lightGray,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryPeriod: {
    fontSize: 12,
    color: themas.colors.gray,
    marginBottom: 8,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: themas.colors.gray,
  },
});
