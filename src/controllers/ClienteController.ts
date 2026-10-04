import { confirm, input, select } from "@inquirer/prompts";

import { ClienteService } from "../services/ClienteService";
import { ClienteView, OpcoesMenuCliente } from "../views/ClienteView";

export class ClienteController {
  private readonly clienteView: ClienteView = new ClienteView();

  constructor(private readonly clienteService: ClienteService) {}

  async executar(): Promise<void> {
    let continuar = true;

    while (continuar) {
      try {
        const opcao = await this.clienteView.mostrarOpcoes();

        switch (opcao) {
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
      } catch (erro) {
        console.error("\nErro:", erro instanceof Error ? erro.message : erro);
      }
    }
  }

  private async buscar(): Promise<void> {
    enum ModoBusca {
      listar,
      id,
      nome,
      email,
      sair,
    }

    const selecao = await select({
      message: "Buscar cliente por:",
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
          name: "E-mail",
          value: ModoBusca.email,
        },
        {
          name: "Sair",
          value: ModoBusca.sair,
        },
      ],
    });

    switch (selecao) {
      case ModoBusca.listar: {
        const clientes = await this.clienteService.buscarTodos();

        this.clienteView.mostrarClientes(clientes);
        break;
      }

      case ModoBusca.id: {
        const resposta = await input({
          message: "ID do cliente:",
        });

        const id = Number(resposta);

        if (!Number.isInteger(id) || id <= 0) {
          throw new Error("O ID deve ser um número inteiro maior que zero.");
        }

        const cliente = await this.clienteService.buscarPorId(id);

        this.clienteView.mostrarClientes(cliente ? [cliente] : []);

        break;
      }

      case ModoBusca.nome: {
        const nome = await input({
          message: "Nome do cliente:",
        });

        const clientes = await this.clienteService.buscarPorNome(nome);

        this.clienteView.mostrarClientes(clientes);
        break;
      }

      case ModoBusca.email: {
        const email = await input({
          message: "E-mail do cliente:",
        });

        const cliente = await this.clienteService.buscarPorEmail(email);

        this.clienteView.mostrarClientes(cliente ? [cliente] : []);

        break;
      }

      case ModoBusca.sair:
        break;
    }
  }

  private async adicionar(): Promise<void> {
    console.log("\n=== Adicionar cliente ===\n");

    const nome = await input({
      message: "Nome do cliente:",
    });

    const email = await input({
      message: "E-mail:",
    });

    const telefone = await input({
      message: "Telefone (opcional):",
    });

    const cliente = await this.clienteService.cadastrar(
      nome,
      email,
      telefone.trim() === "" ? null : telefone,
    );

    this.clienteView.mostrarClientes(
      [cliente],
      "Cliente cadastrado com sucesso!",
    );
  }

  private async atualizar(): Promise<void> {
    console.log("\n=== Atualizar cliente ===\n");

    const respostaId = await input({
      message: "ID do cliente que deseja atualizar:",
    });

    const id = Number(respostaId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro maior que zero.");
    }

    const cliente = await this.clienteService.buscarPorId(id);

    if (!cliente) {
      console.log("\nCliente não encontrado.\n");
      return;
    }

    this.clienteView.mostrarClientes([cliente], "Cliente selecionado:");

    const nome = await input({
      message: "Nome:",
      default: cliente.nome,
    });

    const email = await input({
      message: "E-mail:",
      default: cliente.email,
    });

    const telefone = await input({
      message: "Telefone:",
      default: cliente.telefone ?? "",
    });

    const clienteAtualizado = await this.clienteService.atualizar(
      id,
      nome,
      email,
      telefone.trim() === "" ? null : telefone,
    );

    if (!clienteAtualizado) {
      console.log("\nCliente não encontrado.\n");
      return;
    }

    this.clienteView.mostrarClientes(
      [clienteAtualizado],
      "Cliente atualizado com sucesso!",
    );
  }

  private async remover(): Promise<void> {
    console.log("\n=== Remover cliente ===\n");

    const respostaId = await input({
      message: "ID do cliente que deseja remover:",
    });

    const id = Number(respostaId);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro maior que zero.");
    }

    const cliente = await this.clienteService.buscarPorId(id);

    if (!cliente) {
      console.log("\nCliente não encontrado.\n");
      return;
    }

    this.clienteView.mostrarClientes([cliente], "Cliente selecionado:");

    const confirmar = await confirm({
      message: `Deseja realmente remover o cliente "${cliente.nome}"?`,
      default: false,
    });

    if (!confirmar) {
      console.log("\nOperação cancelada.\n");
      return;
    }

    const removido = await this.clienteService.excluir(id);

    if (!removido) {
      console.log("\nCliente não encontrado.\n");
      return;
    }

    console.log("\nCliente removido com sucesso!\n");
  }
}
