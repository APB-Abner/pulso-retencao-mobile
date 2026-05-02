export type Usuario = {
    id: number;
    nome: string;
    email: string;
};

export type LoginResponse = {
    token: string;
    usuario: Usuario;
};