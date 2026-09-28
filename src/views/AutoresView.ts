import { confirm, input, select } from "@inquirer/prompts";
import Table from "cli-table3";

import { AutorController } from "../controllers/AutorController";
import { Autor } from "../models/Autor";

enum OpcoesMenuAutor {
  buscar,
  adicionar,
  atualizar,
  remover,
  sair,
}

export class AutorView {
  constructor(private readonly autorController: AutorController) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      try {
        const opcao = await this.mostrarOpcoes();

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

  private async mostrarOpcoes(): Promise<OpcoesMenuAutor> {
    return await select({
      message: "Gerenciador de autores:",
      choices: [
        {
          name: "Buscar",
          value: OpcoesMenuAutor.buscar,
        },
        {
          name: "Adicionar",
          value: OpcoesMenuAutor.adicionar,
        },
        {
          name: "Atualizar",
          value: OpcoesMenuAutor.atualizar,
        },
        {
          name: "Remover",
          value: OpcoesMenuAutor.remover,
        },
        {
          name: "Sair",
          value: OpcoesMenuAutor.sair,
        },
      ],
    });
  }

  private async buscar(): Promise<void> {
    enum ModoBusca {
      listar,
      id,
      nome,
      sair,
    }

    const selecao = await select({
      message: "Buscar autor por:",
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
          name: "Nome",
          value: ModoBusca.nome,
        },
        {
          name: "Sair",
          value: ModoBusca.sair,
        },
      ],
    });

    switch (selecao) {
      case ModoBusca.listar: {
        const autores = await this.autorController.listar();

        this.mostrarAutores(autores);
        break;
      }

      case ModoBusca.id: {
        const resposta = await input({
          message: "ID do autor:",
        });

        const id = Number(resposta);

        if (!Number.isInteger(id) || id <= 0) {
          throw new Error("O ID deve ser um número inteiro maior que zero.");
        }

        const autor = await this.autorController.buscarPorId(id);

        this.mostrarAutores(autor ? [autor] : []);

        break;
      }

      case ModoBusca.nome: {
        const nome = await input({
          message: "Nome do autor:",
        });

        const autores = await this.autorController.buscarPorNome(nome);

        this.mostrarAutores(autores);

        break;
      }

      case ModoBusca.sair:
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

    const autor = await this.autorController.cadastrar(
      nome,
      nacionalidade.trim() === "" ? null : nacionalidade,
      anoNascimento,
      anoFalecimento,
    );

    console.log("\nAutor cadastrado com sucesso!\n");

    this.mostrarAutores([autor]);
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

    const autor = await this.autorController.buscarPorId(id);

    if (!autor) {
      console.log("\nAutor não encontrado.\n");
      return;
    }

    console.log("\nAutor selecionado:");
    this.mostrarAutores([autor]);

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

    const autorAtualizado = await this.autorController.atualizar(
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

    this.mostrarAutores([autorAtualizado]);
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

    const autor = await this.autorController.buscarPorId(id);

    if (!autor) {
      console.log("\nAutor não encontrado.\n");
      return;
    }

    console.log("\nAutor selecionado:");
    this.mostrarAutores([autor]);

    const confirmar = await confirm({
      message: `Deseja realmente remover o autor "${autor.nome}"?`,
      default: false,
    });

    if (!confirmar) {
      console.log("\nOperação cancelada.\n");
      return;
    }

    const removido = await this.autorController.excluir(id);

    if (!removido) {
      console.log("\nAutor não encontrado.\n");
      return;
    }

    console.log("\nAutor removido com sucesso!\n");
  }

  private mostrarAutores(autores: Autor[]): void {
    if (autores.length === 0) {
      console.log("\nNenhum autor encontrado.\n");
      return;
    }

    const tabela = new Table({
      head: ["ID", "Nome", "Nacionalidade", "Nascimento", "Falecimento"],
    });

    for (const autor of autores) {
      tabela.push([
        autor.id,
        autor.nome,
        autor.nacionalidade ?? "-",
        autor.ano_nascimento ?? "-",
        autor.ano_falecimento ?? "-",
      ]);
    }

    console.log(tabela.toString());
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
