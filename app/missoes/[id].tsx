import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    atualizarStatusMissao,
    buscarMissaoPorId,
} from "../../services/missaoService";
import { Missao, StatusMissao } from "../../types/missao";

export default function FichaMissaoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [missao, setMissao] = useState<Missao | undefined>();

    useEffect(() => {
        async function carregar() {
            const dados = await buscarMissaoPorId(Number(id));
            setMissao(dados);
        }

        carregar();
    }, [id]);

    async function alterarStatus(status: StatusMissao) {
        if (!missao) return;

        const atualizada = await atualizarStatusMissao(missao.id, status);
        setMissao(atualizada);

        Alert.alert("Ação registrada", `Status atualizado para: ${status}`);
    }

    if (!missao) {
        return (
            <View style={styles.center}>
                <Text>Missão não encontrada.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.back}>← Voltar</Text>
            </TouchableOpacity> */}

            <Text style={styles.title}>{missao.cliente.nome}</Text>
            <Text style={styles.subtitle}>
                {missao.veiculo.modelo} • {missao.veiculo.ano}
            </Text>

            <View style={styles.scoreCard}>
                <Text style={styles.scoreLabel}>Risco de abandono</Text>
                <Text style={styles.score}>{missao.score}</Text>
                <Text style={styles.risk}>{missao.risco.toUpperCase()}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Perfil</Text>
                <Text style={styles.text}>{missao.perfil}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Motivo principal</Text>
                <Text style={styles.text}>{missao.motivoPrincipal}</Text>
            </View>

            <View style={styles.sectionHighlight}>
                <Text style={styles.sectionTitle}>Ação recomendada</Text>
                <Text style={styles.text}>{missao.acaoRecomendada}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Canal sugerido</Text>
                <Text style={styles.text}>{missao.cliente.canalPreferido}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Registrar ação</Text>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => alterarStatus("contato_feito")}
                >
                    <Text style={styles.actionText}>Contato feito</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => alterarStatus("agendado")}
                >
                    <Text style={styles.actionText}>Agendou serviço</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButtonSuccess}
                    onPress={() => alterarStatus("recuperado")}
                >
                    <Text style={styles.actionText}>Cliente recuperado</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButtonDanger}
                    onPress={() => alterarStatus("perdido")}
                >
                    <Text style={styles.actionText}>Cliente perdido</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.currentStatus}>Status atual: {missao.status}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F4F6FA",
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    back: {
        color: "#2563EB",
        fontWeight: "700",
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111827",
    },
    subtitle: {
        color: "#6B7280",
        marginTop: 4,
        marginBottom: 16,
    },
    scoreCard: {
        backgroundColor: "#111827",
        borderRadius: 18,
        padding: 20,
        marginBottom: 16,
    },
    scoreLabel: {
        color: "#CBD5E1",
    },
    score: {
        color: "#FFFFFF",
        fontSize: 48,
        fontWeight: "900",
        marginTop: 6,
    },
    risk: {
        color: "#FCA5A5",
        fontWeight: "800",
    },
    section: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    sectionHighlight: {
        backgroundColor: "#EFF6FF",
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#BFDBFE",
    },
    sectionTitle: {
        color: "#111827",
        fontWeight: "800",
        marginBottom: 8,
    },
    text: {
        color: "#374151",
        lineHeight: 21,
    },
    actionButton: {
        backgroundColor: "#2563EB",
        padding: 14,
        borderRadius: 12,
        marginTop: 8,
    },
    actionButtonSuccess: {
        backgroundColor: "#16A34A",
        padding: 14,
        borderRadius: 12,
        marginTop: 8,
    },
    actionButtonDanger: {
        backgroundColor: "#DC2626",
        padding: 14,
        borderRadius: 12,
        marginTop: 8,
    },
    actionText: {
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "800",
    },
    currentStatus: {
        textAlign: "center",
        color: "#374151",
        fontWeight: "700",
        marginTop: 12,
    },
});