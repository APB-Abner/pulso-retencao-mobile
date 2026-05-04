import { api, USE_MOCK } from "./api";
import { listarMissoes } from "./missaoService";
import { IndicadoresConsultor } from "../types/indicador";

export async function buscarIndicadoresConsultor(
    consultorId: number
): Promise<IndicadoresConsultor> {
    if (USE_MOCK) {
        const missoes = await listarMissoes();
        const total = missoes.length;
        const contatosFeitos = missoes.filter((m) =>
            [
                "contato_feito",
                "resposta_recebida",
                "agendado",
                "recuperado",
                "perdido",
                "reprogramar",
            ].includes(m.status)
        ).length;
        const agendados = missoes.filter((m) =>
            ["agendado", "recuperado"].includes(m.status)
        ).length;
        const recuperados = missoes.filter((m) => m.status === "recuperado").length;
        const impactoVinShareEstimado = missoes.reduce(
            (totalImpacto, missao) =>
                totalImpacto + (missao.resultado?.impactoVinShare ?? 0),
            0
        );
        const receitaPotencialRecuperada = missoes.reduce((totalReceita, missao) => {
            if (!missao.resultado?.servicoPago) return totalReceita;
            return totalReceita + (missao.resultado.receitaEstimada ?? 0);
        }, 0);

        return {
            total,
            altoRisco: missoes.filter((m) => m.risco === "alto").length,
            contatosFeitos,
            agendados,
            recuperados,
            perdidos: missoes.filter((m) => m.status === "perdido").length,
            taxaRecuperacao: total ? Math.round((recuperados / total) * 100) : 0,
            taxaAgendamento: total ? Math.round((agendados / total) * 100) : 0,
            impactoVinShareEstimado: Number(impactoVinShareEstimado.toFixed(1)),
            receitaPotencialRecuperada,
        };
    }

    const response = await api.get<IndicadoresConsultor>(
        `/indicadores/consultor/${consultorId}`
    );

    return response.data;
}
