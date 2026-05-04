export type NivelRisco = "baixo" | "medio" | "alto";

export type StatusMissao =
    | "em_risco"
    | "assumido"
    | "contato_feito"
    | "resposta_recebida"
    | "agendado"
    | "recuperado"
    | "reprogramar"
    | "perdido";

export type CanalContato = "whatsapp" | "telefone" | "email";

export type ResultadoMissao = {
    compareceu?: boolean;
    servicoPago?: boolean;
    receitaEstimada?: number;
    impactoVinShare?: number;
    proximoPasso?: string;
    atualizadoEm: string;
};

export type Missao = {
    id: number;
    codigoCartao: string;

    cliente: {
        id: number;
        nome: string;
        canalPreferido: CanalContato;
        telefoneMascarado: string;
        cidade: string;
        historicoResumo: string;
    };

    veiculo: {
        modelo: string;
        ano: number;
        vinSimulado: string;
        kmAtual: number;
        ultimaRevisao: string;
        diasSemServico: number;
        statusGarantia: "Dentro da garantia" | "Garantia expirada" | "Garantia a vencer";
    };

    perfil:
    | "Cliente fiel"
    | "Cliente econômico"
    | "Cliente esquecido"
    | "Cliente de abandono"
    | "Cliente frustrado";

    risco: NivelRisco;
    score: number;
    prioridadeRadar: "P1" | "P2" | "P3";
    sinaisRadar: string[];
    motivoPrincipal: string;
    acaoRecomendada: string;
    mensagemSugerida: string;
    valorPotencial: number;
    impactoVinShareEstimado: number;
    prazo: string;
    responsavel: string;
    status: StatusMissao;
    resultado?: ResultadoMissao;
    historico?: HistoricoAcao[];
};

export type RegistrarAcaoPayload = {
    tipo: StatusMissao;
    canal: CanalContato;
    observacao?: string;
    resultado?: Omit<ResultadoMissao, "atualizadoEm">;
};

export type HistoricoAcao = {
    id: number;
    tipo: StatusMissao;
    canal: CanalContato;
    observacao?: string;
    resultado?: ResultadoMissao;
    criadoEm: string;
};
