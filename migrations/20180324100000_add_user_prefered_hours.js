exports.up = function (knex) {
  return knex.schema
    .raw(`
      ALTER TABLE "public"."users"
        ADD COLUMN "preferred_hours" integer NOT NULL DEFAULT '0',
        ADD CONSTRAINT "day_hours" CHECK (preferred_hours >= 0 AND preferred_hours <= 24);
    `)
}

exports.down = function (knex) {
  return knex.schema
    .raw(`
      ALTER TABLE "public"."users" DROP COLUMN "preferred_hours";
    `)
}
