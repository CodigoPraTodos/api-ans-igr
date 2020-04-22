import { Request, Response } from "express";

import { Instituicao, Indice, selecionaIndices, selecionaInstituicoes, searchInstituicoes } from "../model";
import { ApiResponse, ResponseLinks, createLink, ApiEntity } from "./api";

interface IndiceApi {
    ano: number;
    mes: number;
    classificacao: number;
    indice: number;
    links: ResponseLinks;
}

interface InstituicaoApi {
    nome: string;
    cobertura: string;
    porte: string;
    indices: IndiceApi[];
}

const LIMITE_DEFAULT_INDICES = 12;
const LIMITE_DEFAULT_INSTITUICOES = 10;
const ENDPOINT = "http://localhost:3333/v1/instituicoes/";

const buildResponseInstituicao = (instituicoes: Instituicao[], indices: Indice[]): ApiResponse<InstituicaoApi> => {
    const mapIndice = (indice: Indice): IndiceApi => ({
        ano: indice.ano,
        mes: indice.mes,
        classificacao: indice.classificacao,
        indice: indice.indice,
        links: createLink(ENDPOINT + indice.ans_id + "/" + indice.ano + "/" + indice.mes),
    });

    const mapInstituicao = (instituicao: Instituicao): ApiEntity<InstituicaoApi> => ({
        type: "instituicao",
        id: instituicao.ans_id,
        attributes: {
            nome: instituicao.nome,
            cobertura: instituicao.cobertura,
            porte: instituicao.porte,
            indices: indices.filter((indice) => indice.ans_id === instituicao.ans_id).map(mapIndice),
        },
        links: createLink(ENDPOINT + instituicao.ans_id),
    });

    const response: ApiResponse<InstituicaoApi> = { data: instituicoes.map(mapInstituicao) };
    return response;
};

export const getInstituicaoRoot = async (_req: Request, res: Response): Promise<void> => {
    const instituicoes = await selecionaInstituicoes(LIMITE_DEFAULT_INSTITUICOES);
    const indices = await selecionaIndices(instituicoes, LIMITE_DEFAULT_INDICES);
    res.send(buildResponseInstituicao(instituicoes, indices));
};

export const getInstituicao = async (req: Request<{ ansId: string }>, res: Response): Promise<void> => {
    const { ansId } = req.params;
    const instituicoes = await selecionaInstituicoes(LIMITE_DEFAULT_INSTITUICOES, [parseInt(ansId)]);
    const indices = await selecionaIndices(instituicoes, LIMITE_DEFAULT_INDICES);
    res.send(buildResponseInstituicao(instituicoes, indices));
};

export const getInstituicaoLista = async (req: Request<{ ansIds: string }>, res: Response): Promise<void> => {
    const ansIds = req.params.ansIds.split(",").map((i) => parseInt(i));
    const instituicoes = await selecionaInstituicoes(LIMITE_DEFAULT_INSTITUICOES, ansIds);
    const indices = await selecionaIndices(instituicoes, LIMITE_DEFAULT_INDICES);
    res.send(buildResponseInstituicao(instituicoes, indices));
};

export const searchInstituicoesPorNome = async (req: Request, res: Response): Promise<void> => {
    const instituicoes = await searchInstituicoes(LIMITE_DEFAULT_INSTITUICOES, "nome", req.params.query);
    const indices = await selecionaIndices(instituicoes, LIMITE_DEFAULT_INDICES);
    res.send(buildResponseInstituicao(instituicoes, indices));
};

export const searchInstituicoesPorPorte = async (req: Request, res: Response): Promise<void> => {
    const instituicoes = await searchInstituicoes(LIMITE_DEFAULT_INSTITUICOES, "porte", req.params.query);
    const indices = await selecionaIndices(instituicoes, LIMITE_DEFAULT_INDICES);
    res.send(buildResponseInstituicao(instituicoes, indices));
};

export const searchInstituicoesPorCobertura = async (req: Request, res: Response): Promise<void> => {
    const instituicoes = await searchInstituicoes(LIMITE_DEFAULT_INSTITUICOES, "cobertura", req.params.query);
    const indices = await selecionaIndices(instituicoes, LIMITE_DEFAULT_INDICES);
    res.send(buildResponseInstituicao(instituicoes, indices));
};

// async searchInstituicoesPorPorte({ params }) {
//     return this.searchInstituicoes("porte", params.query);
// }

// async searchInstituicoesPorCobertura({ params }) {
//     return this.searchInstituicoes("cobertura", params.query);
// }

// async getInstituicaoAno({ params }) {
//     const instituicoes: InstituicaoDb[] = await Database.from("instituicoes")
//         .select("ans_id", "nome", "cobertura", "porte")
//         .where("ans_id", params.ansId)
//         .orderBy("ans_id", "asc");

//     const indices = await this.selecionaIndices(instituicoes, LIMITE_DEFAULT_INDICES, params.ano);

//     return this.buildResponseInstituicao(instituicoes, indices);
// }

// async getInstituicaoMes({ params }) {
//     const instituicoes: InstituicaoDb[] = await Database.from("instituicoes")
//         .select("ans_id", "nome", "cobertura", "porte")
//         .where("ans_id", params.ansId)
//         .orderBy("ans_id", "asc");

//     const indices = await this.selecionaIndices(instituicoes, LIMITE_DEFAULT_INDICES, params.ano, params.mes);

//     return this.buildResponseInstituicao(instituicoes, indices);
// }
