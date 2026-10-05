import { confirm, input } from "@inquirer/prompts";

export class BaseView {
  mensagemSucesso(mensagem: string): void {
    console.log(`\n✓ ${mensagem}\n`);
  }

  mensagemErro(mensagem: string): void {
    console.error(`\n✗ ${mensagem}\n`);
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
    return await input({ message: mensagem });
  }

  async perguntarNumero(mensagem: string): Promise<number> {
    const resposta = await this.perguntar(mensagem);
    const numero = Number(resposta);

    if (!Number.isInteger(numero)) {
      throw new Error("Digite um número inteiro válido.");
    }

    return numero;
  }

  // fechar(): void {
  //   this.rl.close();
  // }
}
