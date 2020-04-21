import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DbExtensions extends BaseSchema {

  public async up() {
    this.schema.raw(`CREATE EXTENSION IF NOT EXISTS unaccent;`)
  }

  public async down() {
    this.schema.raw(`DROP EXTENSION IF EXISTS unaccent;`)
  }
}
