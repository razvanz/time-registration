exports.up = function (knex) {
  return knex.schema
    .createTable('clients', (table) => {
      table.string('id', 36).primary()
      table.string('secret').notNullable()
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.string('grants').notNullable()
      table.text('redirect_uris').notNullable()
      table.string('user_id', 36).nullable()
      table.timestamps(true)
    })
    .createTable('users', (table) => {
      table.string('id', 36).primary()
      table.string('name', 128).notNullable()
      table.string('email', 256).notNullable().unique()
      table.string('password', 256).notNullable()
      table.timestamps(true)
    })
    .createTable('authorization_codes', (table) => {
      table.string('id').primary()
      table.dateTime('expires_at').notNullable()
      table.text('redirect_uri').notNullable()
      table.text('scope').nullable()
      table.string('client_id', 36).notNullable()
      table.string('user_id', 36).nullable()
      table.timestamps(true)

      table.foreign('client_id')
        .references('clients.id')
        .onDelete('CASCADE')
    })
    .createTable('refresh_tokens', (table) => {
      table.string('id').primary()
      table.dateTime('expires_at').notNullable()
      table.text('scope').notNullable()
      table.string('client_id', 36).notNullable()
      table.string('user_id', 36).notNullable()
      table.timestamps(true)

      table.foreign('client_id')
        .references('clients.id')
        .onDelete('CASCADE')
    })
    .createTable('user_scopes', (table) => {
      table.string('id', 36).primary()
      table.string('user_id', 36).notNullable()
      table.string('scope', 128).notNullable()
      table.timestamps(true)

      table.unique(['user_id', 'scope'])
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTable('clients')
    .dropTable('authorization_codes')
    .dropTable('refresh_tokens')
    .dropTable('user_scopes')
}
