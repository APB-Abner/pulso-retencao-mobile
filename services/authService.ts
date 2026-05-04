import { api, USE_MOCK } from "./api";
import { salvarSessao } from "./storageService";
import { LoginResponse } from "../types/usuario";

export async function login(email: string, senha: string) {
    const emailValido = "consultor@ford.com";
    const senhaValida = "123456";

    if (USE_MOCK) {
        if (email !== emailValido || senha !== senhaValida) {
            throw new Error("E-mail ou senha inválidos");
        }

        const response: LoginResponse = {
            token: "mock-token-consultor",
            usuario: {
                id: 1,
                nome: "Consultor 01",
                email,
            },
        };

        await salvarSessao(response.token, response.usuario);
        return response;
    }

    const response = await api.post<LoginResponse>("/auth/login", {
        email,
        senha,
    });

    await salvarSessao(response.data.token, response.data.usuario);

    return response.data;
}
