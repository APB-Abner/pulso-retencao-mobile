import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function LoginScreen() {
    function entrar() {
        router.replace("/(tabs)");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Ford Service Pulse</Text>
            <Text style={styles.subtitle}>Aplicativo do Consultor</Text>

            <TouchableOpacity style={styles.button} onPress={entrar}>
                <Text style={styles.buttonText}>Entrar como consultor</Text>
            </TouchableOpacity>
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
    logo: {
        color: "#FFFFFF",
        fontSize: 28,
        fontWeight: "700",
        textAlign: "center",
    },
    subtitle: {
        color: "#AAB4C8",
        fontSize: 16,
        marginTop: 8,
        marginBottom: 32,
    },
    button: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        width: "100%",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },
});