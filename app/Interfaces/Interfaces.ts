export interface AtributosInstituicao {
    nome: string,
    cobertura: string,
    porte: string,
}

export interface DadosInstituicao {
    type: string,
    id: Number,
    attributes: AtributosInstituicao,
    classificacao: DadosClassificacao[],
    links: ResponseLinks
}

export interface DadosClassificacao {
    ano: Number,
    mes: Number,
    classificacao: Number
    indice: Number
    links: ResponseLinks
}

export interface ResponseLinks {
    self: string,
}

export interface ResponseInstituicao {
    data: DadosInstituicao[],
}

