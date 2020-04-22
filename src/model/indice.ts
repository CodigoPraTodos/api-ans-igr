import db from "../knex";

import { Instituicao } from "./instituicao";

export interface Indice {
    ans_id: number;
    ano: number;
    mes: number;
    classificacao: number;
    indice: number;
}

export const selecionaIndices = async (
    instituicoes: Instituicao[],
    limite: number,
    ano?: number,
    mes?: number,
): Promise<Indice[]> => {
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

    const rawQuery = await db.raw(sqlQuery);

    return rawQuery.rows;
};
