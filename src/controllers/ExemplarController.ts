import { confirm, input, select } from "@inquirer/prompts";
import Table from "cli-table3";

import { Exemplar, EstadoConservacao } from "../models/Exemplar";
import { ExemplarService } from "../services/ExemplarService";
import { LivroService } from "../services/LivroService";
import {
  ExemplarView,
  OpcoesBuscarExemplarPor,
  OpcoesMenuExemplar,
} from "../views/ExemplarView";

export class ExemplarController {
  private readonly exemplarView: ExemplarView = new ExemplarView();
  constructor(
    private readonly exemplarService: ExemplarService,
    private readonly livroService: LivroService,
  ) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      try {
        const opcao = await this.exemplarView.mostrarOpcoes();

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

  private async buscar(): Promise<void> {
    const selecao = await this.exemplarView.mostrarOpcoesBusca();

    switch (selecao) {
      case OpcoesBuscarExemplarPor.todos: {
        const exemplares = await this.exemplarService.buscarTodos();

        this.exemplarView.mostrarExemplares(exemplares);
        break;
      }

      case OpcoesBuscarExemplarPor.id: {
        const resposta = await input({
          message: "ID do exemplar:",
        });

        const id = Number(resposta);

        if (!Number.isInteger(id) || id <= 0) {
          throw new Error("O ID deve ser um número inteiro maior que zero.");
        }

        const exemplar = await this.exemplarService.buscarPorId(id);

        this.exemplarView.mostrarExemplares(exemplar ? [exemplar] : []);

        break;
      }

      case OpcoesBuscarExemplarPor.codigo: {
        const codigo = await input({
          message: "Código do exemplar:",
        });

        const exemplar = await this.exemplarService.buscarPorCodigo(codigo);

        this.exemplarView.mostrarExemplares(exemplar ? [exemplar] : []);

        break;
      }

      case OpcoesBuscarExemplarPor.livro: {
        const livros = await this.livroService.buscarTodos();

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

        const exemplares = await this.exemplarService.buscarPorLivro(livroId);

        this.exemplarView.mostrarExemplares(exemplares);

        break;
      }

      case OpcoesBuscarExemplarPor.estado: {
        const estado = await this.exemplarView.selecionarEstado();

        const exemplares = await this.exemplarService.buscarPorEstado(estado);

        this.exemplarView.mostrarExemplares(exemplares);

        break;
      }

      case OpcoesBuscarExemplarPor.disponiveis: {
        const exemplares = await this.exemplarService.buscarDisponiveis();

        this.exemplarView.mostrarExemplares(exemplares);

        break;
      }

      case OpcoesBuscarExemplarPor.sair:
        break;
    }
  }

  private async adicionar(): Promise<void> {
    console.log("\n=== Adicionar exemplar ===\n");

    const codigo = await input({
      message: "Código do exemplar:",
    });

    const livros = await this.livroService.buscarTodos();

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

    const estado = await this.exemplarView.selecionarEstado();

    const exemplar = await this.exemplarService.cadastrar(
      codigo,
      livroId,
      estado,
    );

    console.log("\nExemplar cadastrado com sucesso!\n");

    this.exemplarView.mostrarExemplares([exemplar]);
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

    const exemplar = await this.exemplarService.buscarPorId(id);

    if (!exemplar) {
      console.log("\nExemplar não encontrado.\n");
      return;
    }

    this.exemplarView.mostrarExemplares([exemplar], "Exemplar selecionado:");

    const codigo = await input({
      message: "Código:",
      default: exemplar.codigo,
    });

    const livros = await this.livroService.buscarTodos();

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

    const estado = await this.exemplarView.selecionarEstado(
      exemplar.estado_conservacao,
    );

    const exemplarAtualizado = await this.exemplarService.atualizar(
      id,
      codigo,
      livroId,
      estado,
    );

    if (!exemplarAtualizado) {
      console.log("\nExemplar não encontrado.\n");
      return;
    }

    this.exemplarView.mostrarExemplares(
      [exemplarAtualizado],
      "Exemplar atualizado com sucesso!",
    );
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

    const exemplar = await this.exemplarService.buscarPorId(id);

    if (!exemplar) {
      console.log("\nExemplar não encontrado.\n");
      return;
    }

    this.exemplarView.mostrarExemplares([exemplar], "Exemplar selecionado:");

    const confirmar = await confirm({
      message: `Deseja realmente remover o exemplar "${exemplar.codigo}"?`,
      default: false,
    });

    if (!confirmar) {
      console.log("\nOperação cancelada.\n");
      return;
    }

    const removido = await this.exemplarService.excluir(id);

    if (!removido) {
      console.log("\nExemplar não encontrado.\n");
      return;
    }

    console.log("\nExemplar removido com sucesso!\n");
  }
}
