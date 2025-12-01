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
  StyleSheet
} from "react-native";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adicionarDespesa } from "../../services/financeiroService";
import { getMembros } from "../../services/membroService";
import { DespesaRequestDTO, TipoDespesa } from "../../types/financeiro.types";
import { MembroDTO } from "../../types/membro.types";
import { styles } from "./AdicionarDespesaStyles";

export default function AdicionarDespesa() {
  const navigation = useNavigation();

  // Estados do formulário
  const [descricao, setDescricao] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [data, setData] = useState("");
  const [comprovante, setComprovante] = useState("");
  const [loading, setLoading] = useState(false);
  const [tipo, setTipo] = useState<TipoDespesa>("GASTO");

  // Estados para seleção de membros
  const [modalVisible, setModalVisible] = useState(false);
  const [membros, setMembros] = useState<MembroDTO[]>([]);
  const [selecionados, setSelecionados] = useState<number[]>([]);
  const [modoDivisao, setModoDivisao] = useState<"TODOS" | "ADM_MEMBRO" | "MANUAL">("TODOS");

  // Carregar membros ao abrir a tela
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

  // Lógica de seleção rápida
  const selecionarTodos = () => {
    setModoDivisao("TODOS");
    setSelecionados([]); // Backend entende vazio como todos
    setModalVisible(false);
  };

  const selecionarAdmEMembros = () => {
    setModoDivisao("ADM_MEMBRO");
    const filtrados = membros
      .filter(m => m.funcao === "ADM" || m.funcao === "MEMBRO")
      .map(m => m.usuarioId);
    setSelecionados(filtrados);
    setModalVisible(false);
  };

  const toggleSelecaoManual = (id: number) => {
    setModoDivisao("MANUAL");
    setSelecionados(prev => {
      if (prev.includes(id)) return prev.filter(itemId => itemId !== id);
      return [...prev, id];
    });
  };

  // Formatadores e Validadores (Igual ao anterior)
  const formatDateToBackend = (dateStr: string): string => {
    if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) return dateStr;
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const validarCampos = (): boolean => {
    if (!descricao.trim()) { Alert.alert("Erro", "Preencha a descrição"); return false; }
    if (!valorTotal || isNaN(Number(valorTotal.replace(',', '.')))) { Alert.alert("Erro", "Valor inválido"); return false; }
    if (!data.trim()) { Alert.alert("Erro", "Preencha a data"); return false; }

    // Validação extra: Se for manual, tem que ter alguém selecionado
    if (modoDivisao === "MANUAL" && selecionados.length === 0) {
      Alert.alert("Erro", "Selecione pelo menos um morador para dividir.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validarCampos()) return;
    setLoading(true);

    try {
      const repId = await AsyncStorage.getItem("@repId");
      if (!repId) return;

      const despesa: DespesaRequestDTO = {
        descricao: descricao.trim(),
        valorTotal: Number(valorTotal.replace(',', '.')),
        data: formatDateToBackend(data.trim()),
        comprovanteUrl: comprovante.trim() || undefined,
        envolvidosIds: selecionados,
        tipo: tipo
      };

      await adicionarDespesa(Number(repId), despesa);

      Alert.alert("Sucesso", "Despesa adicionada!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (error: any) {
      Alert.alert("Erro", error.response?.data?.message || "Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  };

  // Texto dinâmico para mostrar quem vai pagar
  const getTextoDivisao = () => {
    if (modoDivisao === "TODOS") return "Dividido entre todos os moradores.";
    if (modoDivisao === "ADM_MEMBRO") return `Dividido entre ADMs e Membros (${selecionados.length} pessoas).`;
    return `Dividido entre ${selecionados.length} pessoa(s) selecionada(s).`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nova Despesa</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>

        {/* Campos de Texto (Descrição, Valor, Data) */}
        <View style={{ flexDirection: 'row', backgroundColor: '#F0F0F5', borderRadius: 10, padding: 4, marginBottom: 20 }}>
          <TouchableOpacity
            style={{ flex: 1, padding: 10, borderRadius: 8, backgroundColor: tipo === 'GASTO' ? '#FFF' : 'transparent', alignItems: 'center', elevation: tipo === 'GASTO' ? 2 : 0 }}
            onPress={() => setTipo('GASTO')}
          >
            <Text style={{ fontWeight: 'bold', color: tipo === 'GASTO' ? '#2D6CF6' : '#666' }}>💸 Gasto / Compra</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, padding: 10, borderRadius: 8, backgroundColor: tipo === 'PAGAMENTO' ? '#FFF' : 'transparent', alignItems: 'center', elevation: tipo === 'PAGAMENTO' ? 2 : 0 }}
            onPress={() => setTipo('PAGAMENTO')}
          >
            <Text style={{ fontWeight: 'bold', color: tipo === 'PAGAMENTO' ? '#4CAF50' : '#666' }}>🤝 Pagar Dívida</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} placeholder="Ex: Mercado" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valor (R$) *</Text>
          <TextInput style={styles.input} value={valorTotal} onChangeText={setValorTotal} keyboardType="decimal-pad" placeholder="0.00" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data *</Text>
          <TextInput style={styles.input} value={data} onChangeText={setData} placeholder="dd/mm/aaaa" maxLength={10} />
        </View>

        {/* SELETOR DE PESSOAS */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Quem vai pagar?</Text>
          <TouchableOpacity style={estilosLocais.selectorButton} onPress={() => setModalVisible(true)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcons name="people-outline" size={24} color="#666" />
              <Text style={estilosLocais.selectorText}>{getTextoDivisao()}</Text>
            </View>
            <Feather name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Salvar Despesa</Text>}
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL DE SELEÇÃO */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={estilosLocais.modalContainer}>
          <View style={estilosLocais.modalContent}>
            <Text style={estilosLocais.modalTitle}>Dividir conta com:</Text>

            {/* Opções Rápidas */}
            <View style={estilosLocais.quickActions}>
              <TouchableOpacity style={[estilosLocais.chip, modoDivisao === 'TODOS' && estilosLocais.chipActive]} onPress={selecionarTodos}>
                <Text style={[estilosLocais.chipText, modoDivisao === 'TODOS' && estilosLocais.chipTextActive]}>Todos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[estilosLocais.chip, modoDivisao === 'ADM_MEMBRO' && estilosLocais.chipActive]} onPress={selecionarAdmEMembros}>
                <Text style={[estilosLocais.chipText, modoDivisao === 'ADM_MEMBRO' && estilosLocais.chipTextActive]}>ADM + Membros</Text>
              </TouchableOpacity>
            </View>

            {/* Lista Manual */}
            <FlatList
              data={membros}
              keyExtractor={(item) => String(item.usuarioId)}
              renderItem={({ item }) => {
                const isSelected = selecionados.includes(item.usuarioId) || modoDivisao === "TODOS";
                // Se for TODOS, mostra marcado mas desabilitado visualmente (opcional)
                // Aqui vamos permitir desmarcar para virar MANUAL
                const isChecked = modoDivisao === "TODOS" ? true : selecionados.includes(item.usuarioId);

                return (
                  <TouchableOpacity
                    style={estilosLocais.memberItem}
                    onPress={() => {
                      if (modoDivisao === "TODOS") {
                        // Se estava em todos e clicou em um, vira manual e seleciona só esse ou todos menos esse
                        // Simplificação: Resetar para manual com todos selecionados menos este
                        const allIds = membros.map(m => m.usuarioId).filter(id => id !== item.usuarioId);
                        setSelecionados(allIds);
                        setModoDivisao("MANUAL");
                      } else {
                        toggleSelecaoManual(item.usuarioId);
                      }
                    }}
                  >
                    <Text style={estilosLocais.memberName}>{item.nome} ({item.funcao})</Text>
                    <Ionicons
                      name={isChecked ? "checkbox" : "square-outline"}
                      size={24}
                      color={isChecked ? "#2D6CF6" : "#ccc"}
                    />
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity style={estilosLocais.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={estilosLocais.closeButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos específicos para o modal (adicione isso ao seu arquivo de estilos ou aqui mesmo)
const estilosLocais = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    marginTop: 5,
  },
  selectorText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 14,
    maxWidth: '90%'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'center',
    gap: 10,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2D6CF6',
    backgroundColor: '#FFF',
  },
  chipActive: {
    backgroundColor: '#2D6CF6',
  },
  chipText: {
    color: '#2D6CF6',
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFF',
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  memberName: {
    fontSize: 16,
    color: '#333',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#2D6CF6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});