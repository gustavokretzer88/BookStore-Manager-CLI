import { confirm, input, select } from "@inquirer/prompts";
import Table from "cli-table3";

import { ExemplarController } from "../controllers/ExemplarController";
import { LivroController } from "../controllers/LivroController";
import { Exemplar, EstadoConservacao } from "../models/Exemplar";

enum OpcoesMenuExemplar {
  buscar,
  adicionar,
  atualizar,
  remover,
  sair,
}

export class ExemplarView {
  constructor(
    private readonly exemplarController: ExemplarController,
    private readonly livroController: LivroController,
  ) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      try {
        const opcao = await this.mostrarOpcoes();

        switch (opcao) {
          case OpcoesMenuExemplar.buscar:
            await this.buscar();
            break;

          case OpcoesMenuExemplar.adicionar:
            await this.adicionar();
            break;

          case OpcoesMenuExemplar.atualizar:
            await this.atualizar();
            break;

          case OpcoesMenuExemplar.remover:
            await this.remover();
            break;

          case OpcoesMenuExemplar.sair:
            continuar = false;
            break;
        }
      } catch (erro) {
        console.error("\nErro:", erro instanceof Error ? erro.message : erro);
      }
    }
  }

  private async mostrarOpcoes(): Promise<OpcoesMenuExemplar> {
    return await select({
      message: "Gerenciador de exemplares:",
      choices: [
        {
          name: "Buscar",
          value: OpcoesMenuExemplar.buscar,
        },
        {
          name: "Adicionar",
          value: OpcoesMenuExemplar.adicionar,
        },
        {
          name: "Atualizar",
          value: OpcoesMenuExemplar.atualizar,
        },
        {
          name: "Remover",
          value: OpcoesMenuExemplar.remover,
        },
        {
          name: "Sair",
          value: OpcoesMenuExemplar.sair,
        },
      ],
    });
  }

  private async buscar(): Promise<void> {
    enum ModoBusca {
      listar,
      id,
      codigo,
      livro,
      estado,
      disponiveis,
      sair,
    }

    const selecao = await select({
      message: "Buscar exemplar por:",
      choices: [
        {
          name: "Listar todos",
          value: ModoBusca.listar,
        },
        {
          name: "ID",
          value: ModoBusca.id,
        },
        {
          name: "Código",
          value: ModoBusca.codigo,
        },
        {
          name: "Livro",
          value: ModoBusca.livro,
        },
        {
          name: "Estado de conservação",
          value: ModoBusca.estado,
        },
        {
          name: "Disponíveis",
          value: ModoBusca.disponiveis,
        },
        {
          name: "Sair",
          value: ModoBusca.sair,
        },
      ],
    });

    switch (selecao) {
      case ModoBusca.listar: {
        const exemplares = await this.exemplarController.listar();

        this.mostrarExemplares(exemplares);
        break;
      }

      case ModoBusca.id: {
        const resposta = await input({
          message: "ID do exemplar:",
        });

        const id = Number(resposta);

        if (!Number.isInteger(id) || id <= 0) {
          throw new Error("O ID deve ser um número inteiro maior que zero.");
        }

        const exemplar = await this.exemplarController.buscarPorId(id);

        this.mostrarExemplares(exemplar ? [exemplar] : []);

        break;
      }

      case ModoBusca.codigo: {
        const codigo = await input({
          message: "Código do exemplar:",
        });

        const exemplar = await this.exemplarController.buscarPorCodigo(codigo);

        this.mostrarExemplares(exemplar ? [exemplar] : []);

        break;
      }

      case ModoBusca.livro: {
        const livros = await this.livroController.listar();

        if (livros.length === 0) {
          console.log("\nNão existem livros cadastrados.\n");
          break;
        }

        const livroId = await select({
          message: "Selecione o livro:",
          choices: livros.map((livro) => ({
            name: `${livro.titulo} (ID: ${livro.id})`,
            value: livro.id,
          })),
        });

        const exemplares =
          await this.exemplarController.buscarPorLivro(livroId);

        this.mostrarExemplares(exemplares);

        break;
      }

      case ModoBusca.estado: {
        const estado = await this.selecionarEstado();

        const exemplares =
          await this.exemplarController.buscarPorEstado(estado);

        this.mostrarExemplares(exemplares);

        break;
      }

      case ModoBusca.disponiveis: {
        const exemplares = await this.exemplarController.buscarDisponiveis();

        this.mostrarExemplares(exemplares);

        break;
      }

      case ModoBusca.sair:
        break;
    }
  }

  private async adicionar(): Promise<void> {
    console.log("\n=== Adicionar exemplar ===\n");

    const codigo = await input({
      message: "Código do exemplar:",
    });

    const livros = await this.livroController.listar();

    if (livros.length === 0) {
      throw new Error(
        "Não é possível cadastrar um exemplar porque não existem livros cadastrados.",
      );
    }

    const livroId = await select({
      message: "Selecione o livro:",
      choices: livros.map((livro) => ({
        name: `${livro.titulo} (ID: ${livro.id})`,
        value: livro.id,
      })),
    });

    const estado = await this.selecionarEstado();

    const exemplar = await this.exemplarController.cadastrar(
      codigo,
      livroId,
      estado,
    );

    console.log("\nExemplar cadastrado com sucesso!\n");

    this.mostrarExemplares([exemplar]);
  }

  private async atualizar(): Promise<void> {
    console.log("\n=== Atualizar exemplar ===\n");

    const respostaId = await input({
      message: "ID do exemplar que deseja atualizar:",
    });

    const id = Number(respostaId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro maior que zero.");
    }

    const exemplar = await this.exemplarController.buscarPorId(id);

    if (!exemplar) {
      console.log("\nExemplar não encontrado.\n");
      return;
    }

    console.log("\nExemplar selecionado:");
    this.mostrarExemplares([exemplar]);

    const codigo = await input({
      message: "Código:",
      default: exemplar.codigo,
    });

    const livros = await this.livroController.listar();

    if (livros.length === 0) {
      throw new Error("Não existem livros cadastrados.");
    }

    const livroId = await select({
      message: "Selecione o livro:",
      choices: livros.map((livro) => ({
        name: `${livro.titulo} (ID: ${livro.id})`,
        value: livro.id,
      })),
      default: exemplar.livro_id,
    });

    const estado = await this.selecionarEstado(exemplar.estado_conservacao);

    const exemplarAtualizado = await this.exemplarController.atualizar(
      id,
      codigo,
      livroId,
      estado,
    );

    if (!exemplarAtualizado) {
      console.log("\nExemplar não encontrado.\n");
      return;
    }

    console.log("\nExemplar atualizado com sucesso!\n");

    this.mostrarExemplares([exemplarAtualizado]);
  }

  private async remover(): Promise<void> {
    console.log("\n=== Remover exemplar ===\n");

    const respostaId = await input({
      message: "ID do exemplar que deseja remover:",
    });

    const id = Number(respostaId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro maior que zero.");
    }

    const exemplar = await this.exemplarController.buscarPorId(id);

    if (!exemplar) {
      console.log("\nExemplar não encontrado.\n");
      return;
    }

    console.log("\nExemplar selecionado:");
    this.mostrarExemplares([exemplar]);

    const confirmar = await confirm({
      message: `Deseja realmente remover o exemplar "${exemplar.codigo}"?`,
      default: false,
    });

    if (!confirmar) {
      console.log("\nOperação cancelada.\n");
      return;
    }

    const removido = await this.exemplarController.excluir(id);

    if (!removido) {
      console.log("\nExemplar não encontrado.\n");
      return;
    }

    console.log("\nExemplar removido com sucesso!\n");
  }

  private async selecionarEstado(
    estadoAtual?: EstadoConservacao,
  ): Promise<EstadoConservacao> {
    const selecao = await select({
      message: "Estado de conservação:",
      choices: [
        {
          name: "Novo",
          value: "NOVO",
        },
        {
          name: "Bom",
          value: "BOM",
        },
        {
          name: "Regular",
          value: "REGULAR",
        },
        {
          name: "Ruim",
          value: "RUIM",
        },
      ],
    });
    if (selecao.length !== 0) {
      return selecao;
    }
    if (estadoAtual !== undefined) {
      return estadoAtual;
    }
    throw new Error("Erro ao selecionar estado");
  }

  private mostrarExemplares(exemplares: Exemplar[]): void {
    if (exemplares.length === 0) {
      console.log("\nNenhum exemplar encontrado.\n");
      return;
    }

    const tabela = new Table({
      head: ["ID", "Código", "Livro ID", "Estado"],
    });

    for (const exemplar of exemplares) {
      tabela.push([
        exemplar.id,
        exemplar.codigo,
        exemplar.livro_id,
        exemplar.estado_conservacao,
      ]);
    }

    console.log(tabela.toString());
  }
}
