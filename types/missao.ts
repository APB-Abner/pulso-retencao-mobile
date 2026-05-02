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

export type Missao = {
    id: number;
    codigoCartao: string;

    cliente: {
        id: number;
        nome: string;
        canalPreferido: "whatsapp" | "telefone" | "email";
    };

    veiculo: {
        modelo: string;
        ano: number;
        vinSimulado: string;
    };

    perfil:
    | "Cliente fiel"
    | "Cliente econômico"
    | "Cliente esquecido"
    | "Cliente de abandono"
    | "Cliente frustrado";

    risco: NivelRisco;
    score: number;
    motivoPrincipal: string;
    acaoRecomendada: string;
    prazo: string;
    responsavel: string;
    status: StatusMissao;
};

export type RegistrarAcaoPayload = {
    tipo: StatusMissao;
    canal: "whatsapp" | "telefone" | "email";
    observacao?: string;
};