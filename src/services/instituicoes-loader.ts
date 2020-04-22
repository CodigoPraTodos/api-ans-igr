import db from "../knex";
import { Instituicao, Indice } from "../model";

const BATCH_SIZE = 200;

export interface InstituicaoIndices {
    instituicao: Instituicao;
    indices: Indice[];
}

export const carregaInstituicoes = async (instituicoes: InstituicaoIndices[]): Promise<number> => {
    let i = 0;
    let batchInstituicoes: Instituicao[] = [];
    let batchIndices: Indice[] = [];
    let inserts = 0;
    for (const instituicaoComIndices of instituicoes) {
        batchInstituicoes.push(instituicaoComIndices.instituicao);
        batchIndices = batchIndices.concat(instituicaoComIndices.indices);
        i++;
        if (i % BATCH_SIZE === 0 || i === instituicoes.length) {
            const resInstituicoes = await db.raw(
                db.table("instituicoes").insert(batchInstituicoes).toQuery() + " ON CONFLICT DO NOTHING RETURNING *;",
            );
            const resIndices = await db.raw(
                db.table("indices").insert(batchIndices).toQuery() + " ON CONFLICT DO NOTHING RETURNING *;",
            );
            const batchInserts = resInstituicoes.rowCount + resIndices.rowCount;
            inserts += batchInserts;
            console.info(`batch ${i} inserted rows ${batchInserts}`);
            batchInstituicoes = [];
            batchIndices = [];
        }
    }

    return inserts;
};
