import { Missao } from "../types/missao";

export const missoesMock: Missao[] = [
    {
        id: 1,
        codigoCartao: "CARD-001",
        cliente: {
            id: 101,
            nome: "Mariana Oliveira",
            canalPreferido: "whatsapp",
            telefoneMascarado: "(11) 9****-1024",
            cidade: "São Bernardo do Campo, SP",
            historicoResumo:
                "Fez revisões na concessionária até 2023, depois migrou para oficinas independentes.",
        },
        veiculo: {
            modelo: "Ford Ka",
            ano: 2020,
            vinSimulado: "9BFZZZ001",
            kmAtual: 48200,
            ultimaRevisao: "2023-11-18",
            diasSemServico: 534,
            statusGarantia: "Garantia expirada",
        },
        perfil: "Cliente esquecido",
        risco: "alto",
        score: 87,
        prioridadeRadar: "P1",
        sinaisRadar: [
            "Mais de 12 meses sem revisão",
            "Alta chance de evasão para oficina independente",
            "Cartão de Recuperação emitido pela Mesa",
        ],
        motivoPrincipal: "Cliente está há muitos meses sem retornar para revisão.",
        acaoRecomendada:
            "Enviar convite personalizado para revisão com prioridade no agendamento.",
        mensagemSugerida:
            "Mariana, identificamos que seu Ford Ka está com uma revisão importante pendente. Posso reservar um horário prioritário para você?",
        valorPotencial: 980,
        impactoVinShareEstimado: 0.8,
        prazo: "Hoje",
        responsavel: "Consultor 01",
        status: "em_risco",
        historico: [],
    },
    {
        id: 2,
        codigoCartao: "CARD-002",
        cliente: {
            id: 102,
            nome: "Carlos Mendes",
            canalPreferido: "telefone",
            telefoneMascarado: "(11) 3***-8842",
            cidade: "Santo André, SP",
            historicoResumo:
                "Cliente compara orçamento, mas costuma retornar quando recebe explicação clara de valor e segurança.",
        },
        veiculo: {
            modelo: "Ford EcoSport",
            ano: 2019,
            vinSimulado: "9BFZZZ002",
            kmAtual: 67200,
            ultimaRevisao: "2024-02-03",
            diasSemServico: 456,
            statusGarantia: "Garantia expirada",
        },
        perfil: "Cliente econômico",
        risco: "medio",
        score: 64,
        prioridadeRadar: "P2",
        sinaisRadar: [
            "Sensível a preço",
            "Histórico de retorno após contato consultivo",
            "Revisão preventiva com valor potencial médio",
        ],
        motivoPrincipal: "Cliente costuma comparar preço antes de retornar.",
        acaoRecomendada:
            "Oferecer explicação clara de valor, segurança e histórico do veículo.",
        mensagemSugerida:
            "Carlos, revisei o histórico do seu EcoSport e consigo te mostrar uma opção de manutenção preventiva com previsibilidade de custo.",
        valorPotencial: 760,
        impactoVinShareEstimado: 0.5,
        prazo: "Amanhã",
        responsavel: "Consultor 01",
        status: "assumido",
        historico: [],
    },
];
