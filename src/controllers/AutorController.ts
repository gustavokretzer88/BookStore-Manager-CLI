import { confirm, input, select } from "@inquirer/prompts";
import Table from "cli-table3";

import { Autor } from "../models/Autor";
import { AutorService } from "../services/AutorService";
import {
  AutorView,
  OpcoesBuscarAutorPor,
  OpcoesMenuAutor,
} from "../views/AutorView";

export class AutorController {
  private readonly autorView: AutorView = new AutorView();

  constructor(private readonly autorService: AutorService) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      try {
        const opcao = await this.autorView.mostrarOpcoes();

        switch (opcao) {
          case OpcoesMenuAutor.buscar:
            await this.buscar();
            break;
          case OpcoesMenuAutor.adicionar:
            await this.adicionar();
            break;
          case OpcoesMenuAutor.atualizar:
            await this.atualizar();
            break;
          case OpcoesMenuAutor.remover:
            await this.remover();
            break;
          case OpcoesMenuAutor.sair:
            continuar = false;
            break;
        }
      } catch (erro) {
        console.error("\nErro:", erro instanceof Error ? erro.message : erro);
      }
    }
  }

  private async buscar(): Promise<void> {
    const selecao = await this.autorView.mostraOpcoesBuscarAutorPor();

    switch (selecao) {
      case OpcoesBuscarAutorPor.listar: {
        const autores = await this.autorService.buscarTodos();
        this.autorView.mostrarAutores(autores);
        break;
      }
      case OpcoesBuscarAutorPor.id: {
        const resposta = await input({
          message: "ID do autor:",
        });

        const id = Number(resposta);

        if (!Number.isInteger(id) || id <= 0) {
          throw new Error("O ID deve ser um número inteiro maior que zero.");
        }

        const autor = await this.autorService.buscarPorId(id);

        this.autorView.mostrarAutores(autor ? [autor] : []);

        break;
      }
      case OpcoesBuscarAutorPor.nome: {
        const nome = await input({
          message: "Nome do autor:",
        });

        const autores = await this.autorService.buscarPorNome(nome);

        this.autorView.mostrarAutores(autores);

        break;
      }

      case OpcoesBuscarAutorPor.sair:
        break;
    }
  }

  private async adicionar(): Promise<void> {
    console.log("\n=== Adicionar autor ===\n");

    const nome = await input({
      message: "Nome do autor:",
    });

    const nacionalidade = await input({
      message: "Nacionalidade (opcional):",
    });

    const anoNascimentoResposta = await input({
      message: "Ano de nascimento (opcional):",
    });

    const anoFalecimentoResposta = await input({
      message: "Ano de falecimento (opcional):",
    });

    const anoNascimento = this.converterAnoOpcional(
      anoNascimentoResposta,
      "nascimento",
    );

    const anoFalecimento = this.converterAnoOpcional(
      anoFalecimentoResposta,
      "falecimento",
    );

    const autor = await this.autorService.cadastrar(
      nome,
      nacionalidade.trim() === "" ? null : nacionalidade,
      anoNascimento,
      anoFalecimento,
    );

    console.log("\nAutor cadastrado com sucesso!\n");

    this.autorView.mostrarAutores([autor]);
  }

  private async atualizar(): Promise<void> {
    console.log("\n=== Atualizar autor ===\n");

    const respostaId = await input({
      message: "ID do autor que deseja atualizar:",
    });

    const id = Number(respostaId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro maior que zero.");
    }

    const autor = await this.autorService.buscarPorId(id);

    if (!autor) {
      console.log("\nAutor não encontrado.\n");
      return;
    }

    console.log("\nAutor selecionado:");
    this.autorView.mostrarAutores([autor]);

    const nome = await input({
      message: "Nome:",
      default: autor.nome,
    });

    const nacionalidade = await input({
      message: "Nacionalidade:",
      default: autor.nacionalidade ?? "",
    });

    const anoNascimentoResposta = await input({
      message: "Ano de nascimento:",
      default: autor.ano_nascimento?.toString() ?? "",
    });

    const anoFalecimentoResposta = await input({
      message: "Ano de falecimento:",
      default: autor.ano_falecimento?.toString() ?? "",
    });

    const anoNascimento = this.converterAnoOpcional(
      anoNascimentoResposta,
      "nascimento",
    );

    const anoFalecimento = this.converterAnoOpcional(
      anoFalecimentoResposta,
      "falecimento",
    );

    const autorAtualizado = await this.autorService.atualizar(
      id,
      nome,
      nacionalidade.trim() === "" ? null : nacionalidade,
      anoNascimento,
      anoFalecimento,
    );

    if (!autorAtualizado) {
      console.log("\nAutor não encontrado.\n");
      return;
    }

    console.log("\nAutor atualizado com sucesso!\n");

    this.autorView.mostrarAutores([autorAtualizado]);
  }

  private async remover(): Promise<void> {
    console.log("\n=== Remover autor ===\n");

    const respostaId = await input({
      message: "ID do autor que deseja remover:",
    });

    const id = Number(respostaId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro maior que zero.");
    }

    const autor = await this.autorService.buscarPorId(id);

    if (!autor) {
      console.log("\nAutor não encontrado.\n");
      return;
    }

    console.log("\nAutor selecionado:");
    this.autorView.mostrarAutores([autor]);

    const confirmar = await confirm({
      message: `Deseja realmente remover o autor "${autor.nome}"?`,
      default: false,
    });

    if (!confirmar) {
      console.log("\nOperação cancelada.\n");
      return;
    }

    const removido = await this.autorService.excluir(id);

    if (!removido) {
      console.log("\nAutor não encontrado.\n");
      return;
    }

    console.log("\nAutor removido com sucesso!\n");
  }

  private converterAnoOpcional(valor: string, tipo: string): number | null {
    if (valor.trim() === "") {
      return null;
    }

    const ano = Number(valor);

    if (!Number.isInteger(ano) || ano <= 0) {
      throw new Error(
        `O ano de ${tipo} deve ser um número inteiro maior que zero.`,
      );
    }

    return ano;
  }
}
