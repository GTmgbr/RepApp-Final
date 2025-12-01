import "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Routes from "./src/routes/index.routes";
import * as Linking from "expo-linking";

export default function App() {

  const linking = {
    prefixes: [Linking.createURL("/"), "repapp://"],
    config: {
      screens: {
        Login: "login",
        Register: "register",
        RegisterUser: "register-user",
        Access: "access",
        MainTabs: {
          path: "app",
          screens: {
            Home: "home",
            Financas: "financas",
            Tarefas: "tarefas",
            Agenda: "agenda",
            Avisos: "avisos",
            Membros: "membros",
          },
        },
        Settings: "settings",
        AdicionarDespesa: "nova-despesa",
        CriarTarefa: "nova-tarefa",
        CriarAviso: "novo-aviso",
        CriarEvento: "novo-evento",
        JoinHandler: "entrar/:token",
      },
    },
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#F5F7FA" translucent={false} />
      <NavigationContainer linking={linking}>
        <Routes />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});