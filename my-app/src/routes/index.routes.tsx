import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../pages/login";
import Register from "../pages/register";
import RegisterUser from "../pages/registerUser";
import Access from "../pages/first access";
import BottomRoutes from "./bottom.routes";
import settings from "../pages/settings/settings";
import AdicionarDespesa from "../pages/financas/AdicionarDespesa";
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
      <Stack.Screen name="Settings" component={settings} />
      <Stack.Screen name="AdicionarDespesa" component={AdicionarDespesa} />
    </Stack.Navigator>
  );
}
