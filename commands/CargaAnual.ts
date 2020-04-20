import { BaseCommand } from '@adonisjs/ace'
import knex from 'knex'

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

  public async handle() {
    // TODO: inject database
    const db = knex(DB_CONFIG);

    const instituicao = await db
      .from('instituicoes')
      .select('*')
      .first()

    this.logger.info('instituicao', instituicao)
  }
}
