import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Instituicoes extends BaseSchema {
  protected tableName = 'instituicoes'

  public async up() {
    // this.schema.createTable(this.tableName, (table) => {
    //   table.increments('id')
    //   table.timestamps(true)
    // })
    this.schema.raw(`
      CREATE TABLE ${this.tableName}(
        ans_id integer PRIMARY KEY NOT NULL,
        nome VARCHAR (255) NOT NULL,
        cobertura VARCHAR (255) NOT NULL,
        porte VARCHAR (64) NOT NULL,
        created_on TIMESTAMP NOT NULL
      );`)
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
