import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { style } from "./styles";
import { themas } from "../../global/themes";

export default ({ state, navigation }: BottomTabBarProps) => {
  const go = (screenName: string) => {
    navigation.navigate(screenName);
  };

  const tabs = [
    {
      name: "Home",
      label: "Inicio",
      icon: (focused: boolean) => (
        <MaterialIcons
          name="home"
          size={24}
          color={focused ? themas.colors.primary : themas.colors.gray}
        />
      ),
    },
    {
      name: "Financas",
      label: "Financas",
      icon: (focused: boolean) => (
        <MaterialIcons
          name="account-balance-wallet"
          size={24}
          color={focused ? themas.colors.primary : themas.colors.gray}
        />
      ),
    },
    {
      name: "Tarefas",
      label: "Tarefas",
      icon: (focused: boolean) => (
        <MaterialIcons
          name="checklist"
          size={24}
          color={focused ? themas.colors.primary : themas.colors.gray}
        />
      ),
    },
    {
      name: "Agenda",
      label: "Agenda",
      icon: (focused: boolean) => (
        <MaterialIcons
          name="event"
          size={24}
          color={focused ? themas.colors.primary : themas.colors.gray}
        />
      ),
    },
    {
      name: "Avisos",
      label: "Avisos",
      icon: (focused: boolean) => (
        <Ionicons
          name="megaphone"
          size={24}
          color={focused ? themas.colors.primary : themas.colors.gray}
        />
      ),
    },
  ];

  return (
    <View style={style.TabArea}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            key={tab.name}
            style={style.TabItem}
            onPress={() => go(tab.name)}
            activeOpacity={0.7}
          >
            <View style={style.TabItemContent}>
              {tab.icon(isFocused)}
              <Text
                style={[
                  style.TabItemLabel,
                  {
                    color: isFocused ? themas.colors.primary : themas.colors.gray,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
