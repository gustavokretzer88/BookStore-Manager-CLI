import { Exemplar, EstadoConservacao } from '../models/Exemplar';
import { ExemplarRepository } from '../repositories/ExemplarRepository';
import { LivroRepository } from '../repositories/LivroRepository';

export class ExemplarService {
    constructor(
        private readonly exemplarRepository: ExemplarRepository,
        private readonly livroRepository: LivroRepository
    ) {}

    async buscarTodos(): Promise<Exemplar[]> {
        return this.exemplarRepository.buscarTodos();
    }

    async buscarPorId(id: number): Promise<Exemplar | null> {
        if (id <= 0) {
            throw new Error(
                'O ID do exemplar deve ser maior que zero.'
            );
        }

        return this.exemplarRepository.buscarPorId(id);
    }

    async buscarPorCodigo(
        codigo: string
    ): Promise<Exemplar | null> {
        if (!codigo.trim()) {
            throw new Error(
                'O código do exemplar é obrigatório.'
            );
        }

        return this.exemplarRepository.buscarPorCodigo(
            codigo.trim()
        );
    }

    async buscarPorLivro(
        livroId: number
    ): Promise<Exemplar[]> {
        if (livroId <= 0) {
            throw new Error(
                'O ID do livro deve ser maior que zero.'
            );
        }

        const livro = await this.livroRepository.buscarPorId(
            livroId
        );

        if (!livro) {
            throw new Error(
                `Livro com ID ${livroId} não encontrado.`
            );
        }

        return this.exemplarRepository.buscarPorLivro(
            livroId
        );
    }

    async buscarPorEstado(
        estado: EstadoConservacao
    ): Promise<Exemplar[]> {
        this.validarEstado(estado);

        return this.exemplarRepository.buscarPorEstado(
            estado
        );
    }

    async buscarDisponiveis(): Promise<Exemplar[]> {
        return this.exemplarRepository.buscarDisponiveis();
    }

    async cadastrar(
        codigo: string,
        livroId: number,
        estadoConservacao: EstadoConservacao
    ): Promise<Exemplar> {

        if (!codigo.trim()) {
            throw new Error(
                'O código do exemplar é obrigatório.'
            );
        }

        if (livroId <= 0) {
            throw new Error(
                'O ID do livro deve ser maior que zero.'
            );
        }

        this.validarEstado(estadoConservacao);

        const livro = await this.livroRepository.buscarPorId(
            livroId
        );

        if (!livro) {
            throw new Error(
                `Livro com ID ${livroId} não encontrado.`
            );
        }

        const codigoNormalizado = codigo.trim();

        const exemplarExistente =
            await this.exemplarRepository.buscarPorCodigo(
                codigoNormalizado
            );

        if (exemplarExistente) {
            throw new Error(
                `Já existe um exemplar cadastrado com o código ${codigoNormalizado}.`
            );
        }

        return this.exemplarRepository.criar(
            codigoNormalizado,
            livroId,
            estadoConservacao
        );
    }

    async atualizar(
        id: number,
        codigo: string,
        livroId: number,
        estadoConservacao: EstadoConservacao
    ): Promise<Exemplar | null> {

        if (id <= 0) {
            throw new Error(
                'O ID do exemplar deve ser maior que zero.'
            );
        }

        if (!codigo.trim()) {
            throw new Error(
                'O código do exemplar é obrigatório.'
            );
        }

        if (livroId <= 0) {
            throw new Error(
                'O ID do livro deve ser maior que zero.'
            );
        }

        this.validarEstado(estadoConservacao);

        const livro = await this.livroRepository.buscarPorId(
            livroId
        );

        if (!livro) {
            throw new Error(
                `Livro com ID ${livroId} não encontrado.`
            );
        }

        const codigoNormalizado = codigo.trim();

        const exemplarComMesmoCodigo =
            await this.exemplarRepository.buscarPorCodigo(
                codigoNormalizado
            );

        if (
            exemplarComMesmoCodigo &&
            exemplarComMesmoCodigo.id !== id
        ) {
            throw new Error(
                `Já existe outro exemplar cadastrado com o código ${codigoNormalizado}.`
            );
        }

        return this.exemplarRepository.atualizar(
            id,
            codigoNormalizado,
            livroId,
            estadoConservacao
        );
    }

    async excluir(id: number): Promise<boolean> {
        if (id <= 0) {
            throw new Error(
                'O ID do exemplar deve ser maior que zero.'
            );
        }

        return this.exemplarRepository.excluir(id);
    }

    private validarEstado(
        estado: EstadoConservacao
    ): void {
        const estadosValidos: EstadoConservacao[] = [
            'NOVO',
            'BOM',
            'REGULAR',
            'RUIM'
        ];

        if (!estadosValidos.includes(estado)) {
            throw new Error(
                `Estado de conservação inválido: ${estado}.`
            );
        }
    }
}