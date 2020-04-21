import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Indices extends BaseSchema {
  protected tableName = 'indices'

  public async up () {
    this.schema.raw(`
      CREATE TABLE ${this.tableName}(
        ans_id        INTEGER NOT NULL,
        ano           INTEGER NOT NULL,
        mes           INTEGER NOT NULL,
        classificacao NUMERIC (6, 2) NOT NULL,
        indice        NUMERIC (6, 2) NOT NULL,
        created_on    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (ans_id, ano, mes)
      );
    `)
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
