exports.up = function (knex) {
  return knex.schema
    .raw(`
      ALTER TABLE "public"."time_entries"
        ADD CONSTRAINT "valid_ts_interval" CHECK (start_ts < end_ts);
    `)
}

exports.down = function (knex) {
  return knex.schema
    .raw(`
      ALTER TABLE "public"."time_entries" DROP CONSTRAINT "valid_ts_interval";
    `)
}
