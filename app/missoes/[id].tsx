import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    buscarMissaoPorId,
    registrarAcaoMissao,
} from "../../services/missaoService";
import { Missao, ResultadoMissao, StatusMissao } from "../../types/missao";
import { formatDateTimeBR } from "../../utils/formatDate";
import { formatStatus } from "../../utils/formatStatus";

export default function FichaMissaoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const [missao, setMissao] = useState<Missao | undefined>();
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState("");
    const [salvandoStatus, setSalvandoStatus] = useState<StatusMissao | null>(
        null
    );
    const [observacao, setObservacao] = useState("");

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

    function montarResultado(status: StatusMissao): Omit<ResultadoMissao, "atualizadoEm"> | undefined {
        if (!missao) return undefined;

        if (status === "agendado") {
            return {
                receitaEstimada: missao.valorPotencial,
                impactoVinShare: missao.impactoVinShareEstimado,
                proximoPasso: "Aguardar comparecimento do cliente.",
            };
        }

        if (status === "recuperado") {
            return {
                compareceu: true,
                servicoPago: true,
                receitaEstimada: missao.valorPotencial,
                impactoVinShare: missao.impactoVinShareEstimado,
                proximoPasso: "Cliente recuperado para a rede Ford.",
            };
        }

        if (status === "perdido") {
            return {
                compareceu: false,
                servicoPago: false,
                receitaEstimada: 0,
                impactoVinShare: 0,
                proximoPasso: "Registrar motivo de perda para aprendizagem do Radar.",
            };
        }

        if (status === "reprogramar") {
            return {
                receitaEstimada: 0,
                impactoVinShare: 0,
                proximoPasso: observacao.trim() || "Novo contato a definir.",
            };
        }

        if (status === "resposta_recebida") {
            return {
                receitaEstimada: 0,
                impactoVinShare: 0,
                proximoPasso: "Converter resposta em agendamento ou reprogramação.",
            };
        }

        return undefined;
    }

    async function alterarStatus(status: StatusMissao) {
        if (!missao || salvandoStatus) return;

        try {
            setSalvandoStatus(status);

            const observacaoFinal = observacao.trim()
                ? observacao.trim()
                : `Ação registrada pelo app do consultor: ${formatStatus(status)}`;

            await registrarAcaoMissao(missao.id, {
                tipo: status,
                canal: missao.cliente.canalPreferido,
                observacao: observacaoFinal,
                resultado: montarResultado(status),
            });

            const atualizada = await buscarMissaoPorId(missao.id);

            if (atualizada) {
                setMissao(atualizada);
            }

            setObservacao("");

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
    const historico = missao.historico ?? [];

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>{missao.cliente.nome}</Text>
            <Text style={styles.subtitle}>
                {missao.veiculo.modelo} • {missao.veiculo.ano} • {missao.codigoCartao}
            </Text>

            <View style={styles.scoreCard}>
                <Text style={styles.scoreLabel}>Risco calculado pelo Motor de Retenção</Text>
                <Text style={styles.score}>{missao.score}</Text>
                <Text style={styles.risk}>
                    {missao.risco.toUpperCase()} • Radar {missao.prioridadeRadar}
                </Text>
                <Text style={styles.scoreHint}>Score de 0 a 100 para risco de abandono.</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Visão 360 cliente e veículo</Text>
                <InfoRow label="Canal preferido" value={missao.cliente.canalPreferido} />
                <InfoRow label="Telefone" value={missao.cliente.telefoneMascarado} />
                <InfoRow label="Cidade" value={missao.cliente.cidade} />
                <InfoRow label="VIN simulado" value={missao.veiculo.vinSimulado} />
                <InfoRow label="KM atual" value={`${missao.veiculo.kmAtual.toLocaleString("pt-BR")} km`} />
                <InfoRow label="Última revisão" value={formatDateBR(missao.veiculo.ultimaRevisao)} />
                <InfoRow label="Dias sem serviço Ford" value={`${missao.veiculo.diasSemServico} dias`} />
                <InfoRow label="Garantia" value={missao.veiculo.statusGarantia} />
                <Text style={styles.textMuted}>{missao.cliente.historicoResumo}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Perfil de retenção</Text>
                <Text style={styles.text}>{missao.perfil}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Sinais do Radar</Text>
                {missao.sinaisRadar.map((sinal) => (
                    <Text key={sinal} style={styles.bulletText}>• {sinal}</Text>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Motivo principal</Text>
                <Text style={styles.text}>{missao.motivoPrincipal}</Text>
            </View>

            <View style={styles.sectionHighlight}>
                <Text style={styles.sectionTitle}>Ação recomendada</Text>
                <Text style={styles.text}>{missao.acaoRecomendada}</Text>
                <Text style={styles.messageLabel}>Mensagem sugerida</Text>
                <Text style={styles.text}>{missao.mensagemSugerida}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Potencial de impacto</Text>
                <InfoRow label="Valor potencial" value={formatCurrency(missao.valorPotencial)} />
                <InfoRow label="Impacto VIN Share" value={`+${missao.impactoVinShareEstimado.toFixed(1)} p.p.`} />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Registrar ação</Text>

                <TextInput
                    style={styles.observationInput}
                    placeholder="Ex: Cliente pediu retorno amanhã às 10h."
                    value={observacao}
                    onChangeText={setObservacao}
                    multiline
                    numberOfLines={3}
                    editable={!estaSalvando}
                    textAlignVertical="top"
                />

                {missao.status === "em_risco" ? (
                    <ActionButton
                        label="Assumir missão"
                        status="assumido"
                        loadingStatus={salvandoStatus}
                        disabled={estaSalvando}
                        onPress={alterarStatus}
                        variant="secondary"
                    />
                ) : null}

                <ActionButton
                    label="Contato feito"
                    status="contato_feito"
                    loadingStatus={salvandoStatus}
                    disabled={estaSalvando}
                    onPress={alterarStatus}
                />

                <ActionButton
                    label="Resposta recebida"
                    status="resposta_recebida"
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
                    label="Reprogramar"
                    status="reprogramar"
                    loadingStatus={salvandoStatus}
                    disabled={estaSalvando}
                    onPress={alterarStatus}
                    variant="warning"
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
                <Text style={styles.sectionTitle}>Memória de Resultado</Text>
                {missao.resultado ? (
                    <>
                        <InfoRow label="Compareceu" value={formatBoolean(missao.resultado.compareceu)} />
                        <InfoRow label="Serviço pago" value={formatBoolean(missao.resultado.servicoPago)} />
                        <InfoRow
                            label="Receita estimada"
                            value={formatCurrency(missao.resultado.receitaEstimada ?? 0)}
                        />
                        <InfoRow
                            label="Impacto VIN Share"
                            value={`+${(missao.resultado.impactoVinShare ?? 0).toFixed(1)} p.p.`}
                        />
                        <InfoRow label="Próximo passo" value={missao.resultado.proximoPasso ?? "-"} />
                        <InfoRow
                            label="Atualizado"
                            value={formatDateTimeBR(missao.resultado.atualizadoEm)}
                        />
                    </>
                ) : (
                    <Text style={styles.emptyHistory}>
                        Ainda sem desfecho estruturado para esta missão.
                    </Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Histórico recente</Text>

                {historico.length > 0 ? (
                    <>
                        {historico.slice(0, 3).map((acao) => (
                            <View key={acao.id} style={styles.historyItem}>
                                <View style={styles.historyHeader}>
                                    <Text style={styles.historyTitle}>
                                        {formatStatus(acao.tipo)}
                                    </Text>

                                    <Text style={styles.historyDate}>
                                        {formatDateTimeBR(acao.criadoEm)}
                                    </Text>
                                </View>

                                <Text style={styles.historyText}>Canal: {acao.canal}</Text>

                                {acao.observacao ? (
                                    <Text style={styles.historyObservation}>
                                        {acao.observacao}
                                    </Text>
                                ) : null}

                                {acao.resultado?.proximoPasso ? (
                                    <Text style={styles.historyObservation}>
                                        Próximo passo: {acao.resultado.proximoPasso}
                                    </Text>
                                ) : null}
                            </View>
                        ))}

                        {historico.length > 3 ? (
                            <Text style={styles.historyLimitText}>
                                Exibindo as 3 ações mais recentes.
                            </Text>
                        ) : null}
                    </>
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

type InfoRowProps = {
    label: string;
    value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
    return (
        <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    );
}

type ActionButtonProps = {
    label: string;
    status: StatusMissao;
    loadingStatus: StatusMissao | null;
    disabled: boolean;
    onPress: (status: StatusMissao) => void;
    variant?: "default" | "secondary" | "success" | "warning" | "danger";
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
                : variant === "warning"
                    ? styles.actionButtonWarning
                    : variant === "secondary"
                        ? styles.actionButtonSecondary
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

function formatBoolean(value?: boolean) {
    if (value === undefined) return "-";
    return value ? "Sim" : "Não";
}

function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

function formatDateBR(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("pt-BR").format(date);
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
        borderRadius: 12,
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
    scoreHint: {
        color: "#CBD5E1",
        marginTop: 8,
        lineHeight: 20,
    },
    section: {
        backgroundColor: "#FFFFFF",
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#E5E7EB",
    },
    sectionHighlight: {
        backgroundColor: "#EFF6FF",
        padding: 16,
        borderRadius: 12,
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
    textMuted: {
        color: "#6B7280",
        lineHeight: 20,
        marginTop: 10,
    },
    bulletText: {
        color: "#374151",
        lineHeight: 22,
    },
    messageLabel: {
        color: "#1D4ED8",
        fontWeight: "800",
        marginTop: 12,
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
        paddingVertical: 7,
    },
    infoLabel: {
        color: "#6B7280",
        flex: 1,
        fontSize: 13,
    },
    infoValue: {
        color: "#111827",
        flex: 1,
        fontSize: 13,
        fontWeight: "700",
        textAlign: "right",
    },
    actionButton: {
        backgroundColor: "#2563EB",
        padding: 14,
        borderRadius: 12,
        marginTop: 8,
        minHeight: 48,
        justifyContent: "center",
    },
    actionButtonSecondary: {
        backgroundColor: "#111827",
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
    actionButtonWarning: {
        backgroundColor: "#D97706",
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
    observationInput: {
        backgroundColor: "#F9FAFB",
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: "#D1D5DB",
        minHeight: 82,
        marginBottom: 8,
        color: "#111827",
    },
    historyLimitText: {
        color: "#6B7280",
        fontSize: 12,
        fontWeight: "600",
        marginTop: 12,
        textAlign: "center",
    },
});
