import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
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
    const [modoCamera, setModoCamera] = useState(false);
    const [jaEscaneou, setJaEscaneou] = useState(false);

    const [permission, requestPermission] = useCameraPermissions();

    async function abrirCamera() {
        setErro("");

        if (Platform.OS === "web") {
            setModoCamera(true);
            return;
        }

        if (!permission?.granted) {
            const resposta = await requestPermission();

            if (!resposta.granted) {
                setErro("Permissão de câmera negada.");
                return;
            }
        }

        setJaEscaneou(false);
        setModoCamera(true);
    }

    async function buscarCartao(codigoRecebido?: string) {
        const codigoLimpo = (codigoRecebido ?? codigo).trim();

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
                setModoCamera(false);
                setJaEscaneou(false);
                return;
            }

            setModoCamera(false);
            router.push(`/missoes/${missao.id}`);
        } catch (error) {
            console.error(error);
            Alert.alert(
                "Erro ao buscar cartão",
                "Não foi possível consultar o cartão agora."
            );
            setJaEscaneou(false);
        } finally {
            setLoading(false);
        }
    }

    async function aoEscanearCodigo(resultado: { data: string }) {
        if (jaEscaneou || loading) return;

        setJaEscaneou(true);

        const codigoLido = resultado.data.trim();
        setCodigo(codigoLido);

        await buscarCartao(codigoLido);
    }

    if (modoCamera) {
        return (
            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    barcodeScannerSettings={{
                        barcodeTypes: ["qr", "code128", "ean13"],
                    }}
                    onBarcodeScanned={jaEscaneou ? undefined : aoEscanearCodigo}
                />

                <View style={styles.cameraOverlay}>
                    <Text style={styles.cameraTitle}>Aponte para o QR Code</Text>
                    <Text style={styles.cameraSubtitle}>
                        O código do cartão será lido automaticamente.
                    </Text>

                    <View style={styles.scanFrame} />

                    {loading ? (
                        <View style={styles.loadingCard}>
                            <ActivityIndicator color="#FFFFFF" />
                            <Text style={styles.loadingCardText}>Buscando missão...</Text>
                        </View>
                    ) : null}

                    <TouchableOpacity
                        style={styles.closeCameraButton}
                        onPress={() => {
                            setModoCamera(false);
                            setJaEscaneou(false);
                        }}
                    >
                        <Text style={styles.closeCameraText}>Digitar manualmente</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ler cartão</Text>
            <Text style={styles.subtitle}>
                Escaneie ou digite o código do Cartão de Recuperação.
            </Text>

            <TouchableOpacity
                style={styles.qrButton}
                onPress={abrirCamera}
                disabled={loading}
            >
                <Text style={styles.qrButtonText}>Escanear QR Code</Text>
            </TouchableOpacity>

            <View style={styles.separator}>
                <View style={styles.line} />
                <Text style={styles.separatorText}>ou</Text>
                <View style={styles.line} />
            </View>

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
                onPress={() => buscarCartao()}
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
    qrButton: {
        backgroundColor: "#111827",
        padding: 14,
        borderRadius: 12,
        marginBottom: 18,
    },
    qrButtonText: {
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "800",
    },
    separator: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 18,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#D1D5DB",
    },
    separatorText: {
        color: "#6B7280",
        fontWeight: "700",
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
    cameraContainer: {
        flex: 1,
        backgroundColor: "#000000",
    },
    camera: {
        flex: 1,
    },
    cameraOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "rgba(0, 0, 0, 0.25)",
    },
    cameraTitle: {
        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "900",
        textAlign: "center",
    },
    cameraSubtitle: {
        color: "#E5E7EB",
        marginTop: 8,
        textAlign: "center",
        marginBottom: 28,
    },
    scanFrame: {
        width: 220,
        height: 220,
        borderWidth: 3,
        borderColor: "#FFFFFF",
        borderRadius: 20,
        backgroundColor: "transparent",
    },
    loadingCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        padding: 12,
        borderRadius: 12,
        marginTop: 20,
    },
    loadingCardText: {
        color: "#FFFFFF",
        fontWeight: "700",
    },
    closeCameraButton: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 999,
        marginTop: 28,
    },
    closeCameraText: {
        color: "#111827",
        fontWeight: "800",
    },
});