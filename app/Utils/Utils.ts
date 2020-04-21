import { ResponseInstituicao } from 'App/Interfaces/Interfaces'

export default class Utils {

    static addWildcard(string: string, wildcard: string) {
        return wildcard + decodeURI(string) + wildcard
    }

    static buildResponseInstituicao(instituicoes) {

        const responseData: ResponseInstituicao['data'] = []

        for (let i = 0; i < instituicoes.length; i++) {
            responseData.push(
                {
                    type: 'instituicao',
                    id: instituicoes[i].ans_id,
                    attributes: {
                        nome: instituicoes[i].nome,
                        cobertura: instituicoes[i].cobertura,
                        porte: instituicoes[i].porte,
                    },
                    classificacao: [],
                    links: {
                        // todo: tratar host e versão dinamicamente
                        self: 'http://localhost:3333/v1/instituicoes/' + instituicoes[i].ans_id,
                    },
                }
            )
        }

        const response: ResponseInstituicao = {
            data: responseData
        };

        return response

    }

    static buildResponseInstituicaoClassificacao(classificacoes) {

        const responseData: ResponseInstituicao['data'] = []
        let lastAnsId = 0

        for (let i = 0; i < classificacoes.length; i++) {
            if (lastAnsId == 0 || classificacoes[i].ans_id != lastAnsId) {
                responseData.push(
                    {
                        type: 'instituicao',
                        id: classificacoes[i].ans_id,
                        attributes: {
                            nome: classificacoes[i].nome,
                            cobertura: classificacoes[i].cobertura,
                            porte: classificacoes[i].porte,
                        },
                        classificacao: [],
                        links: {
                            // todo: tratar host e versão dinamicamente
                            self: 'http://localhost:3333/v1/instituicoes/' + classificacoes[i].ans_id,
                        },
                    }
                )
            }

            responseData[responseData.length - 1].classificacao.push({
                ano: classificacoes[i].ano,
                mes: classificacoes[i].mes,
                classificacao: classificacoes[i].classificacao,
                indice: classificacoes[i].indice,
                links: {
                    // todo: tratar host e versão dinamicamente
                    self: 'http://localhost:3333/v1/instituicoes/' +
                        classificacoes[i].ans_id + '/classificacoes/' +
                        classificacoes[i].ano + '/' +
                        classificacoes[i].mes,
                }
            })

            lastAnsId = classificacoes[i].ans_id

        }

        const response: ResponseInstituicao = {
            data: responseData
        };

        return response

    }

}