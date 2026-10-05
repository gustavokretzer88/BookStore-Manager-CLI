# 📚 BookStore Manager CLI

Sistema de gerenciamento de biblioteca desenvolvido em **TypeScript** para execução via linha de comando (CLI), utilizando **PostgreSQL** como banco de dados.

O projeto foi desenvolvido com foco no estudo e aplicação de conceitos de **arquitetura de software, separação de responsabilidades, programação orientada a objetos, persistência de dados e desenvolvimento em camadas**.

A aplicação permite gerenciar autores, livros, exemplares, clientes e empréstimos por meio de uma interface interativa no terminal.

---

## 📋 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias e ferramentas](#-tecnologias-e-ferramentas)
- [Arquitetura](#-arquitetura)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Modelo de dados](#-modelo-de-dados)
- [Configuração do ambiente](#-configuração-do-ambiente)
- [Configuração do PostgreSQL](#-configuração-do-postgresql)
- [Instalação](#-instalação)
- [Inicialização do banco de dados](#-inicialização-do-banco-de-dados)
- [População do banco](#-população-do-banco)
- [Execução em desenvolvimento](#-execução-em-desenvolvimento)
- [Compilação](#-compilação)
- [Execução da versão compilada](#-execução-da-versão-compilada)
- [Comandos disponíveis](#-comandos-disponíveis)
- [Fluxo da aplicação](#-fluxo-da-aplicação)
- [Decisões arquiteturais](#-decisões-arquiteturais)
- [Controle de versão](#-controle-de-versão)
- [Autor](#-autor)

---

# 📖 Sobre o projeto

O **BookStore Manager CLI** é uma aplicação de gerenciamento de biblioteca desenvolvida como projeto de estudo de desenvolvimento de software com **Node.js, TypeScript e PostgreSQL**.

O sistema foi estruturado utilizando uma arquitetura em camadas:

```text
View
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
PostgreSQL
```

Cada camada possui uma responsabilidade específica, evitando que regras de negócio, interação com o usuário e acesso ao banco de dados fiquem concentrados no mesmo componente.

A aplicação é executada através do terminal e utiliza menus interativos para permitir a realização das operações de gerenciamento.

---

# ✨ Funcionalidades

## Autores

Permite:

- cadastrar autores;
- listar autores;
- buscar autores por ID;
- buscar autores por nome;
- atualizar autores;
- remover autores;
- informar nacionalidade;
- informar ano de nascimento;
- informar ano de falecimento.

Os anos de nascimento e falecimento são opcionais e possuem validações de consistência.

---

## Livros

Permite:

- cadastrar livros;
- listar livros;
- buscar livros por ID;
- buscar livros por título;
- buscar livros por autor;
- buscar livros pelo nome do autor;
- buscar livros pelo número de chamada;
- buscar livros pelo ISBN;
- atualizar livros;
- remover livros.

Um livro possui um autor associado.

---

## Exemplares

Um livro pode possuir diversos exemplares físicos.

Permite:

- cadastrar exemplares;
- listar exemplares;
- buscar por ID;
- buscar por código;
- buscar por livro;
- buscar por estado de conservação;
- listar exemplares disponíveis;
- atualizar exemplares;
- remover exemplares.

Os estados de conservação disponíveis são:

```text
NOVO
BOM
REGULAR
RUIM
```

Cada exemplar possui um código único.

---

## Clientes

Permite:

- cadastrar clientes;
- listar clientes;
- buscar por ID;
- buscar por nome;
- buscar por e-mail;
- atualizar clientes;
- remover clientes.

O e-mail do cliente é único no banco de dados.

---

## Empréstimos

Permite:

- realizar empréstimos;
- listar empréstimos;
- buscar empréstimo por ID;
- buscar empréstimos por cliente;
- buscar empréstimos por exemplar;
- listar empréstimos ativos;
- devolver exemplares;
- remover registros de empréstimos.

Um empréstimo é considerado **ativo** quando:

```text
data_devolucao IS NULL
```

e é considerado **devolvido** quando possui uma data de devolução.

Um exemplar não pode possuir mais de um empréstimo ativo simultaneamente.

---

# 🛠 Tecnologias e ferramentas

## TypeScript

O projeto é desenvolvido em **TypeScript**, permitindo tipagem estática e maior segurança durante o desenvolvimento.

O compilador está configurado para gerar JavaScript compatível com **ES2022** e utilizando o sistema de módulos **CommonJS**.

---

## Node.js

O **Node.js** é utilizado como ambiente de execução da aplicação.

A aplicação é executada diretamente no terminal e não possui uma interface gráfica ou aplicação web.

---

## PostgreSQL

O PostgreSQL é utilizado como sistema gerenciador de banco de dados relacional.

A aplicação utiliza:

- chaves primárias;
- chaves estrangeiras;
- restrições `CHECK`;
- restrições `UNIQUE`;
- índices;
- relacionamentos entre entidades;
- consultas parametrizadas;
- `ILIKE` para pesquisas textuais;
- `NULL` para representar informações opcionais;
- índice parcial para impedir múltiplos empréstimos ativos do mesmo exemplar.

---

## node-postgres (`pg`)

A biblioteca `pg` fornece a comunicação entre a aplicação TypeScript e o PostgreSQL.

A aplicação utiliza um `Pool` de conexões para executar as consultas SQL.

---

## dotenv

O `dotenv` é utilizado para carregar as configurações do banco de dados a partir do arquivo `.env`.

As variáveis utilizadas são:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

---

## Inquirer

O pacote `@inquirer/prompts` é utilizado para criar a interface interativa da aplicação no terminal.

Ele fornece componentes como:

- `input`;
- `select`;
- `confirm`.

As Views utilizam esses componentes para coletar informações do usuário.

---

## cli-table3

O `cli-table3` é utilizado para apresentar os resultados das consultas em tabelas no terminal.

Exemplo conceitual:

```text
┌────┬──────────────────────┬─────────────┐
│ ID │ Título               │ Autor       │
├────┼──────────────────────┼─────────────┤
│ 1  │ O Estrangeiro        │ Albert Camus│
│ 2  │ Assim Falou Zarat... │ Nietzsche   │
└────┴──────────────────────┴─────────────┘
```

---

## ts-node

O `ts-node` permite executar arquivos TypeScript diretamente sem a necessidade de compilá-los previamente.

É utilizado principalmente pelos scripts de gerenciamento do banco.

---

## ts-node-dev

O `ts-node-dev` é utilizado durante o desenvolvimento para executar a aplicação TypeScript e reiniciá-la automaticamente quando os arquivos são modificados.

O script de desenvolvimento é:

```bash
npm run dev
```

e corresponde a:

```bash
ts-node-dev --respawn --transpile-only src/main.ts
```

---

## Prettier

O **Prettier** é utilizado para padronização automática da formatação do código.

Comandos:

```bash
npm run format
```

e:

```bash
npm run format:check
```

---

# 🏗 Arquitetura

O projeto utiliza uma **arquitetura em camadas**, separando apresentação, coordenação, regras de negócio e persistência.

```text
┌───────────────────────────┐
│           View            │
│      Interface CLI        │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│        Controller         │
│ Coordenação das operações │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│          Service          │
│     Regras de negócio     │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│        Repository         │
│      Acesso aos dados     │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│        PostgreSQL         │
│       Banco de dados      │
└───────────────────────────┘
```

## View

Responsável pela interação com o usuário.

Exemplos:

```text
AutorView
LivroView
ExemplarView
ClienteView
EmprestimoView
MenuPrincipal
```

As Views:

- apresentam menus;
- solicitam dados;
- apresentam resultados;
- utilizam `Inquirer`;
- exibem tabelas;
- solicitam confirmações.

As Views **não executam SQL** e não contém regras de negócio.

---

## Controller

Responsável por fazer a ligação entre a View e o Service.

Exemplos:

```text
AutorController
LivroController
ExemplarController
ClienteController
EmprestimoController
```

O Controller recebe os dados fornecidos pela View e delega a operação ao Service correspondente.

---

## Service

Concentra as regras de negócio da aplicação.

Exemplos de validações realizadas pelos Services:

- IDs devem ser maiores que zero;
- campos obrigatórios não podem estar vazios;
- autores precisam existir antes de um livro ser cadastrado;
- livros precisam existir antes de exemplares serem cadastrados;
- clientes precisam existir antes de empréstimos;
- exemplares precisam existir;
- exemplares emprestados não podem possuir outro empréstimo ativo;
- ISBNs não podem ser duplicados;
- e-mails de clientes não podem ser duplicados;
- datas precisam ser válidas;
- ano de falecimento não pode ser anterior ao ano de nascimento.

Essa separação permite manter as regras de negócio independentes da interface CLI.

---

## Repository

Os Repositories são responsáveis exclusivamente pela persistência.

Exemplos:

```text
AutorRepository
LivroRepository
ExemplarRepository
ClienteRepository
EmprestimoRepository
```

Eles:

- executam comandos SQL;
- recebem parâmetros;
- retornam entidades;
- encapsulam o acesso ao PostgreSQL;
- tratam particularidades específicas do banco.

As consultas utilizam parâmetros do PostgreSQL:

```typescript
await pool.query(
  `
    SELECT *
    FROM livros
    WHERE id = $1
    `,
  [id],
);
```

Isso evita a construção de SQL por concatenação de valores fornecidos pelo usuário.

---

# 📂 Estrutura do projeto

A estrutura principal segue a separação por responsabilidades:

```text
BookStore-Manager-CLI/
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   ├── reset.sql
│   └── clear.sql
│
├── src/
│   │
│   ├── controllers/
│   │   ├── AutorController.ts
│   │   ├── LivroController.ts
│   │   ├── ExemplarController.ts
│   │   ├── ClienteController.ts
│   │   └── EmprestimoController.ts
│   │
│   ├── services/
│   │   ├── AutorService.ts
│   │   ├── LivroService.ts
│   │   ├── ExemplarService.ts
│   │   ├── ClienteService.ts
│   │   └── EmprestimoService.ts
│   │
│   ├── repositories/
│   │   ├── AutorRepository.ts
│   │   ├── LivroRepository.ts
│   │   ├── ExemplarRepository.ts
│   │   ├── ClienteRepository.ts
│   │   └── EmprestimoRepository.ts
│   │
│   ├── models/
│   │   ├── Autor.ts
│   │   ├── Livro.ts
│   │   ├── Exemplar.ts
│   │   ├── Cliente.ts
│   │   └── Emprestimo.ts
│   │
│   ├── views/
│   │   ├── MenuPrincipal.ts
│   │   ├── AutoresView.ts
│   │   ├── LivroView.ts
│   │   ├── ExemplarView.ts
│   │   ├── ClienteView.ts
│   │   └── EmprestimoView.ts
│   │
│   ├── database/
│   │   ├── connection.ts
│   │   ├── setup.ts
│   │   ├── reset.ts
│   │   ├── seed.ts
│   │   └── clear.ts
│   │
│   └── main.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

> Os arquivos SQL ficam na pasta `database/`, enquanto os scripts TypeScript responsáveis por executá-los ficam em `src/database/`.

---

# 🗄 Modelo de dados

O banco é organizado em cinco entidades principais:

```text
                 ┌─────────────┐
                 │   AUTORES   │
                 └──────┬──────┘
                        │
                        │ 1:N
                        ▼
                 ┌─────────────┐
                 │   LIVROS    │
                 └──────┬──────┘
                        │
                        │ 1:N
                        ▼
                 ┌─────────────┐
                 │ EXEMPLARES  │
                 └──────┬──────┘
                        │
                        │ 1:N
                        ▼
                 ┌─────────────┐
                 │ EMPRÉSTIMOS │
                 └──────┬──────┘
                        │
                        │ N:1
                        ▼
                 ┌─────────────┐
                 │  CLIENTES   │
                 └─────────────┘
```

### Autores

```text
autores
├── id
├── nome
├── nacionalidade
├── ano_nascimento
└── ano_falecimento
```

### Livros

```text
livros
├── id
├── titulo
├── isbn
├── ano_publicacao
├── numero_chamada
└── autor_id → autores.id
```

### Exemplares

```text
exemplares
├── id
├── codigo
├── livro_id → livros.id
└── estado_conservacao
```

### Clientes

```text
clientes
├── id
├── nome
├── email
└── telefone
```

### Empréstimos

```text
emprestimos
├── id
├── exemplar_id → exemplares.id
├── cliente_id → clientes.id
├── data_emprestimo
└── data_devolucao
```

A separação entre `livros` e `exemplares` permite representar corretamente uma situação em que uma mesma obra possui várias cópias físicas.

---

# ⚙️ Configuração do ambiente

## Pré-requisitos

É necessário possuir instalado:

- **Node.js**
- **npm**
- **PostgreSQL**
- **Git**

Também é necessário possuir um usuário do PostgreSQL com permissão para criar o banco de dados utilizado pela aplicação.

---

# 🔐 Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookstore
DB_USER=postgres
DB_PASSWORD=sua_senha
```

Substitua `sua_senha` pela senha do usuário PostgreSQL.

O arquivo `.env` não deve ser versionado.

Exemplo de configuração utilizada pelo projeto:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

A aplicação verifica se essas variáveis estão configuradas antes de estabelecer o `Pool` de conexões.

---

# 📥 Instalação

Clone o repositório:

```bash
git clone https://github.com/gustavokretzer88/BookStore-Manager-CLI.git
```

Entre no diretório:

```bash
cd BookStore-Manager-CLI
```

Instale as dependências:

```bash
npm install
```

---

# 🗄 Inicialização do banco de dados

Com o PostgreSQL em execução e o `.env` configurado, execute:

```bash
npm run db:setup
```

Esse comando executa o script:

```text
src/database/setup.ts
```

O processo:

1. lê `DB_NAME`;
2. conecta ao banco administrativo `postgres`;
3. verifica se o banco configurado existe;
4. cria o banco caso ele não exista;
5. aplica o arquivo `database/schema.sql`.

O próprio script realiza essa verificação e criação automaticamente.

Portanto, normalmente **não é necessário criar manualmente o banco através do `psql` ou pgAdmin**.

---

# 🌱 População do banco

Depois de criar o banco e suas tabelas, execute:

```bash
npm run db:seed
```

Esse comando executa:

```text
database/seed.sql
```

e insere os dados iniciais no banco.

O fluxo completo para preparar um banco novo é:

```bash
npm install
npm run db:setup
npm run db:seed
```

---

# 🧹 Limpar o banco

Para remover os dados das tabelas mantendo a estrutura do banco:

```bash
npm run db:clear
```

Esse comando executa `clear.sql`.

A operação é útil quando se deseja começar novamente com as tabelas existentes.

---

# ♻️ Resetar o banco

Para remover as tabelas e recriá-las posteriormente:

```bash
npm run db:reset
```

Esse comando executa `reset.sql`.

Após um reset, execute novamente:

```bash
npm run db:setup
npm run db:seed
```

---

# 🚀 Execução em desenvolvimento

Depois de configurar e popular o banco:

```bash
npm run dev
```

Esse comando executa:

```text
src/main.ts
```

utilizando `ts-node-dev`.

A aplicação será iniciada diretamente no terminal e apresentará o menu principal.

Fluxo:

```text
npm run dev
      │
      ▼
  src/main.ts
      │
      ▼
MenuPrincipal
      │
      ├── Autores
      ├── Livros
      ├── Exemplares
      ├── Clientes
      └── Empréstimos
```

---

# 🏗 Compilação

Para compilar o projeto TypeScript:

```bash
npm run build
```

O comando executa:

```bash
tsc
```

conforme definido no `package.json`.

Os arquivos compilados são gerados na pasta:

```text
dist/
```

A configuração do TypeScript define:

```text
rootDir: ./src
outDir: ./dist
```

e também gera source maps e declarações TypeScript.

---

# ▶️ Execução da versão compilada

Depois de executar:

```bash
npm run build
```

execute:

```bash
npm start
```

O script executa:

```text
node dist/main.js
```

Portanto, o fluxo de produção/execução compilada é:

```bash
npm run build
npm start
```

---

# 📜 Comandos disponíveis

| Comando                | Função                                   |
| ---------------------- | ---------------------------------------- |
| `npm install`          | Instala as dependências                  |
| `npm run dev`          | Executa em modo de desenvolvimento       |
| `npm run build`        | Compila o TypeScript                     |
| `npm start`            | Executa a versão compilada               |
| `npm run db:setup`     | Cria/configura o banco e aplica o schema |
| `npm run db:seed`      | Popula o banco                           |
| `npm run db:clear`     | Remove os dados mantendo as tabelas      |
| `npm run db:reset`     | Remove as tabelas                        |
| `npm run format`       | Formata os arquivos com Prettier         |
| `npm run format:check` | Verifica a formatação                    |

Os scripts estão definidos no `package.json` do projeto.

---

# 🔄 Fluxo recomendado para iniciar o projeto

Em uma instalação nova:

```bash
git clone https://github.com/gustavokretzer88/BookStore-Manager-CLI.git

cd BookStore-Manager-CLI

npm install
```

Configure:

```text
.env
```

com:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookstore
DB_USER=postgres
DB_PASSWORD=sua_senha
```

Depois:

```bash
npm run db:setup
npm run db:seed
npm run dev
```

Em forma resumida:

```text
┌─────────────────────┐
│     npm install     │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│      configurar     │
│        .env         │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│   npm run db:setup  │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│   npm run db:seed   │
└──────────┬──────────┘
           ▼
┌─────────────────────┐
│     npm run dev     │
└─────────────────────┘
```

---

# 🔁 Fluxo da aplicação

Uma operação típica percorre todas as camadas.

Por exemplo, ao cadastrar um livro:

```text
Usuário
   │
   ▼
LivroView
   │
   │ dados do livro
   ▼
LivroController
   │
   ▼
LivroService
   │
   │ validações
   │ verifica autor
   ▼
LivroRepository
   │
   │ INSERT
   ▼
PostgreSQL
```

Na consulta:

```text
PostgreSQL
     │
     ▼
LivroRepository
     │
     ▼
LivroService
     │
     ▼
LivroController
     │
     ▼
LivroView
     │
     ▼
Terminal
```

Essa separação permite que uma camada seja modificada sem necessariamente alterar as demais.

---

# 🧠 Decisões arquiteturais

## Separação entre Livro e Exemplar

Um dos principais aspectos do modelo é a separação:

```text
Livro
  │
  ├── Exemplar 001
  ├── Exemplar 002
  └── Exemplar 003
```

`Livro` representa a obra bibliográfica.

`Exemplar` representa uma cópia física específica dessa obra.

Isso permite controlar individualmente:

- código do exemplar;
- estado de conservação;
- disponibilidade;
- empréstimos.

---

## Controle de disponibilidade

A disponibilidade não é armazenada como um campo booleano.

Ela é determinada a partir dos empréstimos:

```text
data_devolucao IS NULL
```

Um exemplar está disponível quando não possui um empréstimo ativo.

Essa abordagem evita manter duas informações que poderiam ficar inconsistentes.

---

## Integridade no banco

As regras importantes também são protegidas pelo PostgreSQL.

Entre elas:

- `PRIMARY KEY`;
- `FOREIGN KEY`;
- `UNIQUE`;
- `CHECK`.

A aplicação também possui validações na camada Service.

A validação no Service melhora a experiência do usuário, enquanto as restrições do banco funcionam como última garantia de integridade dos dados.

---

## Índice para empréstimo ativo

O banco utiliza um índice único parcial para impedir que um mesmo exemplar tenha dois empréstimos ativos simultaneamente.

Conceitualmente:

```sql
CREATE UNIQUE INDEX ...
ON emprestimos(exemplar_id)
WHERE data_devolucao IS NULL;
```

Assim, a própria estrutura do banco protege uma regra fundamental do domínio.

---

## Tratamento de erros do PostgreSQL

Os Repositories são responsáveis por lidar com erros específicos do PostgreSQL.

Por exemplo, violações de chave estrangeira podem ser identificadas pelo código SQLSTATE:

```text
23503
```

Isso mantém detalhes específicos do PostgreSQL fora das camadas superiores.

---

# 🔒 Segurança e boas práticas

O projeto utiliza consultas parametrizadas:

```typescript
pool.query(
  `
    SELECT *
    FROM livros
    WHERE id = $1
    `,
  [id],
);
```

em vez de construir consultas através da concatenação de strings.

Também são utilizadas:

- variáveis de ambiente para credenciais;
- validação de entrada;
- restrições de banco de dados;
- chaves estrangeiras;
- `UNIQUE`;
- `CHECK`;
- separação de responsabilidades.

---

# 🌳 Git e fluxo de desenvolvimento

O desenvolvimento foi organizado utilizando uma estratégia baseada em Git Flow:

```text
main
  │
  ▼
develop
  │
  ├── feature/configuracao-inicial
  ├── feature/database
  ├── feature/repositories
  ├── feature/services
  ├── feature/controllers
  └── feature/views
```

As funcionalidades são desenvolvidas em branches específicas e posteriormente integradas à branch `develop`.

A branch `main` representa a versão principal/estável do projeto.

---

# 📌 Estado atual do projeto

A versão `develop` reúne as principais camadas necessárias para uma aplicação CLI de gerenciamento de biblioteca:

```text
✓ Modelos
✓ PostgreSQL
✓ Scripts de banco
✓ Repositories
✓ Services
✓ Controllers
✓ Views
✓ Menu principal
✓ Interface CLI interativa
✓ CRUD de autores
✓ CRUD de livros
✓ CRUD de exemplares
✓ CRUD de clientes
✓ Gerenciamento de empréstimos
✓ Controle de exemplares disponíveis
✓ Validações
✓ Tratamento de erros
✓ Compilação TypeScript
✓ Scripts de desenvolvimento
✓ Formatação com Prettier
```

---

# 📦 Versão

## v0.2 

- módulo completo de Relatórios;
- RelatorioController, RelatorioService, RelatorioRepository e RelatorioView;
- cinco relatórios;
- novos DTOs, inclusive os específicos de relatório;
- BaseView para reutilização da camada de apresentação;
- reorganização de MenuPrincipal/MenuPrincipalView;
- View SQL vw_livrosEAutor;
- melhorias nas consultas SQL;
- typecheck, ESLint e npm run check;
- atualização da estrutura arquitetural e do fluxo de dependências;

**Data da versão:** 05/10/2026

## v0.1 — Primeira versão

A versão **v0.1** representa a primeira versão funcional do **BookStore Manager CLI**.

Esta versão inclui:

- gerenciamento de autores;
- gerenciamento de livros;
- gerenciamento de exemplares;
- gerenciamento de clientes;
- gerenciamento de empréstimos;
- persistência em PostgreSQL;
- arquitetura em camadas;
- interface CLI interativa;
- validações de regras de negócio;
- scripts para criação, população, limpeza e reset do banco;
- compilação TypeScript;
- execução em ambiente de desenvolvimento e produção.

**Data da versão:** 29/09/2026

# 👤 Autor

**Gustavo Pinho Kretzer de Souza**

GitHub:

https://github.com/gustavokretzer88

Repositório:

https://github.com/gustavokretzer88/BookStore-Manager-CLI
