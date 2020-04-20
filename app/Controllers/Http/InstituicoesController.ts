// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class InstituicoesController {
    async getInstituicao({ params }) {

        const instituicao = await Database
            .from('instituicoes')
            .select('*')
            .where('ans_id', params.ansId)
            .first()

        return instituicao;
    }

    async teste() { // todo: remover esse teste com select *
        const instituicoes = await Database
            .from('instituicoes')
            .select('*')
        return instituicoes;
    }
}
