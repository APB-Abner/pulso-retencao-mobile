import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    buscarMissaoPorId,
    registrarAcaoMissao,
} from "../../services/missaoService";
import { formatDateTimeBR } from "../../utils/formatDate";
import { Missao, StatusMissao } from "../../types/missao";
import { formatStatus } from "../../utils/formatStatus";

export default function FichaMissaoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [missao, setMissao] = useState<Missao | undefined>();
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [salvandoStatus, setSalvandoStatus] = useState<StatusMissao | null>(
        null
    );

    async function carregarMissao() {
        try {
            setLoading(true);
            setErro("");

            const dados = await buscarMissaoPorId(Number(id));

            if (!dados) {
                setErro("Missão não encontrada.");
                return;
            }

            setMissao(dados);
        } catch (error) {
            console.error(error);
            setErro("Não foi possível carregar a missão.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarMissao();
    }, [id]);

    async function alterarStatus(status: StatusMissao) {
        if (!missao || salvandoStatus) return;

        try {
            setSalvandoStatus(status);

            await registrarAcaoMissao(missao.id, {
                tipo: status,
                canal: missao.cliente.canalPreferido,
                observacao: `Ação registrada pelo app do consultor: ${formatStatus(status)}`,
            });

            const atualizada = await buscarMissaoPorId(missao.id);

            if (atualizada) {
                setMissao(atualizada);
            }

            Alert.alert(
                "Ação registrada",
                `Status atualizado para: ${formatStatus(status)}`
            );
        } catch (error) {
            console.error(error);
            Alert.alert(
                "Erro ao registrar ação",
                "Não foi possível atualizar o status da missão."
            );
        } finally {
            setSalvandoStatus(null);
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Carregando missão...</Text>
            </View>
        );
    }

    if (erro || !missao) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorTitle}>Ops...</Text>
                <Text style={styles.errorText}>
                    {erro || "Missão não encontrada."}
                </Text>

                <TouchableOpacity style={styles.retryButton} onPress={carregarMissao}>
                    <Text style={styles.retryButtonText}>Tentar novamente</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const estaSalvando = salvandoStatus !== null;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
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

                <ActionButton
                    label="Contato feito"
                    status="contato_feito"
                    loadingStatus={salvandoStatus}
                    disabled={estaSalvando}
                    onPress={alterarStatus}
                />

                <ActionButton
                    label="Agendou serviço"
                    status="agendado"
                    loadingStatus={salvandoStatus}
                    disabled={estaSalvando}
                    onPress={alterarStatus}
                />

                <ActionButton
                    label="Cliente recuperado"
                    status="recuperado"
                    loadingStatus={salvandoStatus}
                    disabled={estaSalvando}
                    onPress={alterarStatus}
                    variant="success"
                />

                <ActionButton
                    label="Cliente perdido"
                    status="perdido"
                    loadingStatus={salvandoStatus}
                    disabled={estaSalvando}
                    onPress={alterarStatus}
                    variant="danger"
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Histórico recente</Text>

                {missao.historico && missao.historico.length > 0 ? (
                    missao.historico.map((acao) => (
                        <View key={acao.id} style={styles.historyItem}>
                            <View style={styles.historyHeader}>
                                <Text style={styles.historyTitle}>{formatStatus(acao.tipo)}</Text>
                                <Text style={styles.historyDate}>
                                    {formatDateTimeBR(acao.criadoEm)}
                                </Text>
                            </View>

                            <Text style={styles.historyText}>Canal: {acao.canal}</Text>

                            {acao.observacao ? (
                                <Text style={styles.historyObservation}>{acao.observacao}</Text>
                            ) : null}
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyHistory}>
                        Nenhuma ação registrada ainda.
                    </Text>
                )}
            </View>

            <Text style={styles.currentStatus}>
                Status atual: {formatStatus(missao.status)}
            </Text>
        </ScrollView>
    );
}

type ActionButtonProps = {
    label: string;
    status: StatusMissao;
    loadingStatus: StatusMissao | null;
    disabled: boolean;
    onPress: (status: StatusMissao) => void;
    variant?: "default" | "success" | "danger";
};

function ActionButton({
    label,
    status,
    loadingStatus,
    disabled,
    onPress,
    variant = "default",
}: ActionButtonProps) {
    const isLoading = loadingStatus === status;

    const buttonStyle =
        variant === "success"
            ? styles.actionButtonSuccess
            : variant === "danger"
                ? styles.actionButtonDanger
                : styles.actionButton;

    return (
        <TouchableOpacity
            style={[buttonStyle, disabled && styles.actionButtonDisabled]}
            disabled={disabled}
            onPress={() => onPress(status)}
        >
            {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
            ) : (
                <Text style={styles.actionText}>{label}</Text>
            )}
        </TouchableOpacity>
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
        backgroundColor: "#F4F6FA",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    loadingText: {
        color: "#6B7280",
        marginTop: 12,
        fontWeight: "600",
    },
    errorTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#111827",
        marginBottom: 8,
    },
    errorText: {
        color: "#6B7280",
        textAlign: "center",
        marginBottom: 18,
    },
    retryButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
    },
    retryButtonText: {
        color: "#FFFFFF",
        fontWeight: "800",
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
        minHeight: 48,
        justifyContent: "center",
    },
    actionButtonSuccess: {
        backgroundColor: "#16A34A",
        padding: 14,
        borderRadius: 12,
        marginTop: 8,
        minHeight: 48,
        justifyContent: "center",
    },
    actionButtonDanger: {
        backgroundColor: "#DC2626",
        padding: 14,
        borderRadius: 12,
        marginTop: 8,
        minHeight: 48,
        justifyContent: "center",
    },
    actionButtonDisabled: {
        opacity: 0.7,
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
    historyItem: {
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingTop: 12,
        marginTop: 12,
    },
    historyHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 6,
    },
    historyTitle: {
        color: "#111827",
        fontWeight: "800",
        flex: 1,
    },
    historyDate: {
        color: "#6B7280",
        fontSize: 12,
        fontWeight: "600",
    },
    historyText: {
        color: "#374151",
        fontSize: 13,
        marginBottom: 4,
    },
    historyObservation: {
        color: "#6B7280",
        fontSize: 13,
        lineHeight: 19,
    },
    emptyHistory: {
        color: "#6B7280",
        fontStyle: "italic",
    },
});