exports.up = function (knex) {
  return knex.schema
    .raw(`
      ALTER TABLE "public"."time_entries"
        ALTER COLUMN "description" TYPE text[] USING array[description]::text[],
        ALTER COLUMN "description" SET DEFAULT '{}';
    `)
}

exports.down = function (knex) {
  return knex.schema
    .raw(`
      ALTER TABLE "public"."time_entries"
        ALTER COLUMN "description" TYPE text USING array_to_string(description, '|')::text;
    `)
}
