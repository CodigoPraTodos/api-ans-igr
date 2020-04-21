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

interface Indice {
  ans_id: number,
  ano: number,
  mes: number,
  classificacao: number,
  indice: number,
}

interface InstituicaoIndices {
  instituicao: Instituicao,
  indices: Indice[],
}

interface ObjetoCsv {
  razaoComAns: string,
  cobertura: string,
  porte: string,
  classificacaoMes: string,
  classificacaoMesAnterior: string,
  mes12: string,
  mes11: string,
  mes10: string,
  mes9: string,
  mes8: string,
  mes7: string,
  mes6: string,
  mes5: string,
  mes4: string,
  mes3: string,
  mes2: string,
  mes1: string,
  competencia: string,
  dataAtualizacao: string, // todo: convert to date
}

let cargaAnual: string

export default class CargaAnual extends BaseCommand {
  public static commandName = 'carga:anual'
  public static description = 'Executa Carga dos Arquivos da ANS IGR Anual'

  @args.string({ required: true, description: 'Arquivo CSV da Carga' })
  public arquivo: string

  @args.string({ required: false, description: 'Carga Anual passada' })
  public anual: string

  public async handle () {
    console.info('this anual', this.anual)
    cargaAnual = this.anual

    const dados = await this.carregaCsv()
    this.logger.info('Linhas', dados.length.toString())

    const instituicoes = dados.slice(0, CARGA_MAX_REGISTROS).map(converteInstituicao)

    // TODO: inject database
    const db = knex(DB_CONFIG)
    let i = 0
    let batchInstituicoes: Instituicao[] = []
    let batchIndices: Indice[] = []
    let inserts = 0
    for (const instituicaoComIndices of instituicoes) {
      batchInstituicoes.push(instituicaoComIndices.instituicao)
      batchIndices = batchIndices.concat(instituicaoComIndices.indices)
      i++
      if (i % BATCH_SIZE === 0 || i === instituicoes.length) {
        const resInstituicoes = await db.raw(db.table('instituicoes').insert(batchInstituicoes).toQuery()
          + ' ON CONFLICT DO NOTHING RETURNING *;')
        const resIndices = await db.raw(db.table('indices').insert(batchIndices).toQuery()
          + ' ON CONFLICT DO NOTHING RETURNING *;')
        const batchInserts = resInstituicoes.rowCount + resIndices.rowCount
        inserts += batchInserts
        this.logger.info(`batch ${i} inserted rows ${batchInserts}`)
        batchInstituicoes = []
        batchIndices = []
      }
    }

    this.logger.info(`Registros inseridos: ${inserts}`)
  }

  private async carregaCsv (): Promise<ObjetoCsv[]> {
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
      'mes9',
      'mes8',
      'mes7',
      'mes6',
      'mes5',
      'mes4',
      'mes3',
      'mes2',
      'mes1',
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

function converteInstituicao (objetoCsv: ObjetoCsv): InstituicaoIndices {
  const { razao, id } = splitRazaoAnsId(objetoCsv.razaoComAns)

  const instituicao: Instituicao = {
    ans_id: id,
    nome: razao,
    cobertura: objetoCsv.cobertura,
    porte: objetoCsv.porte,
  }

  const indices: Indice[] = []

  let ano = parseInt(objetoCsv.competencia.substring(0, 4))
  let mes = parseInt(objetoCsv.competencia.substring(4))
  if (cargaAnual) {
    mes = 12
  }

  for (let i = 12; i > 0; i--) {
    let classificacaoTxt = i === 12 ? objetoCsv.classificacaoMes
      : i === 11 ? objetoCsv.classificacaoMesAnterior : '0'
    let classificacao = parseFloat(classificacaoTxt.replace(',', '.'))
    if (isNaN(classificacao)) {
      classificacao = 0
    }

    let indiceTxt = objetoCsv[`mes${i}`]
    let indice = parseFloat(indiceTxt.replace(',', '.'))
    if (isNaN(indice)) {
      indice = 0
    }

    indices.push({
      ans_id: id,
      ano,
      mes,
      classificacao,
      indice,
    })

    mes--
    if (mes === 0) {
      mes = 12
      ano--
    }
  }

  return ({ instituicao, indices })
}

function splitRazaoAnsId (valor: string) {
  const ansInicio = valor.lastIndexOf('(')
  const razao = valor.substring(0, ansInicio - 1)
  const id = parseInt(valor.substring(ansInicio + 1, valor.lastIndexOf(')')))
  return { razao, id }
}
