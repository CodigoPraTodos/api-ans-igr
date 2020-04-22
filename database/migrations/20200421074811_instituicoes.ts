import * as Knex from "knex";

const TABLE_NAME = "instituicoes";

export function up(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.raw(`
      CREATE TABLE ${TABLE_NAME}(
        ans_id INTEGER PRIMARY KEY NOT NULL,
        nome VARCHAR (255) NOT NULL,
        cobertura VARCHAR (255) NOT NULL,
        porte VARCHAR (64) NOT NULL,
        created_on TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
}

export function down(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.dropTable(TABLE_NAME);
}
