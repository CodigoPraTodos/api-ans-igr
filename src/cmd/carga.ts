import csvParse from "csv-parse/lib/sync";
import { promises as fs } from "fs";
import { ColumnOption } from "csv-parse";

import { Instituicao, Indice } from "../model";
import { InstituicaoIndices, carregaInstituicoes } from "../services/instituicoes-loader";

const cmdArgs = process.argv.slice(2);
if (cmdArgs.length < 1) {
    throw new Error("Argumentos inválidos: <arquivo>");
}

const ARQUIVO = cmdArgs[0];
const CARGA_ANUAL = cmdArgs.length > 1 ? cmdArgs[1] : false;
const CSV_ENCODING = "latin1";

interface ObjetoCsv {
    razaoComAns: string;
    cobertura: string;
    porte: string;
    classificacaoMes: string;
    classificacaoMesAnterior: string;
    mes12: string;
    mes11: string;
    mes10: string;
    mes9: string;
    mes8: string;
    mes7: string;
    mes6: string;
    mes5: string;
    mes4: string;
    mes3: string;
    mes2: string;
    mes1: string;
    competencia: string;
    dataAtualizacao: string; // todo: convert to date
}

const COLUNAS_CSV: ColumnOption[] = [
    "razaoComAns",
    "cobertura",
    "porte",
    "classificacaoMes",
    "classificacaoMesAnterior",
    "mes12",
    "mes11",
    "mes10",
    "mes9",
    "mes8",
    "mes7",
    "mes6",
    "mes5",
    "mes4",
    "mes3",
    "mes2",
    "mes1",
    "competencia",
    "dataAtualizacao",
];

const carregaCsv = async (): Promise<ObjetoCsv[]> => {
    let filehandle;
    let arquivoCsv;
    try {
        filehandle = await fs.open(ARQUIVO, "r");
        arquivoCsv = await filehandle.readFile({ encoding: CSV_ENCODING });
    } finally {
        if (filehandle !== undefined) {
            await filehandle.close();
        }
    }

    if (!arquivoCsv || arquivoCsv.length < 1) {
        throw new Error("arquivo csv tamanho invalido");
    }
    console.info("Carregando Arquivo CSV Tamanho", arquivoCsv.length);

    const dados = csvParse(arquivoCsv, {
        delimiter: ";",
        escape: '"',
        columns: COLUNAS_CSV,
        skip_empty_lines: true,
        from_line: 2,
    });

    return dados;
};

const splitRazaoAnsId = (valor: string): { razao: string; id: number } => {
    const ansInicio = valor.lastIndexOf("(");
    const razao = valor.substring(0, ansInicio - 1);
    const id = parseInt(valor.substring(ansInicio + 1, valor.lastIndexOf(")")));
    return { razao, id };
};

const decimalToFloat = (valor: string): number => {
    let float = parseFloat(valor.replace(",", "."));
    if (isNaN(float)) {
        float = 0;
    }
    return float;
};

const converteInstituicao = (objetoCsv: ObjetoCsv): InstituicaoIndices => {
    const { razao, id } = splitRazaoAnsId(objetoCsv.razaoComAns);

    const instituicao: Instituicao = {
        ans_id: id,
        nome: razao,
        cobertura: objetoCsv.cobertura,
        porte: objetoCsv.porte,
    };

    const indices: Indice[] = [];

    let ano = parseInt(objetoCsv.competencia.substring(0, 4));
    let mes = parseInt(objetoCsv.competencia.substring(4));
    if (CARGA_ANUAL) {
        mes = 12;
    }

    for (let i = 12; i > 0; i--) {
        const classificacaoTxt =
            i === 12 ? objetoCsv.classificacaoMes : i === 11 ? objetoCsv.classificacaoMesAnterior : "0";
        const indiceTxt = (objetoCsv as any)[`mes${i}`];

        const classificacao = decimalToFloat(classificacaoTxt);
        const indice = decimalToFloat(indiceTxt);

        indices.push({
            ans_id: id,
            ano,
            mes,
            classificacao,
            indice,
        });

        mes--;
        if (mes === 0) {
            mes = 12;
            ano--;
        }
    }

    return { instituicao, indices };
};

const cmd = async (): Promise<void> => {
    const dados = await carregaCsv();
    console.info("Linhas do CSV:", dados.length.toString());

    const instituicoes = dados.map(converteInstituicao);
    const inserts = await carregaInstituicoes(instituicoes);
    console.info(`Registros inseridos: ${inserts}`);

    process.exit(0);
};
cmd();
