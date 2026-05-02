import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { buscarMissaoPorCodigoCartao } from "../services/missaoService";

export default function CartaoScreen() {
    const [codigo, setCodigo] = useState("");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");

    async function buscarCartao() {
        const codigoLimpo = codigo.trim();

        if (!codigoLimpo) {
            setErro("Informe o código do cartão.");
            return;
        }

        try {
            setLoading(true);
            setErro("");

            const missao = await buscarMissaoPorCodigoCartao(codigoLimpo);

            if (!missao) {
                setErro("Cartão não encontrado. Verifique o código informado.");
                return;
            }

            router.push(`/missoes/${missao.id}`);
        } catch (error) {
            console.error(error);
            Alert.alert(
                "Erro ao buscar cartão",
                "Não foi possível consultar o cartão agora."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ler cartão</Text>
            <Text style={styles.subtitle}>
                Digite o código do Cartão de Recuperação.
            </Text>

            <TextInput
                style={[styles.input, erro ? styles.inputError : null]}
                placeholder="Ex: CARD-001"
                value={codigo}
                onChangeText={(text) => {
                    setCodigo(text);
                    setErro("");
                }}
                autoCapitalize="characters"
                editable={!loading}
            />

            {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={buscarCartao}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                ) : (
                    <Text style={styles.buttonText}>Buscar missão</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity disabled={loading} onPress={() => router.back()}>
                <Text style={[styles.back, loading && styles.backDisabled]}>Voltar</Text>
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
        marginBottom: 8,
    },
    inputError: {
        borderColor: "#DC2626",
    },
    errorText: {
        color: "#DC2626",
        fontWeight: "600",
        marginBottom: 12,
    },
    button: {
        backgroundColor: "#2563EB",
        padding: 14,
        borderRadius: 12,
        minHeight: 48,
        justifyContent: "center",
    },
    buttonDisabled: {
        opacity: 0.7,
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
    backDisabled: {
        opacity: 0.5,
    },
});