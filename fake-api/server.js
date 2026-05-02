const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3333;

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
        acaoRecomendada:
            "Enviar convite personalizado para revisão com prioridade no agendamento.",
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
        acaoRecomendada:
            "Oferecer explicação clara de valor, segurança e histórico do veículo.",
        prazo: "Amanhã",
        responsavel: "Consultor 01",
        status: "assumido",
        historico: [],
    },
];

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
    const { tipo, canal, observacao } = req.body;

    const index = missoes.findIndex((item) => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Missão não encontrada",
        });
    }

    const novaAcao = {
        id: Date.now(),
        tipo,
        canal,
        observacao: observacao || "",
        criadoEm: new Date().toISOString(),
    };

    missoes[index] = {
        ...missoes[index],
        status: tipo,
        historico: [novaAcao, ...(missoes[index].historico || [])],
    };

    res.status(201).json(novaAcao);
});

app.get("/indicadores/consultor/:id", (req, res) => {
    const total = missoes.length;
    const altoRisco = missoes.filter((item) => item.risco === "alto").length;
    const contatosFeitos = missoes.filter(
        (item) => item.status === "contato_feito"
    ).length;
    const agendados = missoes.filter((item) => item.status === "agendado").length;
    const recuperados = missoes.filter(
        (item) => item.status === "recuperado"
    ).length;
    const perdidos = missoes.filter((item) => item.status === "perdido").length;

    res.json({
        total,
        altoRisco,
        contatosFeitos,
        agendados,
        recuperados,
        perdidos,
    });
});

app.listen(PORT, () => {
    console.log(`API fake rodando em http://localhost:${PORT}`);
});