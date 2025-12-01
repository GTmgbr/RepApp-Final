import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform
} from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { themas } from "../../global/themes";
import { getMeuPerfil, atualizarPerfil } from "../../services/usuarioService";
import { UsuarioUpdateDTO } from "../../types/usuario.types";

export default function Settings() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [nome, setNome] = useState("");
  const [curso, setCurso] = useState("");
  const [universidade, setUniversidade] = useState("");
  const [ano, setAno] = useState("");
  const [fotoUrl, setFotoUrl] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      setLoading(true);
      const usuario = await getMeuPerfil();

      setNome(usuario.nomeCompleto || "");
      setEmail(usuario.email || "");
      setCurso(usuario.curso || "");
      setUniversidade(usuario.universidade || "");
      setAno(usuario.ano ? String(usuario.ano) : "");
      setFotoUrl(usuario.fotoUrl || "");

    } catch (error) {
      console.error("Erro ao carregar perfil", error);
      Alert.alert("Erro", "Não foi possível carregar seus dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvar = async () => {
    if (!nome.trim()) return Alert.alert("Erro", "O nome é obrigatório");

    try {
      setSaving(true);

      const updateData: UsuarioUpdateDTO = {
        nomeCompleto: nome,
        curso,
        universidade,
        ano: ano ? parseInt(ano) : undefined,
        fotoUrl
      };

      const usuarioAtualizado = await atualizarPerfil(updateData);

      const userStored = await AsyncStorage.getItem("@usuario");
      if (userStored) {
        const userObj = JSON.parse(userStored);
        userObj.nome = usuarioAtualizado.nomeCompleto;
        await AsyncStorage.setItem("@usuario", JSON.stringify(userObj));
      }

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar perfil.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const doLogout = async () => {
      await AsyncStorage.multiRemove(["@token", "@usuario", "@repId"]);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" as never }],
      });
    };

    if (Platform.OS === 'web') {
      const confirm = window.confirm("Deseja realmente sair da conta?");
      if (confirm) {
        doLogout();
      }
    } else {
      Alert.alert("Sair", "Deseja realmente sair da conta?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sair",
          style: "destructive",
          onPress: doLogout,
        },
      ]);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={themas.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Foto de Perfil */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {fotoUrl ? (
              <Image source={{ uri: fotoUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <MaterialIcons name="person" size={50} color="#FFF" />
              </View>
            )}
            <TouchableOpacity style={styles.editIcon} onPress={() => Alert.alert("Em breve", "Upload de imagem")}>
              <Feather name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        {/* Formulario */}
        <View style={styles.formSection}>

          <Text style={styles.label}>Nome Completo</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="Seu nome"
          />

          <Text style={styles.label}>Universidade</Text>
          <TextInput
            style={styles.input}
            value={universidade}
            onChangeText={setUniversidade}
            placeholder="Ex: UNIFEI"
          />

          <View style={styles.row}>
            <View style={{ flex: 2, marginRight: 10 }}>
              <Text style={styles.label}>Curso</Text>
              <TextInput
                style={styles.input}
                value={curso}
                onChangeText={setCurso}
                placeholder="Ex: Engenharia"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Ano</Text>
              <TextInput
                style={styles.input}
                value={ano}
                onChangeText={setAno}
                placeholder="2025"
                keyboardType="numeric"
              />
            </View>
          </View>

          <Text style={styles.label}>URL da Foto (Temporário)</Text>
          <TextInput
            style={styles.input}
            value={fotoUrl}
            onChangeText={setFotoUrl}
            placeholder="https://..."
            autoCapitalize="none"
          />

        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.7 }]}
          onPress={handleSalvar}
          disabled={saving}
        >
          {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>Salvar Alterações</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#FF5252" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: "row", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "#F0F0F5" },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 10, color: "#333" },
  scrollContent: { padding: 20 },

  profileSection: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  editIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: themas.colors.primary, padding: 8, borderRadius: 20, borderWidth: 2, borderColor: '#FFF' },
  emailText: { marginTop: 10, color: '#666', fontSize: 14 },

  formSection: { marginBottom: 20 },
  label: { fontSize: 14, color: '#444', marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: 12, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#EEE' },
  row: { flexDirection: 'row' },

  saveButton: { backgroundColor: themas.colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  saveButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },

  logoutButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#FFEBEE', backgroundColor: '#FFF5F5', gap: 10 },
  logoutText: { color: '#FF5252', fontSize: 16, fontWeight: 'bold' }
});