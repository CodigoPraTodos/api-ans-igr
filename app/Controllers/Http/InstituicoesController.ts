// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from "@ioc:Adonis/Lucid/Database";
import { addWildcard } from "App/Utils/Utils";

interface InstituicaoDb {
  ans_id: Number;
  nome: string;
  cobertura: string;
  porte: string;
}

interface IndicesDb {
  ans_id: Number;
  ano: Number;
  mes: Number;
  classificacao: Number;
  indice: Number;
}

interface ResponseLinks {
  self: string;
  first: string;
  prev: string;
  next: string;
  last: string;
}

interface Indices {
  ano: Number;
  mes: Number;
  classificacao: Number;
  indice: Number;
  links: ResponseLinks;
}

interface Instituicao {
  type: string;
  id: Number;
  attributes: {
    nome: string;
    cobertura: string;
    porte: string;
    indices: Indices[];
  };
  links: ResponseLinks;
}

interface Response {
  data: Instituicao[];
}

const LIMITE_DEFAULT_INDICES = 12;
const LIMITE_DEFAULT_INSTITUICOES = 10;
const ENDPOINT = "http://localhost:3333/v1/instituicoes/";

export default class InstituicoesController {
  async getInstituicaoRoot() {
    const instituicoes: InstituicaoDb[] = await Database.from("instituicoes")
      .select("ans_id", "nome", "cobertura", "porte")
      .orderBy("ans_id", "asc")
      .limit(LIMITE_DEFAULT_INSTITUICOES);

    const indices = await this.selecionaIndices(
      instituicoes,
      LIMITE_DEFAULT_INDICES
    );

    return this.buildResponseInstituicao(instituicoes, indices);
  }

  async getInstituicao({ params }) {
    const instituicoes: InstituicaoDb[] = await Database.from("instituicoes")
      .select("ans_id", "nome", "cobertura", "porte")
      .where("ans_id", params.ansId)
      .orderBy("ans_id", "asc");

    const indices = await this.selecionaIndices(
      instituicoes,
      LIMITE_DEFAULT_INDICES
    );

    return this.buildResponseInstituicao(instituicoes, indices);
  }

  async getInstituicaoLista({ params }) {
    const ans_ids = params.ansIds.split(",").map(Number);

    const instituicoes: InstituicaoDb[] = await Database.from("instituicoes")
      .select("ans_id", "nome", "cobertura", "porte")
      .whereIn("ans_id", ans_ids)
      .orderBy("ans_id", "asc");

    const indices = await this.selecionaIndices(
      instituicoes,
      LIMITE_DEFAULT_INDICES
    );

    return this.buildResponseInstituicao(instituicoes, indices);
  }

  async searchInstituicoesPorNome({ params }) {
    return this.searchInstituicoes("nome", params.query);
  }

  async searchInstituicoesPorPorte({ params }) {
    return this.searchInstituicoes("porte", params.query);
  }

  async searchInstituicoesPorCobertura({ params }) {
    return this.searchInstituicoes("cobertura", params.query);
  }

  async getInstituicaoAno({ params }) {
    const instituicoes: InstituicaoDb[] = await Database.from("instituicoes")
      .select("ans_id", "nome", "cobertura", "porte")
      .where("ans_id", params.ansId)
      .orderBy("ans_id", "asc");

    const indices = await this.selecionaIndices(
      instituicoes,
      LIMITE_DEFAULT_INDICES,
      params.ano
    );

    return this.buildResponseInstituicao(instituicoes, indices);
  }

  async getInstituicaoMes({ params }) {
    const instituicoes: InstituicaoDb[] = await Database.from("instituicoes")
      .select("ans_id", "nome", "cobertura", "porte")
      .where("ans_id", params.ansId)
      .orderBy("ans_id", "asc");

    const indices = await this.selecionaIndices(
      instituicoes,
      LIMITE_DEFAULT_INDICES,
      params.ano,
      params.mes
    );

    return this.buildResponseInstituicao(instituicoes, indices);
  }

  async searchInstituicoes(campo: string, query: string) {
    let queryLike = addWildcard(query, "%");

    const instituicoes: InstituicaoDb[] = await Database.from("instituicoes")
      .select("ans_id", "nome", "cobertura", "porte")
      .whereRaw(`UPPER(UNACCENT(${campo})) like UPPER(UNACCENT(?))`, [
        queryLike,
      ])
      .orderBy("ans_id", "asc")
      .limit(LIMITE_DEFAULT_INSTITUICOES);

    const indices = await this.selecionaIndices(
      instituicoes,
      LIMITE_DEFAULT_INDICES
    );

    return this.buildResponseInstituicao(instituicoes, indices);
  }

  async selecionaIndices(
    instituicoes: InstituicaoDb[],
    limite: number,
    ano?: number,
    mes?: number
  ): Promise<IndicesDb[]> {
    const ans_ids = instituicoes.map((i) => {
      return i.ans_id;
    });

    let sqlQuery: string = `
    select indices.ans_id, indices.ano, indices.mes, indices.classificacao, indices.indice
      from instituicoes, lateral (
          select ans_id, ano, mes, classificacao, indice from indices
              where indices.ans_id = instituicoes.ans_id
              order by ano desc, mes desc
              limit ${limite}
      ) indices
      where instituicoes.ans_id in (${ans_ids})
    `;

    if (ano) {
      sqlQuery += ` and indices.ano = ${ano}`;
    }
    if (mes) {
      sqlQuery += ` and indices.mes = ${mes}`;
    }

    const rawQuery = await Database.rawQuery(sqlQuery);

    return rawQuery.rows;
  }

  buildResponseInstituicao(
    instituicoes: InstituicaoDb[],
    indices: IndicesDb[]
  ) {
    const mapLinksInstituicao = (instituicao) => ({
      // todo: tratar host e versão dinamicamente
      self: ENDPOINT + instituicao.ans_id,
      first: "",
      prev: "",
      next: "",
      last: "",
    });

    const mapLinksIndice = (indice) => ({
      // todo: tratar host e versão dinamicamente
      self: ENDPOINT + indice.ans_id + "/" + indice.ano + "/" + indice.mes,
      first: "",
      prev: "",
      next: "",
      last: "",
    });

    const mapIndice = (indice) => ({
      ano: indice.ano,
      mes: indice.mes,
      classificacao: indice.classificacao,
      indice: indice.indice,
      links: mapLinksIndice(indice),
    });

    const mapInstituicao = (instituicao) => ({
      type: "instituicao",
      id: instituicao.ans_id,
      attributes: {
        nome: instituicao.nome,
        cobertura: instituicao.cobertura,
        porte: instituicao.porte,
        indices: indices
          .filter((indice) => indice.ans_id === instituicao.ans_id)
          .map(mapIndice),
      },
      links: mapLinksInstituicao(instituicao),
    });

    const response: Response = { data: instituicoes.map(mapInstituicao) };

    return response;
  }
}
