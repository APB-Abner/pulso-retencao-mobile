const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3333;

const STATUS_VALIDOS = new Set([
    "em_risco",
    "assumido",
    "contato_feito",
    "resposta_recebida",
    "agendado",
    "recuperado",
    "reprogramar",
    "perdido",
]);

const CANAIS_VALIDOS = new Set(["whatsapp", "telefone", "email"]);

app.use(cors());
app.use(express.json());

let missoes = [
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

function prioridadeValor(missao) {
    const prioridade = { P1: 1, P2: 2, P3: 3 };
    return prioridade[missao.prioridadeRadar] ?? 99;
}

function montarResultado(tipo, missao, resultadoPayload = {}, observacao = "") {
    const atualizadoEm = new Date().toISOString();

    if (Object.keys(resultadoPayload).length > 0) {
        return {
            ...resultadoPayload,
            atualizadoEm,
        };
    }

    if (tipo === "agendado") {
        return {
            receitaEstimada: missao.valorPotencial,
            impactoVinShare: missao.impactoVinShareEstimado,
            proximoPasso: "Aguardar comparecimento do cliente.",
            atualizadoEm,
        };
    }

    if (tipo === "recuperado") {
        return {
            compareceu: true,
            servicoPago: true,
            receitaEstimada: missao.valorPotencial,
            impactoVinShare: missao.impactoVinShareEstimado,
            proximoPasso: "Cliente recuperado para a rede Ford.",
            atualizadoEm,
        };
    }

    if (tipo === "perdido") {
        return {
            compareceu: false,
            servicoPago: false,
            receitaEstimada: 0,
            impactoVinShare: 0,
            proximoPasso: "Registrar motivo de perda para aprendizagem do Radar.",
            atualizadoEm,
        };
    }

    if (tipo === "reprogramar") {
        return {
            receitaEstimada: 0,
            impactoVinShare: 0,
            proximoPasso: observacao || "Novo contato a definir.",
            atualizadoEm,
        };
    }

    if (tipo === "resposta_recebida") {
        return {
            receitaEstimada: 0,
            impactoVinShare: 0,
            proximoPasso: "Converter resposta em agendamento ou reprogramação.",
            atualizadoEm,
        };
    }

    return undefined;
}

function calcularIndicadores() {
    const total = missoes.length;
    const altoRisco = missoes.filter((item) => item.risco === "alto").length;
    const contatosFeitos = missoes.filter((item) =>
        ["contato_feito", "resposta_recebida", "agendado", "recuperado", "perdido", "reprogramar"].includes(item.status)
    ).length;
    const agendados = missoes.filter((item) =>
        ["agendado", "recuperado"].includes(item.status)
    ).length;
    const recuperados = missoes.filter((item) => item.status === "recuperado").length;
    const perdidos = missoes.filter((item) => item.status === "perdido").length;
    const impactoVinShareEstimado = missoes.reduce(
        (totalImpacto, item) => totalImpacto + (item.resultado?.impactoVinShare ?? 0),
        0
    );
    const receitaPotencialRecuperada = missoes.reduce((totalReceita, item) => {
        if (!item.resultado?.servicoPago) return totalReceita;
        return totalReceita + (item.resultado.receitaEstimada ?? 0);
    }, 0);

    return {
        total,
        altoRisco,
        contatosFeitos,
        agendados,
        recuperados,
        perdidos,
        taxaRecuperacao: total ? Math.round((recuperados / total) * 100) : 0,
        taxaAgendamento: total ? Math.round((agendados / total) * 100) : 0,
        impactoVinShareEstimado: Number(impactoVinShareEstimado.toFixed(1)),
        receitaPotencialRecuperada,
    };
}

app.get("/", (req, res) => {
    res.json({
        message: "API fake do Pulso de Retenção ativa",
    });
});

app.post("/auth/login", (req, res) => {
    const { email, senha } = req.body;

    const emailValido = "consultor@ford.com";
    const senhaValida = "123456";

    if (email !== emailValido || senha !== senhaValida) {
        return res.status(401).json({
            message: "E-mail ou senha inválidos",
        });
    }

    res.json({
        token: "fake-token-consultor",
        usuario: {
            id: 1,
            nome: "Consultor 01",
            email: emailValido,
        },
    });
});

app.get("/missoes", (req, res) => {
    res.json(missoes);
});

app.get("/radar/prioridades", (req, res) => {
    const prioridades = [...missoes].sort((a, b) => {
        const prioridade = prioridadeValor(a) - prioridadeValor(b);

        if (prioridade !== 0) {
            return prioridade;
        }

        return b.score - a.score;
    });

    res.json(prioridades);
});

app.get("/missoes/:id", (req, res) => {
    const id = Number(req.params.id);
    const missao = missoes.find((item) => item.id === id);

    if (!missao) {
        return res.status(404).json({
            message: "Missão não encontrada",
        });
    }

    res.json(missao);
});

app.get("/cartoes/:codigo", (req, res) => {
    const codigo = req.params.codigo.toLowerCase();

    const missao = missoes.find(
        (item) => item.codigoCartao.toLowerCase() === codigo
    );

    if (!missao) {
        return res.status(404).json({
            message: "Cartão não encontrado",
        });
    }

    res.json(missao);
});

app.patch("/missoes/:id/status", (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!STATUS_VALIDOS.has(status)) {
        return res.status(400).json({
            message: "Status inválido",
        });
    }

    const index = missoes.findIndex((item) => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Missão não encontrada",
        });
    }

    missoes[index] = {
        ...missoes[index],
        status,
    };

    res.json(missoes[index]);
});

app.post("/missoes/:id/acoes", (req, res) => {
    const id = Number(req.params.id);
    const { tipo, canal, observacao, resultado } = req.body;

    if (!STATUS_VALIDOS.has(tipo)) {
        return res.status(400).json({
            message: "Tipo de ação inválido",
        });
    }

    if (!CANAIS_VALIDOS.has(canal)) {
        return res.status(400).json({
            message: "Canal inválido",
        });
    }

    const index = missoes.findIndex((item) => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Missão não encontrada",
        });
    }

    const resultadoEstruturado = montarResultado(
        tipo,
        missoes[index],
        resultado,
        observacao
    );

    const novaAcao = {
        id: Date.now(),
        tipo,
        canal,
        observacao: observacao || "",
        resultado: resultadoEstruturado,
        criadoEm: new Date().toISOString(),
    };

    missoes[index] = {
        ...missoes[index],
        status: tipo,
        ...(resultadoEstruturado ? { resultado: resultadoEstruturado } : {}),
        historico: [novaAcao, ...(missoes[index].historico || [])],
    };

    res.status(201).json(novaAcao);
});

app.post("/missoes/:id/resultado", (req, res) => {
    const id = Number(req.params.id);
    const { status = "recuperado", resultado } = req.body;

    if (!STATUS_VALIDOS.has(status)) {
        return res.status(400).json({
            message: "Status inválido",
        });
    }

    const index = missoes.findIndex((item) => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Missão não encontrada",
        });
    }

    const resultadoEstruturado = montarResultado(
        status,
        missoes[index],
        resultado
    );

    missoes[index] = {
        ...missoes[index],
        status,
        ...(resultadoEstruturado ? { resultado: resultadoEstruturado } : {}),
    };

    res.status(201).json(missoes[index]);
});

app.get("/indicadores/consultor/:id", (req, res) => {
    res.json(calcularIndicadores());
});

app.get("/indicadores/retencao", (req, res) => {
    res.json(calcularIndicadores());
});

app.listen(PORT, () => {
    console.log(`API fake rodando em http://localhost:${PORT}`);
});
