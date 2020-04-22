import * as Knex from "knex";

const TABLE_NAME = "indices";

export function up(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.raw(`
      CREATE TABLE ${TABLE_NAME}(
        ans_id        INTEGER NOT NULL,
        ano           INTEGER NOT NULL,
        mes           INTEGER NOT NULL,
        classificacao NUMERIC (6, 2) NOT NULL,
        indice        NUMERIC (6, 2) NOT NULL,
        created_on    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (ans_id, ano, mes)
      );
    `);
}

export function down(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.dropTable(TABLE_NAME);
}
