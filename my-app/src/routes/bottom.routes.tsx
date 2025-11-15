import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../pages/home";
import Financas from "../pages/financas";
import Tarefas from "../pages/tarefas";
import Agenda from "../pages/agenda";
import Avisos from "../pages/avisos";
import CustomTabBar from "../components/CustomTabBar";
import { AuthProviderList } from "../context/authContext_list";

const Tab = createBottomTabNavigator();

export default function BottomRoutes() {
  return (
    <AuthProviderList>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Financas" component={Financas} />
        <Tab.Screen name="Tarefas" component={Tarefas} />
        <Tab.Screen name="Agenda" component={Agenda} />
        <Tab.Screen name="Avisos" component={Avisos} />
      </Tab.Navigator>
    </AuthProviderList>
  );
}
