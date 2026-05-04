import { StatusMissao } from "../types/missao";

export function formatStatus(status: StatusMissao) {
    const statusMap: Record<StatusMissao, string> = {
        em_risco: "Em risco",
        assumido: "Assumido",
        contato_feito: "Contato feito",
        resposta_recebida: "Resposta recebida",
        agendado: "Agendado",
        recuperado: "Cliente recuperado",
        reprogramar: "Reprogramado",
        perdido: "Cliente perdido",
    };

    return statusMap[status];
}
