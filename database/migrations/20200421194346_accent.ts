import * as Knex from "knex";

export function up(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.raw(`CREATE EXTENSION IF NOT EXISTS unaccent;`);
}

export function down(knex: Knex): Knex.SchemaBuilder {
    return knex.schema.raw(`DROP EXTENSION IF EXISTS unaccent;`);
}
