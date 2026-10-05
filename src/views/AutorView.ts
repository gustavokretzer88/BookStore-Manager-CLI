import { Autor } from "../models/Autor";
import Table from "cli-table3";
import { confirm, input, select } from "@inquirer/prompts";
import { CriarAutorDTO } from "../dtos/autor/CriarAutorDTO";
import { BaseView } from "./BaseView";

export enum OpcoesMenuAutor {
  buscar,
  adicionar,
  atualizar,
  remover,
  sair,
}

export enum OpcoesBuscarAutorPor {
  todos,
  id,
  nome,
  sair,
}

export class AutorView extends BaseView {
  async mostrarOpcoes(): Promise<OpcoesMenuAutor> {
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

  async mostraOpcoesBuscarAutorPor(): Promise<OpcoesBuscarAutorPor> {
    return await select({
      message: "Buscar autor por:",
      choices: [
        {
          name: "Listar todos",
          value: OpcoesBuscarAutorPor.todos,
        },
        {
          name: "ID",
          value: OpcoesBuscarAutorPor.id,
        },
        {
          name: "Nome",
          value: OpcoesBuscarAutorPor.nome,
        },
        {
          name: "Sair",
          value: OpcoesBuscarAutorPor.sair,
        },
      ],
    });
  }

  async selecionaAutor(autores: Autor[]): Promise<Autor> {
    return await select({
      message: "Selecione o autor:",
      choices: autores.map((autor) => ({
        name: autor.nome,
        value: autor,
      })),
    });
  }

  async solicitaIdAutor(): Promise<number> {
    const resposta = await input({
      message: "ID do autor:",
    });

    const id = Number(resposta);

    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("O ID deve ser um número inteiro maior que zero.");
    }

    return id;
  }

  async solicitaNomeAutor(): Promise<string> {
    return await input({
      message: "Nome do autor:",
    });
  }

  async solicitaDadosCriarAutor(): Promise<CriarAutorDTO> {
    const nome = await input({
      message: "Nome do autor:",
    });

    const nacionalidade = await input({
      message: "Nacionalidade (opcional):",
    });

    const anoNascimentoResposta = await input({
      message: "Ano de nascimento (opcional):",
    });

    const anoNascimento = this.verificaEntradaAno(anoNascimentoResposta);

    const anoFalecimentoResposta = await input({
      message: "Ano de falecimento (opcional):",
    });

    const anoFalecimento = this.verificaEntradaAno(anoNascimentoResposta);

    const dados: CriarAutorDTO = {
      nome: nome,
      nacionalidade: nacionalidade,
      ano_nascimento: anoNascimento,
      ano_falecimento: anoFalecimento,
    };
    return dados;
  }

  async solicitaDadosAtualizarAutor(autor: Autor): Promise<Autor> {
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

    const anoNascimento = this.verificaEntradaAno(anoNascimentoResposta);

    const anoFalecimentoResposta = await input({
      message: "Ano de falecimento:",
      default: autor.ano_falecimento?.toString() ?? "",
    });

    const anoFalecimento = this.verificaEntradaAno(anoNascimentoResposta);

    const dados: Autor = {
      id: autor.id,
      nome: nome,
      nacionalidade: nacionalidade,
      ano_nascimento: anoNascimento,
      ano_falecimento: anoFalecimento,
    };

    return dados;
  }

  mostrarAutores(autores: Autor[], mensagem?: string): void {
    if (mensagem !== undefined && mensagem?.length !== 0) {
      console.log(mensagem);
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

  private verificaEntradaAno(valor: string): number | null {
    if (valor.trim() === "") {
      return null;
    }

    const ano = Number(valor);

    if (!Number.isInteger(ano) || ano <= 0) {
      throw new Error(`O ano de deve ser um número inteiro maior que zero.`);
    }

    return ano;
  }
}
