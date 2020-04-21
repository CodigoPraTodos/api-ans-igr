import { BaseCommand, args } from '@adonisjs/ace'
import knex from 'knex'
import csvParse from 'csv-parse/lib/sync'
import { promises as fs } from 'fs'
import { ColumnOption } from 'csv-parse'
require('dotenv').config()

// todo: fix https://forum.adonisjs.com/t/adonis-5-command-database-ioc-error/6217
// import Database from '@ioc:Adonis/Lucid/Database'
const DB_CONFIG = {
  client: process.env.DB_CONNECTION,
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
}

const CARGA_MAX_REGISTROS = 999999999
const BATCH_SIZE = 200
const CSV_ENCODING = 'latin1'

interface Instituicao {
  ans_id: Number,
  nome: string,
  cobertura: string,
  porte: string,
}

interface ObjetoCsv {
  razaoComAns: string,
  cobertura: string,
  porte: string,
  classificacaoMes: Number,
  classificacaoMesAnterior: Number,
  mes12: Number,
  mes11: Number,
  mes10: Number,
  mes09: Number,
  mes08: Number,
  mes07: Number,
  mes06: Number,
  mes05: Number,
  mes04: Number,
  mes03: Number,
  mes02: Number,
  mes01: Number,
  competencia: string,
  dataAtualizacao: string, // todo: convert to date
}

export default class CargaAnual extends BaseCommand {
  public static commandName = 'carga:anual'
  public static description = 'Executa Carga dos Arquivos da ANS IGR Anual'

  @args.string({ required: true, description: 'Arquivo CSV da Carga' })
  public arquivo: string

  public async handle() {
    const dados = await this.carregaCsv()
    this.logger.info('Linhas', dados.length.toString())
    const instituicoes = dados.slice(0, CARGA_MAX_REGISTROS).map(converteInstituicao)

    // TODO: inject database
    const db = knex(DB_CONFIG);
    let i = 0;
    let batch: Instituicao[] = [];
    for (const instituicao of instituicoes) {
      batch.push(instituicao);
      i++;
      if (i % BATCH_SIZE === 0 || i === instituicoes.length) {
        await db.raw(db.table('instituicoes').insert(batch).toQuery()
          + ' ON CONFLICT DO NOTHING;');
        batch = [];
      }
    }

    this.logger.info('Registros inseridos:', i.toString());
  }

  private async carregaCsv(): Promise<ObjetoCsv[]> {
    let filehandle
    let arquivoCsv
    try {
      filehandle = await fs.open(this.arquivo, 'r')
      arquivoCsv = await filehandle.readFile({ encoding: CSV_ENCODING })
    } finally {
      if (filehandle !== undefined) {
        await filehandle.close()
      }
    }

    if (!arquivoCsv || arquivoCsv.length < 1) {
      throw new Error('arquivo csv tamanho invalido')
    }
    this.logger.info('Carregando Arquivo CSV Tamanho', arquivoCsv.length)

    const colunas: ColumnOption[] = [
      'razaoComAns',
      'cobertura',
      'porte',
      'classificacaoMes',
      'classificacaoMesAnterior',
      'mes12',
      'mes11',
      'mes10',
      'mes09',
      'mes08',
      'mes07',
      'mes06',
      'mes05',
      'mes04',
      'mes03',
      'mes02',
      'mes01',
      'competencia',
      'dataAtualizacao',
    ]

    const dados = csvParse(arquivoCsv, {
      delimiter: ';',
      escape: '"',
      columns: colunas,
      skip_empty_lines: true,
      from_line: 2,
    })

    return dados
  }
}

function converteInstituicao(objetoCsv: ObjetoCsv): Instituicao {
  const { razao, id } = splitRazaoAnsId(objetoCsv.razaoComAns)

  const instituicao: Instituicao = {
    ans_id: id,
    nome: razao,
    cobertura: objetoCsv.cobertura,
    porte: objetoCsv.porte,
  };

  return (instituicao)
}

function splitRazaoAnsId(valor: string) {
  const ansInicio = valor.lastIndexOf('(')
  const razao = valor.substring(0, ansInicio - 1)
  const id = parseInt(valor.substring(ansInicio + 1, valor.lastIndexOf(')')))
  return { razao, id }
}
