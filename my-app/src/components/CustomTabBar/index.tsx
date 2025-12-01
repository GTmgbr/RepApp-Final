import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { themas } from "../../global/themes";

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let iconName: any = "home";
          let IconLib: any = MaterialIcons;

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Financas") iconName = "attach-money";
          else if (route.name === "Tarefas") iconName = "checklist";
          else if (route.name === "Agenda") iconName = "event";
          else if (route.name === "Avisos") {
            iconName = "megaphone";
            IconLib = Ionicons;
          }
          else if (route.name === "Membros") {
            iconName = "groups";
            IconLib = MaterialIcons;
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
            >
              <View
                style={[
                  styles.iconContainer,
                  isFocused && styles.iconFocused,
                ]}
              >
                <IconLib
                  name={iconName}
                  size={24}
                  color={isFocused ? "#FFF" : "#999"}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#FFF",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    gap: 5,
  },
  tabButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    padding: 10,
    borderRadius: 99,
  },
  iconFocused: {
    backgroundColor: themas.colors.primary,
  },
});