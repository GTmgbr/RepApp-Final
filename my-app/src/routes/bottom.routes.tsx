import React, { useState, useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Home from "../pages/home";
import Financas from "../pages/financas";
import Tarefas from "../pages/tarefas";
import Agenda from "../pages/agenda";
import Avisos from "../pages/avisos";
import Membros from "../pages/membros";

import CustomTabBar from "../components/CustomTabBar";
import { AuthProviderList } from "../context/authContext_list";
import { getMembros } from "../services/membroService";

const Tab = createBottomTabNavigator();

export default function BottomRoutes() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    verificarPermissao();
  }, []);

  const verificarPermissao = async () => {
    try {
      const repId = await AsyncStorage.getItem("@repId");
      const usuarioJson = await AsyncStorage.getItem("@usuario");

      if (repId && usuarioJson) {
        const usuario = JSON.parse(usuarioJson);
        const membros = await getMembros(Number(repId));
        const eu = membros.find(m => m.usuarioId === usuario.id);

        if (eu && eu.funcao === 'ADM') {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.log("Erro ao verificar permissão de ADM", error);
    }
  };

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
        {isAdmin && (
          <Tab.Screen name="Membros" component={Membros} />
        )}

      </Tab.Navigator>
    </AuthProviderList>
  );
}