import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { style } from "./styles";
import { Ball } from "../../components/Ball";
import { Flag } from "../../components/Flag";
import { themas } from "../../global/themes";
import { Input } from "../../components/input";
import { MaterialIcons } from "@expo/vector-icons";

type PropCard = {
  item: number;
  title: string;
  description: string;
  flag: "urgente" | "opcional";
};

const data: Array<PropCard> = [
  {
    item: 0,
    title: "Organizar festa sábado",
    description: "página 10 a 20",
    flag: "opcional",
  },
  {
    item: 1,
    title: "Dar banho no chorador",
    description: "página 10 a 20",
    flag: "urgente",
  },
  {
    item: 2,
    title: "Limpar a casa",
    description: "página 10 a 20",
    flag: "urgente",
  },
];

export default function List() {
  const _renderCard = (item: PropCard) => {
    return (
      <TouchableOpacity style={style.card}>
        <View style={style.rowCardLeft}>
          <Ball color="red" />
          <View>
            <View>
              <Text style={style.titleCard}>{item.title}</Text>
              <Text style={style.descriptionCard}>{item.description}</Text>
            </View>
          </View>
          <Flag caption="Urgente" color={themas.colors.red} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.greeting}>Olá, usuário</Text>
        <View style={style.boxInput}>
          <Input IconLeft={MaterialIcons} iconLeftName="search" />
        </View>
      </View>
      <View style={style.boxList}>
        <FlatList
          data={data}
          style={{ marginTop: 40, paddingHorizontal: 30 }}
          keyExtractor={(item, index) => item.item.toString()}
          renderItem={({ item, index }) => {
            return _renderCard(item);
          }}
        />
      </View>
    </View>
  );
}