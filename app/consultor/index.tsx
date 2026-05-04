import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { listarMissoes } from "../../services/missaoService";
import { limparSessao } from "../../services/storageService";
import { Missao } from "../../types/missao";
import { formatStatus } from "../../utils/formatStatus";

export default function MissoesScreen() {
  const [missoes, setMissoes] = useState<Missao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarMissoes() {
    try {
      setLoading(true);
      setErro("");

      const dados = await listarMissoes();
      setMissoes(dados);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar as missões.");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarMissoes();
    }, [])
  );

  function getRiskColor(risco: Missao["risco"]) {
    if (risco === "alto") return "#DC2626";
    if (risco === "medio") return "#F59E0B";
    return "#16A34A";
  }

  async function encerrarSessao() {
    try {
      await limparSessao();
      router.replace("/?logout=1");
    } catch (error) {
      console.error(error);

      if (Platform.OS === "web") {
        window.alert("Não foi possível encerrar a sessão. Tente novamente.");
        return;
      }

      Alert.alert(
        "Erro ao sair",
        "Não foi possível encerrar a sessão. Tente novamente."
      );
    }
  }

  async function sair() {
    if (Platform.OS === "web") {
      const confirmou = window.confirm("Deseja encerrar a sessão?");

      if (confirmou) {
        await encerrarSessao();
      }

      return;
    }

    Alert.alert("Sair", "Deseja encerrar a sessão?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await encerrarSessao();
        },
      },
    ]);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Carregando missões...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Ops...</Text>
        <Text style={styles.errorText}>{erro}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={carregarMissoes}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Minhas missões</Text>
          <Text style={styles.subtitle}>
            Missões priorizadas pelo Radar de Retenção
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={sair}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contextCard}>
        <Text style={styles.contextTitle}>Pulso de Retenção Ford</Text>
        <Text style={styles.contextText}>
          Motor calcula risco, Radar prioriza o lead e o consultor registra a
          ação para fechar a Memória de Resultado.
        </Text>
      </View>

      <FlatList
        data={missoes}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>Nenhuma missão encontrada</Text>
            <Text style={styles.emptyText}>
              Quando houver clientes em risco, eles aparecerão aqui.
            </Text>
          </View>
        }
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
              {item.veiculo.modelo} • {item.veiculo.ano} • {item.veiculo.kmAtual.toLocaleString("pt-BR")} km
            </Text>

            <Text style={styles.reason}>{item.motivoPrincipal}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.meta}>Radar {item.prioridadeRadar}</Text>
              <Text style={styles.meta}>Score {item.score}/100</Text>
              <Text style={styles.meta}>{formatStatus(item.status)}</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.status}>Canal: {item.cliente.canalPreferido}</Text>
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
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 4,
  },
  list: {
    gap: 12,
    paddingBottom: 90,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyTitle: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 16,
  },
  emptyText: {
    color: "#6B7280",
    marginTop: 6,
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
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
    alignSelf: "flex-start",
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
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  meta: {
    backgroundColor: "#EEF2FF",
    color: "#3730A3",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: "800",
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
    bottom: 40,
  },
  scanButtonText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "700",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
  },
  logoutButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  logoutText: {
    color: "#111827",
    fontWeight: "800",
    fontSize: 12,
  },
  contextCard: {
    backgroundColor: "#0B1220",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  contextTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginBottom: 4,
  },
  contextText: {
    color: "#CBD5E1",
    lineHeight: 20,
  },
});
