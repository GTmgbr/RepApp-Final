import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { criarEvento, atualizarEvento } from "../../services/agendaService";
import { EventoRequestDTO, EventoDTO } from "../../types/agenda.types";
import { themas } from "../../global/themes";

export default function CriarEvento() {
    const navigation = useNavigation();
    const route = useRoute();

    const eventoParaEditar = (route.params as any)?.evento as EventoDTO | undefined;
    const isEditing = !!eventoParaEditar;

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [local, setLocal] = useState("");
    const [data, setData] = useState("");
    const [hora, setHora] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (eventoParaEditar) {
            setTitulo(eventoParaEditar.titulo);
            setDescricao(eventoParaEditar.descricao || "");
            setLocal(eventoParaEditar.local);

            if (eventoParaEditar.dataHora) {
                const dateObj = new Date(eventoParaEditar.dataHora);
                const dia = String(dateObj.getDate()).padStart(2, '0');
                const mes = String(dateObj.getMonth() + 1).padStart(2, '0');
                const ano = dateObj.getFullYear();
                const h = String(dateObj.getHours()).padStart(2, '0');
                const m = String(dateObj.getMinutes()).padStart(2, '0');

                setData(`${dia}/${mes}/${ano}`);
                setHora(`${h}:${m}`);
            }
        }
    }, [eventoParaEditar]);

    const formatDateTimeToISO = (d: string, h: string) => {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(d)) return null;
        if (!/^\d{2}:\d{2}$/.test(h)) return null;
        const [day, month, year] = d.split("/");
        return `${year}-${month}-${day}T${h}:00`;
    };

    const handleSubmit = async () => {
        if (!titulo.trim()) return Alert.alert("Erro", "Título é obrigatório");
        if (!local.trim()) return Alert.alert("Erro", "Local é obrigatório");

        const isoDateTime = formatDateTimeToISO(data, hora);
        if (!isoDateTime) return Alert.alert("Erro", "Data ou hora inválida.");

        setLoading(true);

        try {
            const repId = await AsyncStorage.getItem("@repId");
            if (!repId) return;

            const eventoDTO: EventoRequestDTO = {
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                local: local.trim(),
                dataHora: isoDateTime
            };

            if (isEditing) {
                await atualizarEvento(Number(repId), eventoParaEditar.id, eventoDTO);
                Alert.alert("Sucesso", "Evento atualizado!", [{ text: "OK", onPress: () => navigation.goBack() }]);
            } else {
                await criarEvento(Number(repId), eventoDTO);
                Alert.alert("Sucesso", "Evento criado!", [{ text: "OK", onPress: () => navigation.goBack() }]);
            }

        } catch (error: any) {
            const msg = error.response?.data?.message || "Erro ao salvar evento.";
            Alert.alert("Erro", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {isEditing ? "Editar Evento" : "Novo Evento"}
                </Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Título *</Text>
                    <TextInput style={styles.input} placeholder="Ex: Churrasco" value={titulo} onChangeText={setTitulo} />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Local *</Text>
                    <TextInput style={styles.input} placeholder="Ex: Área da Piscina" value={local} onChangeText={setLocal} />
                </View>

                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                        <Text style={styles.label}>Data *</Text>
                        <TextInput style={styles.input} placeholder="dd/mm/aaaa" value={data} onChangeText={setData} maxLength={10} keyboardType="numeric" />
                    </View>
                    <View style={[styles.inputContainer, { flex: 1 }]}>
                        <Text style={styles.label}>Hora *</Text>
                        <TextInput style={styles.input} placeholder="hh:mm" value={hora} onChangeText={setHora} maxLength={5} keyboardType="numeric" />
                    </View>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Descrição</Text>
                    <TextInput style={[styles.input, styles.textArea]} placeholder="Detalhes..." value={descricao} onChangeText={setDescricao} multiline numberOfLines={4} />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFF" /> : (
                        <Text style={styles.submitButtonText}>
                            {isEditing ? "Salvar Alterações" : "Agendar Evento"}
                        </Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFF" },
    header: { flexDirection: "row", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "#F0F0F5" },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: "#333", marginLeft: 10 },
    scrollView: { paddingHorizontal: 20, paddingTop: 20 },
    inputContainer: { marginBottom: 20 },
    label: { fontSize: 14, color: "#666", marginBottom: 8, fontWeight: "600" },
    input: { backgroundColor: "#F5F5F5", borderRadius: 10, padding: 15, fontSize: 16, color: "#333", borderWidth: 1, borderColor: "#E0E0E0" },
    textArea: { height: 100, textAlignVertical: "top" },
    submitButton: { backgroundColor: themas.colors.primary, padding: 16, borderRadius: 12, alignItems: "center", marginTop: 10, marginBottom: 30 },
    submitButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
});