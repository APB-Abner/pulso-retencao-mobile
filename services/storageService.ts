import AsyncStorage from "@react-native-async-storage/async-storage";
import { Usuario } from "../types/usuario";

const TOKEN_KEY = "@pulso_retencao:token";
const USER_KEY = "@pulso_retencao:usuario";
const SESSION_KEYS = [TOKEN_KEY, USER_KEY];

export async function salvarSessao(token: string, usuario: Usuario) {
    await AsyncStorage.multiSet([
        [TOKEN_KEY, token],
        [USER_KEY, JSON.stringify(usuario)],
    ]);
}

export async function buscarToken() {
    return AsyncStorage.getItem(TOKEN_KEY);
}

export async function buscarUsuario(): Promise<Usuario | null> {
    const usuario = await AsyncStorage.getItem(USER_KEY);

    if (!usuario) {
        return null;
    }

    return JSON.parse(usuario);
}

export async function limparSessao() {
    await AsyncStorage.multiRemove(SESSION_KEYS);

    if (typeof window !== "undefined" && window.localStorage) {
        SESSION_KEYS.forEach((key) => {
            window.localStorage.removeItem(key);
        });
    }

    const tokenRestante = await AsyncStorage.getItem(TOKEN_KEY);

    if (tokenRestante) {
        throw new Error("Sessao nao foi encerrada corretamente.");
    }
}
