# Ford Service Pulse — Aplicativo do Consultor

Aplicativo mobile desenvolvido em React Native com Expo para apoiar consultores no processo de retenção ativa de clientes em risco de abandono.

O app permite visualizar missões de retenção, abrir a ficha do cliente, registrar ações realizadas, consultar histórico, buscar missões por Cartão de Recuperação e acompanhar indicadores do consultor.

## Tecnologias

- React Native
- Expo
- Expo Router
- TypeScript
- Axios
- AsyncStorage
- Expo Camera
- API fake com Express

## Funcionalidades

- Login semi-real com validação de usuário e senha
- Persistência de sessão com AsyncStorage
- Logout com limpeza de sessão
- Lista de missões do consultor
- Ficha detalhada da missão
- Registro de ações e alteração de status
- Campo de observação manual
- Histórico recente de ações
- Busca por código do Cartão de Recuperação
- Leitura de QR Code
- Indicadores do consultor vindos da API

## Credenciais de demonstração

```txt
E-mail: consultor@ford.com
Senha: 123456
````

## Como rodar a API fake

Entre na pasta da API:

```bash
cd fake-api
npm install
npm start
```

A API roda em:

```txt
http://localhost:3333
```

Principais endpoints:

```txt
POST   /auth/login
GET    /missoes
GET    /missoes/:id
GET    /cartoes/:codigo
PATCH  /missoes/:id/status
POST   /missoes/:id/acoes
GET    /indicadores/consultor/:id
```

## Como rodar o app

Na raiz do projeto mobile:

```bash
npm install
npx expo start
```

Para web:

```bash
npx expo start --web
```

## Configuração da API

O arquivo responsável pela conexão é:

```txt
services/api.ts
```

Exemplo:

```ts
export const USE_MOCK = false;

export const api = axios.create({
  baseURL: "http://localhost:3333",
  timeout: 8000,
});
```

Para testar em celular físico, trocar `localhost` pelo IP da máquina:

```txt
http://SEU_IP_LOCAL:3333
```

## Fluxo de demonstração

1. Abrir o aplicativo.
2. Fazer login com o consultor.
3. Visualizar as missões de retenção.
4. Abrir uma missão de alto risco.
5. Inserir uma observação.
6. Registrar uma ação, como "Contato feito" ou "Cliente recuperado".
7. Ver o histórico atualizado.
8. Voltar para a lista e confirmar o novo status.
9. Abrir os indicadores e validar a atualização dos números.
10. Acessar "Ler / digitar cartão".
11. Buscar por `CARD-001` ou escanear QR Code.
12. Abrir a ficha correspondente.

## Relação com a solução

O aplicativo representa a frente mobile da solução Ford Service Pulse. Ele transforma o Cartão de Recuperação em uma ação registrada, permitindo que o consultor execute o contato com o cliente e gere rastreabilidade para os indicadores de retenção.

## Status do MVP

O MVP mobile está funcional com API fake local e pronto para integração com backend real.
