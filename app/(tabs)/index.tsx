import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { formatStatus } from "../../utils/formatStatus"; 
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { listarMissoes } from "../../services/missaoService";
import { Missao } from "../../types/missao";

export default function MissoesScreen() {
  const [missoes, setMissoes] = useState<Missao[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function carregar() {
        const dados = await listarMissoes();
        setMissoes(dados);
      }

      carregar();
    }, [])
  );

  function getRiskColor(risco: Missao["risco"]) {
    if (risco === "alto") return "#DC2626";
    if (risco === "medio") return "#F59E0B";
    return "#16A34A";
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minhas missões</Text>
      <Text style={styles.subtitle}>Clientes em risco de abandono</Text>

      <FlatList
        data={missoes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/missoes/${item.id}`)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.clientName}>{item.cliente.nome}</Text>

              <View
                style={[
                  styles.riskBadge,
                  { backgroundColor: getRiskColor(item.risco) },
                ]}
              >
                <Text style={styles.riskText}>{item.risco.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.vehicle}>
              {item.veiculo.modelo} • {item.veiculo.ano}
            </Text>

            <Text style={styles.reason}>{item.motivoPrincipal}</Text>

            <View style={styles.footer}>
              <Text style={styles.status}>Status: {formatStatus(item.status)}</Text>
              <Text style={styles.deadline}>Prazo: {item.prazo}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.scanButton}
        onPress={() => router.push("/cartao")}
      >
        <Text style={styles.scanButtonText}>Ler / digitar cartão</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6FA",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 16,
  },
  list: {
    gap: 12,
    paddingBottom: 90,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  clientName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
  },
  riskBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  riskText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  vehicle: {
    color: "#374151",
    marginTop: 6,
    fontWeight: "600",
  },
  reason: {
    color: "#6B7280",
    marginTop: 10,
    lineHeight: 20,
  },
  footer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  status: {
    color: "#374151",
    fontSize: 12,
  },
  deadline: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "700",
  },
  scanButton: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 14,
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
  },
  scanButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
  },
});