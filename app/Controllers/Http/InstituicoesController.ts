// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Utils from 'App/Utils/Utils'

interface Instituicao {
    ans_id: Number,
    nome: string,
    cobertura: string,
    porte: string,
}

export default class InstituicoesController {
    async getInstituicao({ params }) {

        const instituicao: Instituicao = await Database
            .from('instituicoes')
            .select('ans_id', 'nome', 'cobertura', 'porte')
            .where('ans_id', params.ansId)
            .first()

        const intituicoes: Instituicao[] = []
        intituicoes.push(instituicao)

        return Utils.buildResponseInstituicao(intituicoes)
    }

    async getInstituicaoLista({ params }) {
        const instituicoes: Instituicao[] = await Database
            .from('instituicoes')
            .select('ans_id', 'nome', 'cobertura', 'porte')
            .whereIn('ans_id', params.ansIds.split(','))

        return Utils.buildResponseInstituicao(instituicoes);
    }

    async teste() { // todo: remover esse teste com select *
        const instituicoes = await Database
            .from('instituicoes')
            .select('*')
        return instituicoes;
    }

    async searchInstituicoesPorNome({ params }) {

        let queryLike = Utils.addWildcard(params.query, '%')

        const instituicoes: Instituicao[] = await Database
            .from('instituicoes')
            .select('ans_id', 'nome', 'cobertura', 'porte')
            .whereRaw('UPPER(UNACCENT(nome)) like UPPER(UNACCENT(?))', [queryLike])

        return Utils.buildResponseInstituicao(instituicoes);

    }

    async searchInstituicoesPorCobertura({ params }) {

        let queryLike = Utils.addWildcard(params.query, '%')

        const instituicoes: Instituicao[] = await Database
            .from('instituicoes')
            .select('ans_id', 'nome', 'cobertura', 'porte')
            .whereRaw('UPPER(UNACCENT(cobertura)) like UPPER(UNACCENT(?))', [queryLike])

        return Utils.buildResponseInstituicao(instituicoes);

    }

    async searchInstituicoesPorPorte({ params }) {

        let queryLike = Utils.addWildcard(params.query, '%')

        const instituicoes: Instituicao[] = await Database
            .from('instituicoes')
            .select('ans_id', 'nome', 'cobertura', 'porte')
            .whereRaw('UPPER(UNACCENT(porte)) like UPPER(UNACCENT(?))', [queryLike])

        return Utils.buildResponseInstituicao(instituicoes);

    }
}