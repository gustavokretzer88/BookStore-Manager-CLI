import Table from "cli-table3";
import { confirm, input, select } from "@inquirer/prompts";

import { LivroController } from "../controllers/LivroController";
import { AutorController } from "../controllers/AutorController";
import { Livro } from "../models/Livro";
import { LivroComAutorDTO } from "../dtos/livro/LivroComAutorDTO";

enum OpcoesMenuLivros {
  buscar,
  adicionar,
  atualizar,
  remover,
  sair,
}

enum ModoBusca {
  listar,
  titulo,
  id,
  isbn,
  nomeAutor,
  numeroChamada,
  sair,
}

export class LivroView {
  constructor(
    private readonly livroController: LivroController,
    private readonly autorController: AutorController,
  ) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      try {
        const opcao = await this.mostrarOpcoes();

        switch (opcao) {
          case OpcoesMenuLivros.buscar:
            await this.buscar();
            break;

          case OpcoesMenuLivros.adicionar:
            await this.adicionar();
            break;

          case OpcoesMenuLivros.atualizar:
            await this.atualizar();
            break;

          case OpcoesMenuLivros.remover:
            await this.remover();
            break;

          case OpcoesMenuLivros.sair:
            continuar = false;
            break;
        }
      } catch (erro) {
        console.error(erro);
      }
    }
  }

  private async mostrarOpcoes(): Promise<OpcoesMenuLivros> {
    return await select({
      message: "Gerenciador de livros:",
      choices: [
        {
          name: "Buscar",
          value: OpcoesMenuLivros.buscar,
        },
        {
          name: "Adicionar",
          value: OpcoesMenuLivros.adicionar,
        },
        {
          name: "Atualizar",
          value: OpcoesMenuLivros.atualizar,
        },
        {
          name: "Remover",
          value: OpcoesMenuLivros.remover,
        },
        {
          name: "Sair",
          value: OpcoesMenuLivros.sair,
        },
      ],
    });
  }

  private async buscar(): Promise<void> {
    const selecao = await select({
      message: "Buscar livro por:",
      choices: [
        {
          name: "Listar todos",
          value: ModoBusca.listar,
        },
        {
          name: "Título",
          value: ModoBusca.titulo,
        },
        {
          name: "ID",
          value: ModoBusca.id,
        },
        {
          name: "ISBN",
          value: ModoBusca.isbn,
        },
        {
          name: "Nome do autor",
          value: ModoBusca.nomeAutor,
        },
        {
          name: "Número de chamada",
          value: ModoBusca.numeroChamada,
        },
        {
          name: "Sair",
          value: ModoBusca.sair,
        },
      ],
    });

    switch (selecao) {
      case ModoBusca.listar:
        this.mostrarLivros(await this.livroController.listarComAutor());
        break;

      case ModoBusca.titulo: {
        const titulo = await input({
          message: "Título do livro:",
        });

        this.mostrarLivros(
          await this.livroController.buscarPorTituloComAutor(titulo),
        );
        break;
      }

      case ModoBusca.id: {
        const resposta = await input({
          message: "ID do livro:",
        });

        const id = Number(resposta);

        if (!Number.isInteger(id) || id <= 0) {
          throw new Error("O ID deve ser um número inteiro maior que zero.");
        }

        const livro = await this.livroController.buscarPorIdComAutor(id);

        this.mostrarLivros(livro ? [livro] : []);

        break;
      }

      case ModoBusca.isbn: {
        const isbn = await input({
          message: "ISBN do livro:",
        });

        const livro = await this.livroController.buscarPorIsbnComAutor(isbn);

        this.mostrarLivros(livro ? [livro] : []);

        break;
      }

      case ModoBusca.nomeAutor: {
        const nomeAutor = await input({
          message: "Nome do autor:",
        });

        this.mostrarLivros(
          await this.livroController.buscarPorNomeAutorComAutor(nomeAutor),
        );

        break;
      }

      case ModoBusca.numeroChamada: {
        const numeroChamada = await input({
          message: "Número de chamada:",
        });

        this.mostrarLivros(
          await this.livroController.buscarPorNumeroChamadaComAutor(
            numeroChamada,
          ),
        );

        break;
      }

      case ModoBusca.sair:
        break;
    }
  }

  private mostrarLivros(livros: Livro[] | LivroComAutorDTO[]): void {
    if (livros.length === 0) {
      console.log("Nenhum livro encontrado.");
      return;
    }

    const labelColunaAutor =
      "autor_id" in livros[0]! ? "AutorID" : "Nome do autor";

    const tabela = new Table({
      head: ["ID", "Título", "ISBN", "Ano", "Nº chamada", labelColunaAutor],
    });

    for (const livro of livros) {
      tabela.push([
        livro.id,
        livro.titulo,
        livro.isbn ?? "-",
        livro.ano_publicacao ?? "-",
        livro.numero_chamada ?? "-",
        "autor_id" in livro ? livro.autor_id : livro.autor_nome,
      ]);
    }

    console.log(tabela.toString());
  }

  private async adicionar(): Promise<void> {
    console.log("\n=== Adicionar livro ===\n");

    const titulo = await input({
      message: "Título do livro:",
    });

    const isbn = await input({
      message: "ISBN (opcional):",
    });

    const anoResposta = await input({
      message: "Ano de publicação:",
    });

    const numeroChamada = await input({
      message: "Número de chamada:",
    });

    // Buscar autores cadastrados
    const autores = await this.autorController.listar();

    if (autores.length === 0) {
      throw new Error(
        "Não é possível cadastrar o livro porque não existem autores cadastrados.",
      );
    }

    const autorId = await select({
      message: "Selecione o autor:",
      choices: autores.map((autor) => ({
        name: autor.nome,
        value: autor.id,
      })),
    });

    const anoPublicacao = Number(anoResposta);

    if (
      anoPublicacao !== null &&
      (!Number.isInteger(anoPublicacao) || anoPublicacao <= 0)
    ) {
      throw new Error(
        "O ano de publicação deve ser um número inteiro maior que zero.",
      );
    }

    const livro = await this.livroController.cadastrar(
      titulo,
      isbn.trim(),
      numeroChamada,
      anoPublicacao,
      autorId,
    );

    console.log("\nLivro cadastrado com sucesso!\n");

    this.mostrarLivros([livro]);
  }

  private async atualizar(): Promise<void> {
    console.log("\n=== Atualizar livro ===\n");

    const respostaId = await input({
      message: "ID do livro que deseja atualizar:",
    });

    const id = Number(respostaId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro maior que zero.");
    }

    const livro = await this.livroController.buscarPorId(id);

    if (!livro) {
      console.log("\nLivro não encontrado.\n");
      return;
    }

    console.log(`\nLivro selecionado: ${livro.titulo}\n`);

    const titulo = await input({
      message: "Título:",
      default: livro.titulo,
    });

    const isbn = await input({
      message: "ISBN:",
      default: livro.isbn ?? "",
    });

    const anoResposta = await input({
      message: "Ano de publicação:",
      default: livro.ano_publicacao?.toString() ?? "",
    });

    const numeroChamada = await input({
      message: "Número de chamada:",
      default: livro.numero_chamada ?? "",
    });

    const autores = await this.autorController.listar();

    if (autores.length === 0) {
      throw new Error(
        "Não é possível atualizar o livro porque não existem autores cadastrados.",
      );
    }

    const autorId = await select({
      message: "Selecione o autor:",
      choices: autores.map((autor) => ({
        name: autor.nome,
        value: autor.id,
      })),
      default: livro.autor_id,
    });

    const anoPublicacao = Number(anoResposta);

    if (
      anoPublicacao !== null &&
      (!Number.isInteger(anoPublicacao) || anoPublicacao <= 0)
    ) {
      throw new Error(
        "O ano de publicação deve ser um número inteiro maior que zero.",
      );
    }

    const livroAtualizado = await this.livroController.atualizar(
      id,
      titulo,
      isbn,
      anoPublicacao,
      numeroChamada,
      autorId,
    );

    if (!livroAtualizado) {
      console.log("\nLivro não encontrado.\n");
      return;
    }

    console.log("\nLivro atualizado com sucesso!\n");

    this.mostrarLivros([livroAtualizado]);
  }

  private async remover(): Promise<void> {
    console.log("\n=== Remover livro ===\n");

    const respostaId = await input({
      message: "ID do livro que deseja remover:",
    });

    const id = Number(respostaId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro maior que zero.");
    }

    const livro = await this.livroController.buscarPorId(id);

    if (!livro) {
      console.log("\nLivro não encontrado.\n");
      return;
    }

    console.log("\nLivro selecionado:");
    this.mostrarLivros([livro]);

    const confirmar = await confirm({
      message: `Deseja realmente remover o livro "${livro.titulo}"?`,
      default: false,
    });

    if (!confirmar) {
      console.log("\nOperação cancelada.\n");
      return;
    }

    const removido = await this.livroController.excluir(id);

    if (!removido) {
      console.log("\nLivro não encontrado.\n");
      return;
    }

    console.log("\nLivro removido com sucesso!\n");
  }
}
