import db from "../knex";
import { addWildcard } from "../utils/uri";

export interface Instituicao {
    ans_id: number;
    nome: string;
    cobertura: string;
    porte: string;
}

export const selecionaInstituicoes = async (limite: number, ansId?: number[]): Promise<Instituicao[]> => {
    const query = db.from("instituicoes").select("ans_id", "nome", "cobertura", "porte");

    if (ansId) {
        query.whereIn("ans_id", ansId);
    }

    const instituicoes: Instituicao[] = await query.orderBy("ans_id", "asc").limit(limite);
    return instituicoes;
};

export const searchInstituicoes = async (limite: number, campo: string, query: string): Promise<Instituicao[]> => {
    const queryLike = addWildcard(query, "%");

    const instituicoes: Instituicao[] = await db
        .from("instituicoes")
        .select("ans_id", "nome", "cobertura", "porte")
        .whereRaw(`UPPER(UNACCENT(${campo})) like UPPER(UNACCENT(?))`, [queryLike])
        .orderBy("ans_id", "asc")
        .limit(limite);

    return instituicoes;
};
