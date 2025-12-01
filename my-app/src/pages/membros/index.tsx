import React, { useState, useCallback } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    ActivityIndicator,
    Modal,
    TextInput,
    Share,
    Alert,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from 'expo-clipboard';

import { themas } from "../../global/themes";
import { getMembros, alterarFuncao, removerMembro } from "../../services/membroService";
import { gerarConvite } from "../../services/conviteService";
import { MembroDTO, TipoMembro, ConviteRequestDTO } from "../../types/membro.types";

export default function Membros() {
    const navigation = useNavigation();

    const [activeTab, setActiveTab] = useState<"LISTA" | "CONVITE">("LISTA");

    const [membros, setMembros] = useState<MembroDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [myId, setMyId] = useState<number | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MembroDTO | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const [inviteRole, setInviteRole] = useState<TipoMembro>("MEMBRO");
    const [inviteUses, setInviteUses] = useState("1");
    const [inviteHours, setInviteHours] = useState("24");
    const [generatedLink, setGeneratedLink] = useState<string | null>(null);
    const [inviteLoading, setInviteLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadInitialData();
        }, [])
    );

    const loadInitialData = async () => {
        try {
            const userJson = await AsyncStorage.getItem("@usuario");
            if (userJson) {
                const user = JSON.parse(userJson);
                setMyId(user.id);
            }

            await carregarMembros();
        } catch (error) {
            console.error(error);
        }
    };

    const carregarMembros = async () => {
        try {
            setLoading(true);
            const repId = await AsyncStorage.getItem("@repId");
            if (!repId) return;

            const data = await getMembros(Number(repId));
            setMembros(data);
        } catch (error) {
            console.error("Erro ao carregar membros", error);
        } finally {
            setLoading(false);
        }
    };

    const openOptions = (member: MembroDTO) => {
        if (member.usuarioId === myId) return;
        setSelectedMember(member);
        setModalVisible(true);
    };

    const handleChangeRole = async (newRole: TipoMembro) => {
        if (!selectedMember) return;
        try {
            setActionLoading(true);
            const repId = await AsyncStorage.getItem("@repId");
            if (!repId) return;

            await alterarFuncao(Number(repId), selectedMember.usuarioId, newRole);

            setModalVisible(false);
            carregarMembros();
            Alert.alert("Sucesso", "Função alterada com sucesso.");
        } catch (error: any) {
            Alert.alert("Erro", "Não foi possível alterar a função. Verifique se você é ADM.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveMember = async () => {
        if (!selectedMember) return;

        const executeRemoval = async () => {
            try {
                setActionLoading(true);
                const repId = await AsyncStorage.getItem("@repId");
                if (!repId) return;

                await removerMembro(Number(repId), selectedMember.usuarioId);
                setModalVisible(false);
                carregarMembros();
            } catch (error) {
                const msg = "Não foi possível remover o membro.";
                if (Platform.OS === 'web') alert(msg);
                else Alert.alert("Erro", msg);
            } finally {
                setActionLoading(false);
            }
        };

        if (Platform.OS === 'web') {
            const confirm = window.confirm(`Tem certeza que deseja remover ${selectedMember.nome} da república?`);
            if (confirm) {
                executeRemoval();
            }
        } else {
            Alert.alert(
                "Remover Membro",
                `Tem certeza que deseja remover ${selectedMember.nome} da república?`,
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Sim, Remover",
                        style: "destructive",
                        onPress: executeRemoval
                    }
                ]
            );
        }
    };

    const handleGenerateInvite = async () => {
        try {
            setInviteLoading(true);
            const repId = await AsyncStorage.getItem("@repId");
            if (!repId) return;

            const dto: ConviteRequestDTO = {
                tipoMembro: inviteRole,
                limiteUsos: parseInt(inviteUses) || 1,
                horasValidade: parseInt(inviteHours) || 24
            };

            const response = await gerarConvite(Number(repId), dto);
            setGeneratedLink(response.link);

        } catch (error) {
            Alert.alert("Erro", "Falha ao gerar convite.");
        } finally {
            setInviteLoading(false);
        }
    };

    const handleShareLink = async () => {
        if (!generatedLink) return;
        try {
            await Share.share({
                message: `Venha morar na minha república! Use este link para entrar no App: \n${generatedLink}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleCopyLink = async () => {
        if (generatedLink) {
            await Clipboard.setStringAsync(generatedLink);
            Alert.alert("Copiado", "Link copiado para a área de transferência");
        }
    }

    const renderMemberItem = (item: MembroDTO) => {
        const isMe = item.usuarioId === myId;
        return (
            <TouchableOpacity
                key={item.usuarioId}
                style={styles.memberCard}
                onPress={() => openOptions(item)}
                disabled={isMe}
                activeOpacity={0.7}
            >
                <View style={styles.memberInfo}>
                    {item.fotoUrl ? (
                        <Image source={{ uri: item.fotoUrl }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarLetter}>{item.nome.charAt(0).toUpperCase()}</Text>
                        </View>
                    )}
                    <View>
                        <Text style={styles.memberName}>
                            {item.nome} {isMe && "(Você)"}
                        </Text>
                        <Text style={styles.memberRole}>{item.funcao}</Text>
                    </View>
                </View>

                {!isMe && (
                    <Feather name="more-vertical" size={24} color="#CCC" />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Feather name="arrow-left" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Membros da República</Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "LISTA" && styles.tabActive]}
                    onPress={() => setActiveTab("LISTA")}
                >
                    <Text style={[styles.tabText, activeTab === "LISTA" && styles.tabTextActive]}>Lista</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === "CONVITE" && styles.tabActive]}
                    onPress={() => setActiveTab("CONVITE")}
                >
                    <Text style={[styles.tabText, activeTab === "CONVITE" && styles.tabTextActive]}>Convidar</Text>
                </TouchableOpacity>
            </View>

            {/* LISTA */}
            {activeTab === "LISTA" && (
                <ScrollView contentContainerStyle={styles.scrollContent} refreshControl={undefined}>
                    {loading ? (
                        <ActivityIndicator size="large" color={themas.colors.primary} style={{ marginTop: 50 }} />
                    ) : (
                        membros.map(renderMemberItem)
                    )}
                </ScrollView>
            )}

            {activeTab === "CONVITE" && (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.inviteCard}>
                        <Text style={styles.inviteTitle}>Criar Link de Convite</Text>
                        <Text style={styles.inviteDesc}>
                            Gere um link para adicionar novos moradores. Configure o nível de acesso e validade.
                        </Text>

                        <View style={styles.configRow}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={styles.label}>Função</Text>
                                <View style={styles.roleSelector}>
                                    <TouchableOpacity
                                        style={[styles.roleBtn, inviteRole === 'MEMBRO' && styles.roleBtnActive]}
                                        onPress={() => setInviteRole('MEMBRO')}
                                    >
                                        <Text style={[styles.roleBtnText, inviteRole === 'MEMBRO' && styles.roleBtnTextActive]}>Membro</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.roleBtn, inviteRole === 'AGREGADO' && styles.roleBtnActive]}
                                        onPress={() => setInviteRole('AGREGADO')}
                                    >
                                        <Text style={[styles.roleBtnText, inviteRole === 'AGREGADO' && styles.roleBtnTextActive]}>Agregado</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.configRow}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={styles.label}>Usos (pessoas)</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={inviteUses}
                                    onChangeText={setInviteUses}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>Validade (horas)</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={inviteHours}
                                    onChangeText={setInviteHours}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.generateButton}
                            onPress={handleGenerateInvite}
                            disabled={inviteLoading}
                        >
                            {inviteLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.generateButtonText}>Gerar Link</Text>}
                        </TouchableOpacity>

                        {/* Resultado */}
                        {generatedLink && (
                            <View style={styles.resultContainer}>
                                <Text style={styles.resultLabel}>Link gerado:</Text>
                                <View style={styles.linkBox}>
                                    <Text numberOfLines={1} style={styles.linkText}>{generatedLink}</Text>
                                </View>

                                <View style={styles.shareRow}>
                                    <TouchableOpacity style={styles.actionBtn} onPress={handleCopyLink}>
                                        <Feather name="copy" size={20} color={themas.colors.primary} />
                                        <Text style={styles.actionBtnText}>Copiar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnShare]} onPress={handleShareLink}>
                                        <Feather name="share-2" size={20} color="#FFF" />
                                        <Text style={[styles.actionBtnText, { color: '#FFF' }]}>Compartilhar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>
            )}

            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Gerenciar {selectedMember?.nome}</Text>
                        <Text style={styles.modalSubtitle}>Função atual: {selectedMember?.funcao}</Text>

                        {actionLoading ? (
                            <ActivityIndicator size="large" color={themas.colors.primary} />
                        ) : (
                            <>
                                <Text style={styles.sectionHeader}>Alterar Função</Text>
                                <View style={styles.modalOptions}>
                                    {selectedMember?.funcao !== 'ADM' && (
                                        <TouchableOpacity style={styles.modalOption} onPress={() => handleChangeRole('ADM')}>
                                            <MaterialIcons name="security" size={20} color="#4CAF50" />
                                            <Text style={styles.modalOptionText}>Promover a ADM</Text>
                                        </TouchableOpacity>
                                    )}
                                    {selectedMember?.funcao !== 'MEMBRO' && (
                                        <TouchableOpacity style={styles.modalOption} onPress={() => handleChangeRole('MEMBRO')}>
                                            <MaterialIcons name="person" size={20} color="#2D6CF6" />
                                            <Text style={styles.modalOptionText}>Mudar para Membro</Text>
                                        </TouchableOpacity>
                                    )}
                                    {selectedMember?.funcao !== 'AGREGADO' && (
                                        <TouchableOpacity style={styles.modalOption} onPress={() => handleChangeRole('AGREGADO')}>
                                            <MaterialIcons name="hotel" size={20} color="#FF9800" />
                                            <Text style={styles.modalOptionText}>Mudar para Agregado</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <TouchableOpacity style={styles.deleteButton} onPress={handleRemoveMember}>
                                    <MaterialIcons name="person-remove" size={20} color="#FFF" />
                                    <Text style={styles.deleteButtonText}>Remover da República</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F5F7FA" },
    header: { flexDirection: "row", alignItems: "center", padding: 20, backgroundColor: "#FFF" },
    headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10, color: "#333" },

    // Tabs
    tabContainer: { flexDirection: "row", padding: 10, justifyContent: "center", backgroundColor: "#FFF", marginBottom: 10 },
    tabButton: { paddingVertical: 10, paddingHorizontal: 30, borderRadius: 20, marginHorizontal: 5 },
    tabActive: { backgroundColor: themas.colors.primary },
    tabText: { color: "#666", fontWeight: "600" },
    tabTextActive: { color: "#FFF" },

    scrollContent: { padding: 16 },

    // Member Card
    memberCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFF", padding: 15, borderRadius: 12, marginBottom: 10, elevation: 2 },
    memberInfo: { flexDirection: "row", alignItems: "center" },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
    avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: "#E0E0E0", justifyContent: "center", alignItems: "center", marginRight: 15 },
    avatarLetter: { fontSize: 20, fontWeight: "bold", color: "#666" },
    memberName: { fontSize: 16, fontWeight: "bold", color: "#333" },
    memberRole: { fontSize: 12, color: "#666", backgroundColor: "#F0F0F0", alignSelf: "flex-start", paddingHorizontal: 8, borderRadius: 4, marginTop: 4 },

    // Invite Card
    inviteCard: { backgroundColor: "#FFF", padding: 20, borderRadius: 12, elevation: 2 },
    inviteTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
    inviteDesc: { fontSize: 14, color: "#666", marginBottom: 20 },
    configRow: { flexDirection: "row", marginBottom: 15 },
    label: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 5 },
    input: { backgroundColor: "#F5F5F5", borderRadius: 8, padding: 10, borderWidth: 1, borderColor: "#E0E0E0" },

    roleSelector: { flexDirection: "row", gap: 10 },
    roleBtn: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#DDD", flex: 1, alignItems: "center" },
    roleBtnActive: { backgroundColor: themas.colors.primary, borderColor: themas.colors.primary },
    roleBtnText: { color: "#666" },
    roleBtnTextActive: { color: "#FFF", fontWeight: "bold" },

    generateButton: { backgroundColor: themas.colors.primary, padding: 15, borderRadius: 10, alignItems: "center", marginTop: 10 },
    generateButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },

    // Invite Result
    resultContainer: { marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: "#EEE" },
    resultLabel: { fontSize: 14, color: "#333", marginBottom: 5, fontWeight: "bold" },
    linkBox: { backgroundColor: "#F0F0F0", padding: 12, borderRadius: 8, marginBottom: 15 },
    linkText: { color: "#333" },
    shareRow: { flexDirection: 'row', gap: 10 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: themas.colors.primary, gap: 5 },
    actionBtnShare: { backgroundColor: themas.colors.primary },
    actionBtnText: { color: themas.colors.primary, fontWeight: 'bold' },

    // Modal
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", padding: 20 },
    modalContent: { backgroundColor: "#FFF", borderRadius: 12, padding: 20 },
    modalTitle: { fontSize: 18, fontWeight: "bold", textAlign: "center" },
    modalSubtitle: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 20 },
    sectionHeader: { fontSize: 14, fontWeight: "bold", color: "#999", marginBottom: 10, marginTop: 10 },
    modalOptions: { gap: 10 },
    modalOption: { flexDirection: "row", alignItems: "center", padding: 15, backgroundColor: "#F9F9F9", borderRadius: 8, gap: 10 },
    modalOptionText: { fontSize: 16, color: "#333" },
    deleteButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#FF5252", padding: 15, borderRadius: 8, marginTop: 20, gap: 10 },
    deleteButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
    cancelButton: { marginTop: 10, alignItems: "center", padding: 15 },
    cancelButtonText: { color: "#666", fontSize: 16 }
});