// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Utils from 'App/Utils/Utils'

interface Classificacao {
    ans_id: Number,
    nome: string,
    cobertura: string,
    porte: string,
    ano: Number,
    mes: Number,
    classificacao: Number,
    indice: Number,
}

export default class ClassificacoesController {
    async getClassificacoes({ }) {

        // todo: dados teste, substituir pela leitura do DB
        const classificacoes: Classificacao[] = [
            { ans_id: 335657, nome: 'Teste 335657', cobertura: 'Total', porte: 'Médio', ano: 2020, mes: 1, classificacao: 200, indice: 19.25 },
            { ans_id: 335657, nome: 'Teste 335657', cobertura: 'Total', porte: 'Médio', ano: 2020, mes: 2, classificacao: 205, indice: 17.00 },
            { ans_id: 335657, nome: 'Teste 335657', cobertura: 'Total', porte: 'Médio', ano: 2020, mes: 3, classificacao: 240, indice: 5.99 },
            { ans_id: 2, nome: 'Teste 2', cobertura: 'Parcial', porte: 'Pequeno', ano: 2020, mes: 1, classificacao: 200, indice: 11.46 },
            { ans_id: 2, nome: 'Teste 2', cobertura: 'Parcial', porte: 'Pequeno', ano: 2019, mes: 12, classificacao: 205, indice: 10.01 },
            { ans_id: 2, nome: 'Teste 2', cobertura: 'Parcial', porte: 'Pequeno', ano: 2019, mes: 11, classificacao: 240, indice: 8.70 },
        ]

        return Utils.buildResponseInstituicaoClassificacao(classificacoes);

    }

    async getClassificacoesAno({ params }) {

        return { info: 'Classificações por ano', ano: params.ano }

    }

    async getClassificacoesMes({ params }) {

        return { info: 'Classificações por mês', ano: params.ano, mes: params.mes }

    }
}
