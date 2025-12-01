import React, { useEffect } from "react";
import { Text, TouchableOpacity, View, Linking, Alert } from "react-native";
import { style } from "./styles";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, NavigationProp } from "@react-navigation/native";

export default function PrimeiroAcesso() {
  const navigation = useNavigation<NavigationProp<any>>();

  useEffect(() => {
    const checkRep = async () => {
      const repId = await AsyncStorage.getItem('@repId');
      if (repId) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
      }
    };
    checkRep();
  }, []);

  function handleNavigateToRegisterRep() {
    navigation.navigate("Register");
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Text style={style.subtitle}>Primeiro Acesso</Text>
        <Text style={style.title}>Bem vindo ao RepApp</Text>
      </View>

      <View style={style.content}>
        {/* Opção 1: Entrar em uma rep existente (Futuro) */}
        <Text style={style.question}>A sua rep já foi cadastrada?</Text>
        <TouchableOpacity onPress={() => Alert.alert("Em breve", "A funcionalidade de entrar via link será implementada na próxima etapa.")}>
          <Text style={style.link}>
            • Contate o administrador da rep para {"\n"} obter o link de acesso. {"\n"}{"\n"}
          </Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />

        <Text style={style.question}>{"\n"}Deseja cadastrar uma rep?</Text>

        <TouchableOpacity onPress={handleNavigateToRegisterRep}>
          <Text style={style.link}>
            • Cadastre a sua nova rep e organize {"\n"} tudo em um só lugar.
          </Text>
        </TouchableOpacity>

        <Text style={style.buttonLabel}>{"\n"}{"\n"}{"\n"}Cadastrar Rep</Text>

        <TouchableOpacity style={style.button} onPress={handleNavigateToRegisterRep}>
          <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={style.footer}>
          Ao criar sua república, você concorda com nossos{" "}
          <Text
            style={style.footerLink}
            onPress={() => Linking.openURL("#")}
          >
            Termos de Uso
          </Text>{" "}
          e{" "}
          <Text
            style={style.footerLink}
            onPress={() => Linking.openURL("#")}
          >
            Política de Privacidade
          </Text>
          .
        </Text>
      </View>
    </View>
  );
}