import db from "../knex";

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
