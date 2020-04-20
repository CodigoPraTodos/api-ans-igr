import { BaseCommand, args } from '@adonisjs/ace'
import knex from 'knex'
import { promises as fs } from 'fs'

// todo: fix https://forum.adonisjs.com/t/adonis-5-command-database-ioc-error/6217
// import Database from '@ioc:Adonis/Lucid/Database'
const DB_CONFIG = {
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    port: 5432,
    user: 'cpt',
    password: 'cpt456',
    database: 'api_ans_igr_db',
  }
}

export default class CargaAnual extends BaseCommand {
  public static commandName = 'carga:anual'
  public static description = 'Executa Carga dos Arquivos da ANS IGR Anual'

  @args.string({ required: true, description: 'Arquivo CSV da Carga' })
  public arquivo: string

  public async handle() {
    let filehandle
    let csv
    try {
      filehandle = await fs.open(this.arquivo, 'r')
      csv = await filehandle.readFile({ encoding: 'utf-8' })
    } finally {
      if (filehandle !== undefined)
        await filehandle.close();
    }

    if (!csv || csv.length < 1) {
      throw new Error('arquivo csv tamanho invalido')
    }
    this.logger.info('Carregando Arquivo CSV Tamanho', csv.length)

    const rows = csv.split('\n');
    this.logger.info('Linhas', rows.length)

    this.logger.info('cabecalho >> ', rows[0])

    const instituicoes = rows.slice(1, 11).map((row) => {
      const [nomeComAns, cobertura, porte] = row.split(';')
      const ansInicio = nomeComAns.lastIndexOf('(')
      const nome = nomeComAns.substring(1, ansInicio - 1)
      const ans_id = nomeComAns.substring(ansInicio + 1, nomeComAns.lastIndexOf(')'))
      const instituicao = {
        nome,
        ans_id,
        cobertura: cobertura.replace(/\"/g, ""),
        porte: porte.replace(/\"/g, ""),
      }
      this.logger.info('inserindo > ', JSON.stringify(instituicao))
      return instituicao
    })

    // TODO: inject database
    const db = knex(DB_CONFIG)
    const resultado = await db
      .table('instituicoes')
      .insert(instituicoes)

    this.logger.info('dados inseridos >> ', JSON.stringify(resultado))
  }
}
