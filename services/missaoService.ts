import { api, USE_MOCK } from "./api";
import { missoesMock } from "../mocks/missoesMock";
import {
    Missao,
    RegistrarAcaoPayload,
    StatusMissao,
} from "../types/missao";

let missoes = [...missoesMock];

export async function listarMissoes(): Promise<Missao[]> {
    if (USE_MOCK) {
        return missoes;
    }

    const response = await api.get<Missao[]>("/missoes", {
        params: {
            responsavel_id: 1,
        },
    });

    return response.data;
}

export async function buscarMissaoPorId(
    id: number
): Promise<Missao | undefined> {
    if (USE_MOCK) {
        return missoes.find((missao) => missao.id === id);
    }

    const response = await api.get<Missao>(`/missoes/${id}`);
    return response.data;
}

export async function buscarMissaoPorCodigoCartao(
    codigoCartao: string
): Promise<Missao | undefined> {
    if (USE_MOCK) {
        return missoes.find(
            (missao) =>
                missao.codigoCartao.toLowerCase() === codigoCartao.toLowerCase().trim()
        );
    }

    try {
        const response = await api.get<Missao>(`/cartoes/${codigoCartao}`);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return undefined;
        }

        throw error;
    }
}

export async function atualizarStatusMissao(
    id: number,
    status: StatusMissao
): Promise<Missao | undefined> {
    if (USE_MOCK) {
        missoes = missoes.map((missao) =>
            missao.id === id ? { ...missao, status } : missao
        );

        return missoes.find((missao) => missao.id === id);
    }

    const response = await api.patch<Missao>(`/missoes/${id}/status`, {
        status,
    });

    return response.data;
}

export async function registrarAcaoMissao(
    id: number,
    payload: RegistrarAcaoPayload
): Promise<void> {
    if (USE_MOCK) {
        const novaAcao = {
            id: Date.now(),
            tipo: payload.tipo,
            canal: payload.canal,
            observacao: payload.observacao || "",
            criadoEm: new Date().toISOString(),
        };

        missoes = missoes.map((missao) =>
            missao.id === id
                ? {
                    ...missao,
                    status: payload.tipo,
                    historico: [novaAcao, ...(missao.historico || [])],
                }
                : missao
        );

        return;
    }

    await api.post(`/missoes/${id}/acoes`, payload);
}