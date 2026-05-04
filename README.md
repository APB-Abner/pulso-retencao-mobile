# Pulso de Retenção Ford - Aplicativo do Consultor

Aplicativo mobile em React Native com Expo para apoiar a execução do Pulso de Retenção Ford.

O app é a interface do consultor: recebe missões priorizadas pelo Radar de Retenção, abre o Cartão de Recuperação, exibe a saída do Motor de Retenção, registra ações e gera Memória de Resultado para indicadores de retenção.

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

- Login de demonstração com persistência de sessão
- Lista de missões priorizadas pelo Radar de Retenção
- Ficha da missão com risco, score, perfil, motivo e ação recomendada
- Visão 360 mínima de cliente e veículo
- Leitura ou digitação do Cartão de Recuperação
- Registro de ações: assumir, contato feito, resposta recebida, agendar, reprogramar, recuperar e perder
- Resultado estruturado com comparecimento, serviço pago, receita estimada e impacto VIN Share
- Histórico recente de ações
- Indicadores de contato, agendamento, recuperação, perda, receita e VIN Share

## Credenciais de demonstração

```txt
E-mail: consultor@ford.com
Senha: 123456
```

## Configuração da API

Copie `.env.example` para `.env` e ajuste conforme o modo da demo.

Para consumir a API fake local:

```txt
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_API_BASE_URL=http://localhost:3333
```

Para celular físico, troque `localhost` pelo IP da máquina na rede local:

```txt
EXPO_PUBLIC_API_BASE_URL=http://SEU_IP_LOCAL:3333
```

Para demo sem backend:

```txt
EXPO_PUBLIC_USE_MOCK=true
```

Se `EXPO_PUBLIC_API_BASE_URL` não estiver configurada, o app usa mock local por segurança.

## Como rodar a API fake

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
GET    /radar/prioridades
GET    /missoes/:id
GET    /cartoes/:codigo
PATCH  /missoes/:id/status
POST   /missoes/:id/acoes
POST   /missoes/:id/resultado
GET    /indicadores/consultor/:id
GET    /indicadores/retencao
```

## Como rodar o app

```bash
npm install
npx expo start
```

Para web:

```bash
npx expo start --web
```

## Fluxo de demonstração

1. Entrar com o consultor.
2. Abrir "Minhas missões" e mostrar que a lista vem do Radar de Retenção.
3. Abrir uma missão de alto risco.
4. Mostrar score, perfil, motivo, ação recomendada e visão 360.
5. Registrar "Assumir missão", "Resposta recebida", "Agendou serviço" ou "Cliente recuperado".
6. Conferir Histórico recente e Memória de Resultado.
7. Voltar para Indicadores e validar taxa, receita e impacto VIN Share.
8. Abrir "Ler / digitar cartão" e buscar por `CARD-001` ou `CARD-002`.

## Relação com a solução

O mobile não é o cérebro da solução. Ele executa o ciclo operacional:

```txt
Motor de Retenção -> Radar de Retenção -> Cartão/Mesa -> App -> Ação -> Resultado -> Indicador
```

Com isso, a previsão de risco deixa de ser apenas um score e vira ação rastreável, resultado mensurável e aprendizado para a próxima priorização.
