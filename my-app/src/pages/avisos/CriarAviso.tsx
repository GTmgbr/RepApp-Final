import React, { useState } from "react";
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
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { criarAviso } from "../../services/avisoService";
import { AvisoRequestDTO, CategoriaAviso, UrgenciaAviso } from "../../types/avisos.types";
import { themas } from "../../global/themes";

export default function CriarAviso() {
    const navigation = useNavigation();

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [valor, setValor] = useState("");
    const [categoria, setCategoria] = useState<CategoriaAviso>("GERAL");
    const [urgencia, setUrgencia] = useState<UrgenciaAviso>("BAIXA");

    const [loading, setLoading] = useState(false);

    const categorias: CategoriaAviso[] = ["GERAL", "FINANCEIRO", "LIMPEZA", "EVENTO", "MANUTENCAO"];
    const urgencias: UrgenciaAviso[] = ["BAIXA", "MEDIA", "ALTA"];

    const handleSubmit = async () => {
        if (!titulo.trim()) return Alert.alert("Erro", "O título é obrigatório");
        if (!descricao.trim()) return Alert.alert("Erro", "A descrição é obrigatória");

        setLoading(true);

        try {
            const repId = await AsyncStorage.getItem("@repId");
            if (!repId) return;

            const novoAviso: AvisoRequestDTO = {
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                categoria,
                urgencia,
                valor: valor ? Number(valor.replace(',', '.')) : undefined
            };

            await criarAviso(Number(repId), novoAviso);

            Alert.alert("Sucesso", "Aviso publicado!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            Alert.alert("Erro", error.response?.data?.message || "Erro ao criar aviso.");
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
                <Text style={styles.headerTitle}>Novo Aviso</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                {/* Título */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Título *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Festa no sábado"
                        value={titulo}
                        onChangeText={setTitulo}
                        maxLength={50}
                    />
                </View>

                {/* Urgencia */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Urgência</Text>
                    <View style={styles.row}>
                        {urgencias.map((u) => (
                            <TouchableOpacity
                                key={u}
                                style={[
                                    styles.chip,
                                    urgencia === u && styles.chipSelected,
                                    urgencia === u && u === 'ALTA' && { backgroundColor: '#FFEBEE', borderColor: '#FFCDD2' }
                                ]}
                                onPress={() => setUrgencia(u)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    urgencia === u && styles.chipTextSelected,
                                    urgencia === u && u === 'ALTA' && { color: '#D32F2F' }
                                ]}>
                                    {u}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Categoria */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Categoria</Text>
                    <View style={styles.row}>
                        {categorias.map((c) => (
                            <TouchableOpacity
                                key={c}
                                style={[styles.chip, categoria === c && styles.chipSelected]}
                                onPress={() => setCategoria(c)}
                            >
                                <Text style={[styles.chipText, categoria === c && styles.chipTextSelected]}>
                                    {c}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Valor (Opcional) */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Valor envolvido (Opcional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0.00"
                        value={valor}
                        onChangeText={setValor}
                        keyboardType="decimal-pad"
                    />
                </View>

                {/* Descripción */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Mensagem *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Detalhes do aviso..."
                        value={descricao}
                        onChangeText={setDescricao}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : (
                        <>
                            <Feather name="send" size={20} color="#FFF" />
                            <Text style={styles.submitButtonText}>Publicar Aviso</Text>
                        </>
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
    row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: "#E0E0E0", backgroundColor: "#FFF", marginBottom: 5 },
    chipSelected: { backgroundColor: themas.colors.primary, borderColor: themas.colors.primary },
    chipText: { color: "#666", fontSize: 12, fontWeight: '600' },
    chipTextSelected: { color: "#FFF" },
    submitButton: { backgroundColor: themas.colors.primary, padding: 16, borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 40, marginTop: 10 },
    submitButtonDisabled: { opacity: 0.7 },
    submitButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold", marginLeft: 8 },
});