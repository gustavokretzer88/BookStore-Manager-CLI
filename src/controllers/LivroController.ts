import Table from "cli-table3";
import { confirm, input, select } from "@inquirer/prompts";

import { Livro } from "../models/Livro";
import { LivroComAutorDTO } from "../dtos/livro/LivroComAutorDTO";
import { LivroService } from "../services/LivroService";
import { AutorService } from "../services/AutorService";
import { LivroView } from "../views/LivroView";

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

export class LivroController {
  private readonly livroView: LivroView = new LivroView();

  constructor(
    private readonly livroService: LivroService,
    private readonly autorService: AutorService,
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
        this.livroView.mostrarLivros(
          await this.livroService.buscarTodosComAutor(),
        );
        break;

      case ModoBusca.titulo: {
        const titulo = await input({
          message: "Título do livro:",
        });

        this.livroView.mostrarLivros(
          await this.livroService.buscarPorTituloComAutor(titulo),
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

        const livro = await this.livroService.buscarPorIdComAutor(id);

        this.livroView.mostrarLivros(livro ? [livro] : []);

        break;
      }

      case ModoBusca.isbn: {
        const isbn = await input({
          message: "ISBN do livro:",
        });

        const livro = await this.livroService.buscarPorIsbnComAutor(isbn);

        this.livroView.mostrarLivros(livro ? [livro] : []);

        break;
      }

      case ModoBusca.nomeAutor: {
        const nomeAutor = await input({
          message: "Nome do autor:",
        });

        this.livroView.mostrarLivros(
          await this.livroService.buscarPorNomeAutorComAutor(nomeAutor),
        );

        break;
      }

      case ModoBusca.numeroChamada: {
        const numeroChamada = await input({
          message: "Número de chamada:",
        });

        this.livroView.mostrarLivros(
          await this.livroService.buscarPorNumeroChamadaComAutor(numeroChamada),
        );

        break;
      }

      case ModoBusca.sair:
        break;
    }
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
    const autores = await this.autorService.buscarTodos();

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

    const livro = await this.livroService.cadastrar(
      titulo,
      isbn.trim(),
      numeroChamada,
      anoPublicacao,
      autorId,
    );

    this.livroView.mostrarLivros([livro], "Livro cadastrado com sucesso!");
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

    const livro = await this.livroService.buscarPorId(id);

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

    const autores = await this.autorService.buscarTodos();

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

    const livroAtualizado = await this.livroService.atualizar(
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

    this.livroView.mostrarLivros(
      [livroAtualizado],
      "Livro atualizado com sucesso!",
    );
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

    const livro = await this.livroService.buscarPorId(id);

    if (!livro) {
      console.log("\nLivro não encontrado.\n");
      return;
    }

    this.livroView.mostrarLivros([livro], "Livro selecionado:");

    const confirmar = await confirm({
      message: `Deseja realmente remover o livro "${livro.titulo}"?`,
      default: false,
    });

    if (!confirmar) {
      console.log("\nOperação cancelada.\n");
      return;
    }

    const removido = await this.livroService.excluir(id);

    if (!removido) {
      console.log("\nLivro não encontrado.\n");
      return;
    }

    console.log("\nLivro removido com sucesso!\n");
  }
}
