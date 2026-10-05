import { AutorService } from "../services/AutorService";
import {
  AutorView,
  OpcoesBuscarAutorPor,
  OpcoesMenuAutor,
} from "../views/AutorView";
import { Autor } from "../models/Autor";

export class AutorController {
  private readonly autorView: AutorView = new AutorView();

  constructor(private readonly autorService: AutorService) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      switch (await this.autorView.mostrarOpcoes()) {
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
    }
  }

  private async buscar(): Promise<void> {
    switch (await this.autorView.mostraOpcoesBuscarAutorPor()) {
      case OpcoesBuscarAutorPor.todos:
        this.buscarPorTodosAutores();
        break;
      case OpcoesBuscarAutorPor.id:
        await this.buscarPorId();
        break;
      case OpcoesBuscarAutorPor.nome:
        await this.buscarPorNome();
        break;
      case OpcoesBuscarAutorPor.sair:
        break;
    }
  }

  private async buscarPorTodosAutores() {
    const autores = await this.autorService.buscarTodos();
    this.autorView.mostrarAutores(autores);
  }

  private async buscarPorId() {
    const id = await this.autorView.solicitaIdAutor();
    const autor = await this.autorService.buscarPorId(id);
    this.autorView.mostrarAutores(autor ? [autor] : []);
  }

  private async buscarPorNome() {
    const nome = await this.autorView.solicitaNomeAutor();
    const autores = await this.autorService.buscarPorNome(nome);
    this.autorView.mostrarAutores(autores);
  }

  private async adicionar(): Promise<void> {
    const dadosAutor = await this.autorView.solicitaDadosCriarAutor();
    const autor = await this.autorService.cadastrar(dadosAutor);
    this.autorView.mostrarAutores([autor], "Autor cadastrado com sucesso!");
  }

  private async atualizar(): Promise<void> {
    const id = await this.autorView.solicitaIdAutor();
    const autor = await this.autorService.buscarPorId(id);

    if (!autor) {
      throw new Error("Autor não encontrado.");
      return;
    }

    this.autorView.mostrarAutores([autor], "Autor selecionado:");

    const dadosAutor = await this.autorView.solicitaDadosAtualizarAutor(autor);

    const dadosAutorAtualizado: Autor = {
      id: autor.id,
      nome: dadosAutor.nome,
      nacionalidade: dadosAutor.nacionalidade,
      ano_nascimento: dadosAutor.ano_nascimento,
      ano_falecimento: dadosAutor.ano_falecimento,
    };

    const autorAtualizado =
      await this.autorService.atualizar(dadosAutorAtualizado);

    if (!autorAtualizado) {
      console.log("\nAutor não encontrado.\n");
      return;
    }

    this.autorView.mostrarAutores(
      [autorAtualizado],
      "Autor atualizado com sucesso!",
    );
  }

  private async remover(): Promise<void> {
    const id = await this.autorView.solicitaIdAutor();
    const autor = await this.autorService.buscarPorId(id);

    if (!autor) {
      throw new Error("Autor não encontrado.");
    }

    this.autorView.mostrarAutores([autor], "Autor selecionado:");
    if (
      !(await this.autorView.solicitaConfirmacao(
        `Deseja realmente remover o autor "${autor.nome}"?`,
      ))
    ) {
      return;
    }
    const removido = await this.autorService.excluir(id);
    if (!removido) {
      throw new Error("Autor não encontrado.");
    }
  }
}
