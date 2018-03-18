exports.up = function (knex) {
  return knex.schema
    .createTable('time_entries', (table) => {
      table.string('id', 36).primary()
      table.string('user_id', 36).notNullable()
      table.timestamp('start_ts', true).notNullable()
      table.timestamp('end_ts', true).notNullable()
      table.text('description').nullable()
      table.timestamps(true)

      table.foreign('user_id')
        .references('users.id')
        .onDelete('CASCADE')
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTable('time_entries')
}
