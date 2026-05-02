import { missoesMock } from "../mocks/missoesMock";
import { Missao, StatusMissao } from "../types/missao";

let missoes = [...missoesMock];

export async function listarMissoes(): Promise<Missao[]> {
    return missoes;
}

export async function buscarMissaoPorId(id: number): Promise<Missao | undefined> {
    return missoes.find((missao) => missao.id === id);
}

export async function atualizarStatusMissao(
    id: number,
    status: StatusMissao
): Promise<Missao | undefined> {
    missoes = missoes.map((missao) =>
        missao.id === id ? { ...missao, status } : missao
    );

    return missoes.find((missao) => missao.id === id);
}