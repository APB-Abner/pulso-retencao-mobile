import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { listarMissoes } from "../services/missaoService";

export default function CartaoScreen() {
    const [codigo, setCodigo] = useState("");

    async function buscarCartao() {
        const missoes = await listarMissoes();

        const missao = missoes.find(
            (item) => item.codigoCartao.toLowerCase() === codigo.toLowerCase().trim()
        );

        if (!missao) {
            Alert.alert("Cartão não encontrado", "Verifique o código informado.");
            return;
        }

        router.push(`/missoes/${missao.id}`);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ler cartão</Text>
            <Text style={styles.subtitle}>
                Digite o código do Cartão de Recuperação.
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Ex: CARD-001"
                value={codigo}
                onChangeText={setCodigo}
                autoCapitalize="characters"
            />

            <TouchableOpacity style={styles.button} onPress={buscarCartao}>
                <Text style={styles.buttonText}>Buscar missão</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.back}>Voltar</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F6FA",
        padding: 20,
        justifyContent: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111827",
    },
    subtitle: {
        color: "#6B7280",
        marginTop: 8,
        marginBottom: 20,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#2563EB",
        padding: 14,
        borderRadius: 12,
    },
    buttonText: {
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "800",
    },
    back: {
        color: "#2563EB",
        textAlign: "center",
        marginTop: 20,
        fontWeight: "700",
    },
});