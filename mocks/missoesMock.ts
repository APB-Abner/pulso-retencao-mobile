import { Missao } from "../types/missao";

export const missoesMock: Missao[] = [
    {
        id: 1,
        codigoCartao: "CARD-001",
        cliente: {
            id: 101,
            nome: "Mariana Oliveira",
            canalPreferido: "whatsapp",
        },
        veiculo: {
            modelo: "Ford Ka",
            ano: 2020,
            vinSimulado: "9BFZZZ001",
        },
        perfil: "Cliente esquecido",
        risco: "alto",
        score: 87,
        motivoPrincipal: "Cliente está há muitos meses sem retornar para revisão.",
        acaoRecomendada: "Enviar convite personalizado para revisão com prioridade no agendamento.",
        prazo: "Hoje",
        responsavel: "Consultor 01",
        status: "em_risco",
    },
    {
        id: 2,
        codigoCartao: "CARD-002",
        cliente: {
            id: 102,
            nome: "Carlos Mendes",
            canalPreferido: "telefone",
        },
        veiculo: {
            modelo: "Ford EcoSport",
            ano: 2019,
            vinSimulado: "9BFZZZ002",
        },
        perfil: "Cliente econômico",
        risco: "medio",
        score: 64,
        motivoPrincipal: "Cliente costuma comparar preço antes de retornar.",
        acaoRecomendada: "Oferecer explicação clara de valor, segurança e histórico do veículo.",
        prazo: "Amanhã",
        responsavel: "Consultor 01",
        status: "assumido",
    },
];