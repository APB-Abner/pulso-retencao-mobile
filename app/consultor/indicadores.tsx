import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { listarMissoes } from "../../services/missaoService";
import { Missao } from "../../types/missao";

export default function IndicadoresScreen() {
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

  const total = missoes.length;
  const altoRisco = missoes.filter((m) => m.risco === "alto").length;
  const contatosFeitos = missoes.filter((m) => m.status === "contato_feito").length;
  const agendados = missoes.filter((m) => m.status === "agendado").length;
  const recuperados = missoes.filter((m) => m.status === "recuperado").length;
  const perdidos = missoes.filter((m) => m.status === "perdido").length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Indicadores</Text>
      <Text style={styles.subtitle}>Resumo das missões do consultor</Text>

      <View style={styles.grid}>
        <IndicatorCard value={total} label="Missões" />
        <IndicatorCard value={altoRisco} label="Alto risco" />
        <IndicatorCard value={contatosFeitos} label="Contatos feitos" />
        <IndicatorCard value={agendados} label="Agendados" />
        <IndicatorCard value={recuperados} label="Recuperados" />
        <IndicatorCard value={perdidos} label="Perdidos" />
      </View>
    </View>
  );
}

function IndicatorCard({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
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
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "47%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  value: {
    fontSize: 32,
    fontWeight: "900",
    color: "#111827",
  },
  label: {
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "600",
  },
});