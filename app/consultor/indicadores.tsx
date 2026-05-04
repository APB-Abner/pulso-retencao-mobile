import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { buscarIndicadoresConsultor } from "../../services/indicadorService";
import { buscarUsuario } from "../../services/storageService";
import { IndicadoresConsultor } from "../../types/indicador";

export default function IndicadoresScreen() {
  const [indicadores, setIndicadores] = useState<IndicadoresConsultor | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarIndicadores() {
    try {
      setLoading(true);
      setErro("");

      const usuario = await buscarUsuario();
      const consultorId = usuario?.id ?? 1;

      const dados = await buscarIndicadoresConsultor(consultorId);
      setIndicadores(dados);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar os indicadores.");
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      carregarIndicadores();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Carregando indicadores...</Text>
      </View>
    );
  }

  if (erro || !indicadores) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Ops...</Text>
        <Text style={styles.errorText}>{erro}</Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={carregarIndicadores}
        >
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Indicadores</Text>
      <Text style={styles.subtitle}>
        Resultado das missões executadas pelo consultor
      </Text>

      <View style={styles.highlightCard}>
        <Text style={styles.highlightTitle}>Memória de Resultado</Text>
        <Text style={styles.highlightText}>
          Cada ação registrada alimenta recuperação, agendamento, receita
          potencial e impacto estimado em VIN Share.
        </Text>
      </View>

      <View style={styles.grid}>
        <IndicatorCard value={indicadores.total} label="Missões" />
        <IndicatorCard value={indicadores.altoRisco} label="Alto risco" />
        <IndicatorCard
          value={indicadores.contatosFeitos}
          label="Contatos feitos"
        />
        <IndicatorCard value={indicadores.agendados} label="Agendados" />
        <IndicatorCard value={indicadores.recuperados} label="Recuperados" />
        <IndicatorCard value={indicadores.perdidos} label="Perdidos" />
        <IndicatorCard
          value={`${indicadores.taxaAgendamento}%`}
          label="Taxa de agendamento"
        />
        <IndicatorCard
          value={`${indicadores.taxaRecuperacao}%`}
          label="Taxa de recuperação"
        />
        <IndicatorCard
          value={`+${indicadores.impactoVinShareEstimado.toFixed(1)} p.p.`}
          label="Impacto VIN Share"
        />
        <IndicatorCard
          value={formatCurrency(indicadores.receitaPotencialRecuperada)}
          label="Receita recuperada"
        />
      </View>
    </ScrollView>
  );
}

function IndicatorCard({ value, label }: { value: number | string; label: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
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
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 16,
  },
  highlightCard: {
    backgroundColor: "#0B1220",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  highlightTitle: {
    color: "#FFFFFF",
    fontWeight: "900",
    marginBottom: 4,
  },
  highlightText: {
    color: "#CBD5E1",
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minHeight: 108,
  },
  value: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111827",
  },
  label: {
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "600",
  },
});
