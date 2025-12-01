import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert, Platform } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { entrarComConvite } from "../../services/conviteService";
import { themas } from "../../global/themes";

export default function JoinHandler() {
    const route = useRoute();
    const navigation = useNavigation();
    const [status, setStatus] = useState("Verificando convite...");

    const { token } = route.params as { token: string };

    useEffect(() => {
        procesarConvite();
    }, [token]);

    const procesarConvite = async () => {
        if (!token) {
            setStatus("Link inválido.");
            return;
        }

        try {
            const tokenAuth = await AsyncStorage.getItem("@token");
            const user = await AsyncStorage.getItem("@usuario");

            if (!tokenAuth || !user) {
                if (Platform.OS === 'web') {
                    alert("Faça login para aceitar o convite.");
                } else {
                    Alert.alert("Atenção", "Faça login para aceitar o convite.");
                }

                navigation.reset({
                    index: 0,
                    routes: [{ name: "Login", params: { pendingInviteToken: token } } as any],
                });
                return;
            }

            const usuarioObj = JSON.parse(user);
            setStatus("Entrando na república...");

            const response = await entrarComConvite(token, usuarioObj.id);

            await AsyncStorage.setItem("@repId", String(response.id));

            setTimeout(() => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: "MainTabs" } as any],
                });
            }, 1000);

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Erro ao processar convite.";

            if (Platform.OS === 'web') {
                alert(msg);
                navigation.navigate("Access" as never);
            } else {
                Alert.alert("Erro", msg, [
                    { text: "Voltar", onPress: () => navigation.navigate("Access" as never) }
                ]);
            }
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#FFF" }}>
            <ActivityIndicator size="large" color={themas.colors.primary} />
            <Text style={{ marginTop: 20, color: "#666", fontSize: 16 }}>{status}</Text>
        </View>
    );
}