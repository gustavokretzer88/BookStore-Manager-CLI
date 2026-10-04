import { Autor } from "../models/Autor";
import Table from "cli-table3";
import { confirm, input, select } from "@inquirer/prompts";
import { Livro } from "../models/Livro";
import { LivroComAutorDTO } from "../dtos/livro/LivroComAutorDTO";

export class LivroView {
  mostrarLivros(livros: Livro[] | LivroComAutorDTO[], mensagem?: string): void {
    if (mensagem !== undefined && mensagem.length !== 0) {
      console.log(mensagem);
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
}
