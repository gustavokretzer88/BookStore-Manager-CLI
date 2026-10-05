import { confirm } from "@inquirer/prompts";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export class BaseView {
  private readonly rl = readline.createInterface({
    input,
    output,
  });

  mensagemSucesso(mensagem: string): void {
    console.log(`\n✓ ${mensagem}`);
  }

  mensagemErro(mensagem: string): void {
    console.error(`\n✗ ${mensagem}`);
  }

  mensagem(mensagem: string): void {
    console.log(mensagem);
  }

  async solicitaConfirmacao(mensagem: string): Promise<boolean> {
    return await confirm({
      message: mensagem,
      default: false,
    });
  }
  async perguntar(mensagem: string): Promise<string> {
    return (await this.rl.question(mensagem)).trim();
  }

  async perguntarNumero(mensagem: string): Promise<number> {
    const resposta = await this.perguntar(mensagem);
    const numero = Number(resposta);

    if (!Number.isInteger(numero)) {
      throw new Error("Digite um número inteiro válido.");
    }

    return numero;
  }

  fechar(): void {
    this.rl.close();
  }
}
