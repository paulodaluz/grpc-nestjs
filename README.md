# gRPC com NestJS

Exercício com dois serviços NestJS que demonstra a comunicação gRPC entre uma API de produtos e um serviço de usuários. O cliente HTTP consulta um usuário por gRPC e retorna produtos definidos em memória. Não utiliza banco de dados nem dados persistentes.

[![Node.js](https://img.shields.io/badge/Node.js-16.13.2-339933?logo=node.js&logoColor=white)](https://nodejs.org/) [![NestJS](https://img.shields.io/badge/NestJS-8.0.0-E0234E?logo=nestjs)](https://docs.nestjs.com/) [![Licença](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

## 📋 Table of contents

- [✨ Features](#features)
- [🧪 Technologies](#technologies)
- [🛠️ Environment setup](#environment-setup)
- [🚀 Getting started](#getting-started)
- [🔌 API usage](#api-usage)
- [🗂️ Project structure](#project-structure)
- [✅ Testing and quality](#testing-and-quality)
- [🔎 Troubleshooting](#troubleshooting)
- [🤝 Contributing](#contributing)
- [📜 License](#license)

<a id="features"></a>

## ✨ Features

- Serviço `UserService.GetUser` definido em Protocol Buffers.
- Endpoint HTTP para consultar o usuário fictício do exemplo.
- Endpoint HTTP para obter produtos após a consulta gRPC.
- Configuração do Nest CLI para copiar contratos `.proto` para `dist/` quando o build conclui.

Os serviços usam mocks fixos em `user.service.ts` e `app.service.ts`; não há cadastro, autenticação ou persistência.

<a id="technologies"></a>

## 🧪 Technologies

Versões declaradas nos manifestos dos dois componentes:

| Tecnologia | Versão | Uso |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | `16.13.2` | Runtime em `engines.node` |
| [NestJS](https://docs.nestjs.com/) | `8.0.0` | API HTTP e injeção de dependências |
| [NestJS Microservices](https://docs.nestjs.com/microservices/grpc) | `8.4.1` | Transporte gRPC |
| [TypeScript](https://www.typescriptlang.org/docs/) | `4.3.5` | Compilação |
| [@grpc/grpc-js](https://github.com/grpc/grpc-node) | `1.5.9` | Cliente e servidor gRPC |
| [@grpc/proto-loader](https://github.com/grpc/grpc-node) | `0.6.9` | Carregamento dos contratos |
| [RxJS](https://rxjs.dev/) | `7.2.0` | Resposta observável e conversão para Promise |

A versão do Node reproduz a configuração histórica; modernização de runtime e dependências exige avaliação separada.

<a id="environment-setup"></a>

## 🛠️ Environment setup

Requer Git e Node.js 16.13.2 com npm. Os dois `package.json` declaram a mesma versão de Node; não há lockfiles nem dependências na raiz.

```bash
nvm install 16.13.2
nvm use 16.13.2
git clone https://github.com/paulodaluz/grpc-nestjs.git
cd grpc-nestjs
cd user-backend-server
npm install
cd ../products-backend-client
npm install
cd ..
```

Os comandos utilizam npm, como os scripts existentes. Não utilize `npm ci` sem lockfile. Não há hooks, Husky ou `prepare`, nem necessidade de instalar Nest CLI globalmente.

Não há `.env` ou variáveis de configuração. HTTP `3000`/`3001` e gRPC `0.0.0.0:50051` são fixos no código. Mantenha essas portas disponíveis; mudar apenas `PORT` no ambiente não altera a escuta.

<a id="getting-started"></a>

## 🚀 Getting started

Abra dois terminais, selecionando Node.js 16.13.2 em ambos. A partir da raiz:

```bash
# Terminal 1: servidor de usuários
cd user-backend-server
npm run start:dev
```

```bash
# Terminal 2: cliente/API de produtos
cd products-backend-client
npm run start:dev
```

O servidor oferece HTTP em `http://localhost:3000` e gRPC na porta `50051`; o cliente oferece HTTP em `http://localhost:3001`. Inicie o servidor antes de consultar o cliente. Encerre os dois processos com Ctrl+C.

Para gerar e executar o código compilado, execute em **cada** componente:

```bash
npm run build
npm run start:prod
```

O `prebuild` remove `dist/`; o Nest CLI compila e copia `**/*.proto`, necessários em tempo de execução. Execute os comandos no diretório do componente, não na raiz.

<a id="api-usage"></a>

## 🔌 API usage

As rotas não possuem autenticação nem prefixo global. O UUID abaixo identifica o registro fictício definido em `user-backend-server/src/services/user.service.ts`.

```bash
# A rota GET deste exemplo recebe JSON no corpo, não query string.
curl -X GET http://localhost:3000/get-user   -H 'Content-Type: application/json'   -d '{"id":"bf65986e-7946-456c-bc98-c7dedeca71f6"}'

# O cliente consulta o servidor por gRPC e então devolve os produtos em memória.
curl http://localhost:3001/products/bf65986e-7946-456c-bc98-c7dedeca71f6
```

| Transporte | Operação | Finalidade |
| --- | --- | --- |
| HTTP no servidor | `GET /get-user`, corpo `{ "id": "..." }` | Consultar o mock de usuário |
| gRPC no servidor | pacote `user`, serviço `UserService`, método `GetUser(UserId)` | Retornar um `User` |
| HTTP no cliente | `GET /products/:userId` | Buscar o usuário por gRPC e retornar os produtos associados |

Não há tratamento de “usuário inexistente” no serviço de exemplo: IDs diferentes do mock retornam `undefined`. Consulte também a [Wiki histórica](https://github.com/paulodaluz/grpc-nestjs/wiki/Como-usar%3F) e a [documentação gRPC do NestJS](https://docs.nestjs.com/microservices/grpc).

<a id="project-structure"></a>

## 🗂️ Project structure

| Caminho | Responsabilidade |
| --- | --- |
| `user-backend-server/src/main.ts` | HTTP e transporte gRPC do servidor |
| `user-backend-server/src/controllers/` | Operações HTTP/gRPC de usuário |
| `user-backend-server/src/services/` | Usuário fictício em memória |
| `products-backend-client/src/modules/` | Registro do cliente gRPC |
| `products-backend-client/src/controllers/` | Rota HTTP de produtos |
| `products-backend-client/src/services/` | Consulta gRPC e produtos em memória |
| `*/src/proto/user.proto` | Contrato compartilhado, duplicado nos dois componentes |
| `*/nest-cli.json` | Compilação e cópia dos contratos |

<a id="testing-and-quality"></a>

## ✅ Testing and quality

Os dois componentes oferecem os mesmos scripts:

| Comando | Finalidade |
| --- | --- |
| `npm run build` | Compilar e copiar os contratos `.proto` |
| `npm test -- --runInBand` | Executar Jest; não existem arquivos de teste versionados |
| `npm run test:watch` / `npm run test:cov` | Modo contínuo / cobertura, dependentes de uma suíte |
| `npm run lint` | ESLint com `--fix`, pode alterar código |
| `npm run format` | Prettier com escrita, pode alterar código |
| `npm run start:debug` / `npm run test:debug` | Depuração da aplicação / Jest |

`test:e2e` referencia `test/jest-e2e.json`, ausente em ambos. Não há comprovação de cobertura apenas pela existência dos scripts.

Validação com **Node.js 16.13.2 e npm 8.1.2** nos dois componentes: instalações concluídas, após repetir uma instalação inicialmente interrompida e reconstruir os artefatos locais incompletos. Os dois builds falharam em `@types/babel__traverse`, cujas declarações atuais não são aceitas pelo TypeScript 4.3.5. O Jest retornou “No tests found”. Tentativas de `npm run start:prod` sobre o JavaScript parcialmente emitido também falharam: o servidor apresentou `isNumber is not a function` na integração NestJS Microservices; o cliente não encontrou `dist/proto/user.proto`, que não foi copiado após o build malsucedido. Não houve validação funcional HTTP/gRPC. Todos os processos iniciados foram encerrados.

A captura real do VS Code ficou pendente porque não foi possível verificar a instalação atual do usuário e seus temas.

<a id="troubleshooting"></a>

## 🔎 Troubleshooting

| Situação | Verificação |
| --- | --- |
| Build falha em `@types/babel__traverse` | As declarações transitivas atuais exigem sintaxe não suportada pelo TypeScript 4.3.5; correção de dependências ficou pendente. |
| Servidor falha com `isNumber is not a function` | Revisar compatibilidade entre `@nestjs/common` 8.0.0 e `@nestjs/microservices` 8.4.1; as versões foram preservadas. |
| gRPC indisponível | Inicie o servidor e confira a porta `50051`, fixa nos dois módulos. |
| `EADDRINUSE` | HTTP `3000`/`3001` ou gRPC `50051` já está em uso; não há variável `PORT` suportada. |
| Contrato `.proto` não encontrado | Execute o build via Nest CLI no componente e confirme a cópia configurada em `nest-cli.json`. |
| Consulta sem resultado | Apenas o UUID do mock possui implementação; não há banco com outros usuários. |
| Jest não encontra testes | Nenhuma suíte está versionada; `test:e2e` também aponta para configuração ausente. |

<a id="contributing"></a>

## 🤝 Contributing

Crie uma branch a partir de `main`, mantenha as instruções consistentes com o código e abra um pull request descrevendo a alteração e suas verificações. Não versione credenciais, arquivos de ambiente privados, dependências instaladas ou artefatos de execução. Nos dois serviços, revise `npm run build` e mantenha os contratos `.proto` consistentes. Revise alterações automáticas antes de commitar lint ou formatação.

<a id="license"></a>

## 📜 License

Este repositório possui [licença MIT](LICENSE), com autoria de Paulo da Luz (2022), preservada. Os manifestos dos componentes ainda contêm `UNLICENSED`; essa divergência de metadados ficou registrada para revisão, sem alterar a licença efetiva da raiz.

---

<p align="center">Made with 💜 by <a href="https://github.com/paulodaluz">Paulo da Luz</a></p>
