import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/login";
import Register from "../pages/register";
import RegisterUser from "../pages/registerUser";
import Access from "../pages/first access";
import BottomRoutes from "./bottom.routes";
import Settings from "../pages/settings";
import Membros from "../pages/membros";
import AdicionarDespesa from "../pages/financas/AdicionarDespesa";
import CriarTarefa from "../pages/tarefas/CriarTarefa";
import CriarAviso from "../pages/avisos/CriarAviso";
import CriarEvento from "../pages/agenda/CriarEvento";
import JoinHandler from "../pages/convite/JoinHandler";

import { themas } from "../global/themes";

const Stack = createStackNavigator();

export default function Routes() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: "#FFF",
        },
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="RegisterUser" component={RegisterUser} />
      <Stack.Screen name="Access" component={Access} />
      <Stack.Screen name="MainTabs" component={BottomRoutes} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Membros" component={Membros} />
      <Stack.Screen name="AdicionarDespesa" component={AdicionarDespesa} />
      <Stack.Screen name="CriarTarefa" component={CriarTarefa} />
      <Stack.Screen name="CriarAviso" component={CriarAviso} />
      <Stack.Screen name="CriarEvento" component={CriarEvento} />
      <Stack.Screen name="JoinHandler" component={JoinHandler} />
    </Stack.Navigator>
  );
}