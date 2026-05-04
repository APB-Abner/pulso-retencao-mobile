import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { login } from "../services/authService";
import { buscarToken } from "../services/storageService";

export default function LoginScreen() {
    const { logout } = useLocalSearchParams<{ logout?: string }>();
    const [email, setEmail] = useState("consultor@ford.com");
    const [senha, setSenha] = useState("123456");
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState("");
    const [verificandoSessao, setVerificandoSessao] = useState(true);

    useEffect(() => {
        let telaAtiva = true;

        async function verificarSessao() {
            if (logout === "1") {
                setVerificandoSessao(false);
                return;
            }

            const token = await buscarToken();

            if (!telaAtiva) {
                return;
            }

            if (token) {
                router.replace("/consultor");
                return;
            }

            setVerificandoSessao(false);
        }

        verificarSessao();

        return () => {
            telaAtiva = false;
        };
    }, [logout]);

    async function entrar() {
        if (!email.trim() || !senha.trim()) {
            setErro("Informe e-mail e senha.");
            return;
        }

        try {
            setLoading(true);
            setErro("");

            await login(email.trim(), senha);

            router.replace("/consultor");
        } catch (error) {
            console.error(error);
            setErro("Não foi possível entrar. Verifique os dados.");
        } finally {
            setLoading(false);
        }
    }

    if (verificandoSessao) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Verificando sessão...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Pulso de Retenção Ford</Text>
            <Text style={styles.subtitle}>Aplicativo do Consultor</Text>

            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="E-mail"
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        setErro("");
                    }}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    editable={!loading}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Senha"
                    value={senha}
                    onChangeText={(text) => {
                        setSenha(text);
                        setErro("");
                    }}
                    secureTextEntry
                    editable={!loading}
                />

                {erro ? <Text style={styles.errorText}>{erro}</Text> : null}

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={entrar}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.buttonText}>Entrar</Text>
                    )}
                </TouchableOpacity>
            </View>

            <Text style={styles.demoHint}>Demo: consultor@ford.com / 123456</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B1220",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    loadingText: {
        color: "#AAB4C8",
        marginTop: 12,
        fontWeight: "600",
    },
    logo: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "800",
        textAlign: "center",
    },
    subtitle: {
        color: "#AAB4C8",
        fontSize: 16,
        marginTop: 8,
        marginBottom: 32,
    },
    form: {
        width: "100%",
        gap: 12,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: "#D1D5DB",
    },
    errorText: {
        color: "#FCA5A5",
        fontWeight: "700",
    },
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: "100%",
        minHeight: 50,
        justifyContent: "center",
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "800",
        textAlign: "center",
    },
    demoHint: {
        color: "#64748B",
        marginTop: 20,
        fontSize: 12,
    },
});
