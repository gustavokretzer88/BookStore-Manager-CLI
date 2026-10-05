import { ClienteService } from "../services/ClienteService";
import {
  ClienteView,
  OpcaoBuscarClientePor,
  OpcoesMenuCliente,
} from "../views/ClienteView";

export class ClienteController {
  private readonly clienteView: ClienteView = new ClienteView();

  constructor(private readonly clienteService: ClienteService) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      switch (await this.clienteView.mostrarOpcoes()) {
        case OpcoesMenuCliente.buscar:
          await this.buscar();
          break;
        case OpcoesMenuCliente.adicionar:
          await this.adicionar();
          break;
        case OpcoesMenuCliente.atualizar:
          await this.atualizar();
          break;
        case OpcoesMenuCliente.remover:
          await this.remover();
          break;
        case OpcoesMenuCliente.sair:
          continuar = false;
          break;
      }
    }
  }

  private async buscar(): Promise<void> {
    switch (await this.clienteView.mostraOpcoesBuscarClientePor()) {
      case OpcaoBuscarClientePor.todos:
        await this.buscarClienteTodos();
        break;
      case OpcaoBuscarClientePor.id:
        await this.buscarClientePorId();
        break;
      case OpcaoBuscarClientePor.nome:
        await this.buscarClientePorNome();
        break;
      case OpcaoBuscarClientePor.email:
        await this.buscarClientePorEmail();
        break;
      case OpcaoBuscarClientePor.sair:
        break;
    }
  }

  private async buscarClienteTodos() {
    const clientes = await this.clienteService.buscarTodos();
    this.clienteView.mostrarClientes(clientes);
  }

  private async buscarClientePorId() {
    const id = await this.clienteView.perguntarNumero("ID do cliente:");
    const cliente = await this.clienteService.buscarPorId(id);
    this.clienteView.mostrarClientes(cliente ? [cliente] : []);
  }

  private async buscarClientePorNome() {
    const nome = await this.clienteView.perguntar("Nome do cliente:");
    const clientes = await this.clienteService.buscarPorNome(nome);
    this.clienteView.mostrarClientes(clientes);
  }

  private async buscarClientePorEmail() {
    const email = await this.clienteView.perguntar("E-mail do cliente:");
    const cliente = await this.clienteService.buscarPorEmail(email);
    this.clienteView.mostrarClientes(cliente ? [cliente] : []);
  }

  private async adicionar(): Promise<void> {
    const dadosCliente = await this.clienteView.solicitaDadosCliente();
    const cliente = await this.clienteService.cadastrar(dadosCliente);

    this.clienteView.mostrarClientes(
      [cliente],
      "Cliente cadastrado com sucesso!",
    );
  }

  private async atualizar(): Promise<void> {
    const id = await this.clienteView.perguntarNumero(
      "ID do cliente que deseja atualizar:",
    );
    const cliente = await this.clienteService.buscarPorId(id);

    if (!cliente) throw new Error("Cliente não encontrado.");

    this.clienteView.mostrarClientes([cliente], "Cliente selecionado:");

    const dadosLivroAtualizado =
      await this.clienteView.solicitaDadosAtualizarCliente(cliente);

    const clienteAtualizado =
      await this.clienteService.atualizar(dadosLivroAtualizado);

    if (!clienteAtualizado) throw Error("Erro ao atualizar cliente.");

    this.clienteView.mostrarClientes(
      [clienteAtualizado],
      "Cliente atualizado com sucesso!",
    );
  }

  private async remover(): Promise<void> {
    const id = await this.clienteView.perguntarNumero(
      "ID do cliente que deseja remover:",
    );

    const cliente = await this.clienteService.buscarPorId(id);

    if (!cliente) throw new Error("Cliente não encontrado.");

    this.clienteView.mostrarClientes([cliente], "Cliente selecionado:");

    const confirmar = await this.clienteView.solicitaConfirmacao(
      `Deseja realmente remover o cliente "${cliente.nome}"?`,
    );
    if (!confirmar) return;

    const removido = await this.clienteService.excluir(id);

    if (!removido) throw new Error("Cliente não encontrado.");

    this.clienteView.mensagemSucesso("Cliente removido!");
  }
}
