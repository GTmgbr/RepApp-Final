import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Modal,
    FlatList,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { criarTarefa } from "../../services/tarefaService";
import { getMembros } from "../../services/membroService";
import { TarefaRequestDTO, PrioridadeTarefa, CategoriaTarefa } from "../../types/tarefas.types";
import { MembroResponseDTO } from "../../types/membro.types";
import { styles } from "./CriarTarefaStyles";

export default function CriarTarefa() {
    const navigation = useNavigation();

    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [data, setData] = useState("");
    const [prioridade, setPrioridade] = useState<PrioridadeTarefa>("BAIXA");
    const [categoria, setCategoria] = useState<CategoriaTarefa>("LIMPEZA");
    const [responsavelId, setResponsavelId] = useState<number | null>(null);

    const [loading, setLoading] = useState(false);
    const [membros, setMembros] = useState<MembroResponseDTO[]>([]);
    const [modalVisible, setModalVisible] = useState(false);

    const prioridades: PrioridadeTarefa[] = ["BAIXA", "MEDIA", "ALTA", "URGENTE"];
    const categorias: CategoriaTarefa[] = ["LIMPEZA", "MANUTENCAO", "COMPRAS", "OUTROS"];

    useEffect(() => {
        carregarMembros();
    }, []);

    const carregarMembros = async () => {
        try {
            const repId = await AsyncStorage.getItem("@repId");
            if (repId) {
                const lista = await getMembros(Number(repId));
                setMembros(lista);
            }
        } catch (error) {
            console.error("Erro ao carregar membros", error);
        }
    };

    const formatDataToISO = (dateStr: string): string => {
        if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return "";
        const [day, month, year] = dateStr.split("/");
        return `${year}-${month}-${day}T23:59:59`;
    };

    const getResponsavelNome = () => {
        if (!responsavelId) return "Sem responsável";
        const membro = membros.find(m => m.usuarioId === responsavelId);
        return membro ? membro.nome : "Desconhecido";
    };

    const handleSubmit = async () => {
        if (!titulo.trim()) return Alert.alert("Erro", "O título é obrigatório");
        if (!data.trim()) return Alert.alert("Erro", "A data é obrigatória");

        const dataISO = formatDataToISO(data);
        if (!dataISO) return Alert.alert("Erro", "Data inválida. Use dd/mm/aaaa");

        setLoading(true);

        try {
            const repId = await AsyncStorage.getItem("@repId");
            if (!repId) {
                Alert.alert("Erro", "Sessão inválida. Faça login novamente.");
                return;
            }

            const novaTarefa: TarefaRequestDTO = {
                titulo: titulo.trim(),
                descricao: descricao.trim() || undefined,
                dataPrazo: dataISO,
                prioridade,
                categoria,
                responsavelId: responsavelId || undefined
            };

            await criarTarefa(Number(repId), novaTarefa);

            Alert.alert(
                "Sucesso!",
                "Tarefa criada com sucesso.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.goBack()
                    }
                ]
            );

        } catch (error: any) {
            console.error(error);
            Alert.alert("Erro", error.response?.data?.message || "Não foi possível criar a tarefa.");
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
                <Text style={styles.headerTitle}>Nova Tarefa</Text>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                {/* Título */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Título *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Lavar a louça"
                        value={titulo}
                        onChangeText={setTitulo}
                        maxLength={50}
                    />
                </View>

                {/* Prioridade */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Prioridade</Text>
                    <View style={styles.row}>
                        {prioridades.map((p) => (
                            <TouchableOpacity
                                key={p}
                                style={[styles.chip, prioridade === p && styles.chipSelected]}
                                onPress={() => setPrioridade(p)}
                            >
                                <Text style={[styles.chipText, prioridade === p && styles.chipTextSelected]}>{p}</Text>
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
                                <Text style={[styles.chipText, categoria === c && styles.chipTextSelected]}>{c}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Data */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Prazo *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="dd/mm/aaaa"
                        value={data}
                        onChangeText={setData}
                        keyboardType="numeric"
                        maxLength={10}
                    />
                </View>

                {/* Responsável */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Responsável</Text>
                    <TouchableOpacity style={styles.selectorButton} onPress={() => setModalVisible(true)}>
                        <Text style={styles.selectorText}>{getResponsavelNome()}</Text>
                        <Feather name="chevron-down" size={20} color="#666" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? <ActivityIndicator color="#FFF" /> : (
                        <>
                            <MaterialIcons name="check" size={24} color="#FFF" />
                            <Text style={styles.submitButtonText}>Criar Tarefa</Text>
                        </>
                    )}
                </TouchableOpacity>

            </ScrollView>

            {/* Modal Responsável */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
                    <View style={{ backgroundColor: '#FFF', borderTopLeftRadius: 20, padding: 20, maxHeight: '60%' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' }}>Selecione o Responsável</Text>
                        <FlatList
                            data={[{ usuarioId: 0, nome: "Sem responsável", funcao: "" } as any, ...membros]}
                            keyExtractor={(item) => String(item.usuarioId)}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={{ paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between' }}
                                    onPress={() => {
                                        setResponsavelId(item.usuarioId === 0 ? null : item.usuarioId);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={{ fontSize: 16, color: item.usuarioId === responsavelId ? '#2D6CF6' : '#333' }}>
                                        {item.nome}
                                    </Text>
                                    {item.usuarioId === responsavelId && <Feather name="check" size={20} color="#2D6CF6" />}
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => setModalVisible(false)}>
                            <Text style={{ color: '#666' }}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}