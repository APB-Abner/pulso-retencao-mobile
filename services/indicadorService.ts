import { api, USE_MOCK } from "./api";
import { listarMissoes } from "./missaoService";
import { IndicadoresConsultor } from "../types/indicador";

export async function buscarIndicadoresConsultor(
    consultorId: number
): Promise<IndicadoresConsultor> {
    if (USE_MOCK) {
        const missoes = await listarMissoes();

        return {
            total: missoes.length,
            altoRisco: missoes.filter((m) => m.risco === "alto").length,
            contatosFeitos: missoes.filter((m) => m.status === "contato_feito").length,
            agendados: missoes.filter((m) => m.status === "agendado").length,
            recuperados: missoes.filter((m) => m.status === "recuperado").length,
            perdidos: missoes.filter((m) => m.status === "perdido").length,
        };
    }

    const response = await api.get<IndicadoresConsultor>(
        `/indicadores/consultor/${consultorId}`
    );

    return response.data;
}