import Table from "cli-table3";
import { input, select } from "@inquirer/prompts";
import { EstadoConservacao, Exemplar } from "../models/Exemplar";
import { BaseView } from "./BaseView";
import { Livro } from "../models/Livro";
import { CriarExemplarDTO } from "../dtos/exemplar/CriarExemplarDTO";

export enum OpcoesMenuExemplar {
  buscar,
  adicionar,
  atualizar,
  remover,
  sair,
}

export enum OpcoesBuscarExemplarPor {
  todos,
  id,
  codigo,
  livro,
  estado,
  disponiveis,
  sair,
}

export class ExemplarView extends BaseView {
  async mostrarOpcoes(): Promise<OpcoesMenuExemplar> {
    return await select({
      message: "Gerenciador de exemplares:",
      choices: [
        {
          name: "Buscar",
          value: OpcoesMenuExemplar.buscar,
        },
        {
          name: "Adicionar",
          value: OpcoesMenuExemplar.adicionar,
        },
        {
          name: "Atualizar",
          value: OpcoesMenuExemplar.atualizar,
        },
        {
          name: "Remover",
          value: OpcoesMenuExemplar.remover,
        },
        {
          name: "Sair",
          value: OpcoesMenuExemplar.sair,
        },
      ],
    });
  }

  async mostrarOpcoesBusca(): Promise<OpcoesBuscarExemplarPor> {
    return await select({
      message: "Buscar exemplar por:",
      choices: [
        {
          name: "Listar todos",
          value: OpcoesBuscarExemplarPor.todos,
        },
        {
          name: "ID",
          value: OpcoesBuscarExemplarPor.id,
        },
        {
          name: "Código",
          value: OpcoesBuscarExemplarPor.codigo,
        },
        {
          name: "Livro",
          value: OpcoesBuscarExemplarPor.livro,
        },
        {
          name: "Estado de conservação",
          value: OpcoesBuscarExemplarPor.estado,
        },
        {
          name: "Disponíveis",
          value: OpcoesBuscarExemplarPor.disponiveis,
        },
        {
          name: "Sair",
          value: OpcoesBuscarExemplarPor.sair,
        },
      ],
    });
  }

  mostrarExemplares(exemplares: Exemplar[], mensagem?: string): void {
    if (mensagem !== undefined && mensagem.length !== 0) {
      console.log(mensagem);
    }

    const tabela = new Table({
      head: ["ID", "Código", "Livro ID", "Estado"],
    });

    for (const exemplar of exemplares) {
      tabela.push([
        exemplar.id,
        exemplar.codigo,
        exemplar.livro_id,
        exemplar.estado_conservacao,
      ]);
    }

    console.log(tabela.toString());
  }

  async selecionarEstado(
    estadoAtual?: EstadoConservacao,
  ): Promise<EstadoConservacao> {
    const selecao = await select({
      message: "Estado de conservação:",
      choices: [
        {
          name: "Novo",
          value: "NOVO",
        },
        {
          name: "Bom",
          value: "BOM",
        },
        {
          name: "Regular",
          value: "REGULAR",
        },
        {
          name: "Ruim",
          value: "RUIM",
        },
      ],
    });
    if (selecao.length !== 0) {
      return selecao;
    }
    if (estadoAtual !== undefined) {
      return estadoAtual;
    }
    throw new Error("Erro ao selecionar estado");
  }

  async selecionaLivro(livros: Livro[]): Promise<number> {
    return await select({
      message: "Selecione o livro:",
      choices: livros.map((livro) => ({
        name: `${livro.titulo} (ID: ${livro.id})`,
        value: livro.id,
      })),
    });
  }

  async solicitaDadosExemplar(livros: Livro[]): Promise<CriarExemplarDTO> {
    const codigo = await this.perguntar("Código do exemplar:");
    const livroId = await this.selecionaLivro(livros);
    const estado = await this.selecionarEstado();

    const dadosExemplar: CriarExemplarDTO = {
      codigo: codigo,
      livro_id: livroId,
      estado_conservacao: estado,
    };
    return dadosExemplar;
  }

  async solicitaDadosAtualizarExemplar(
    exemplar: Exemplar,
    livros: Livro[],
  ): Promise<Exemplar> {
    const codigo = await input({
      message: "Código:",
      default: exemplar.codigo,
    });

    const livroId = await select({
      message: "Selecione o livro:",
      choices: livros.map((livro) => ({
        name: `${livro.titulo} (ID: ${livro.id})`,
        value: livro.id,
      })),
      default: exemplar.livro_id,
    });

    const estado = await this.selecionarEstado(exemplar.estado_conservacao);

    const exemplarAtualizado: Exemplar = {
      id: exemplar.id,
      codigo: codigo,
      livro_id: livroId,
      estado_conservacao: estado,
    };
    return exemplarAtualizado;
  }
}
