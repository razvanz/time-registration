exports.up = function (knex) {
  return knex.schema
    .raw(`CREATE TYPE scope AS ENUM ('user','manager','admin');`)
    .raw(`CREATE TYPE grant_type AS ENUM ('password', 'client_credentials', 'refresh_token');`)
    .createTable('users', (table) => {
      table.string('id', 36).primary()
      table.string('name', 128).notNullable()
      table.string('email', 256).notNullable().unique()
      table.string('password', 256).notNullable()
      table.specificType('scope', 'scope[]').notNullable().defaultTo('{user}')
      table.timestamps(true)
    })
    .createTable('clients', (table) => {
      table.string('id', 36).primary()
      table.string('secret').notNullable()
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.specificType('grants', 'grant_type[]').notNullable().defaultTo('{}')
      table.specificType('redirect_uris', 'text[]').notNullable().defaultTo('{}')
      table.string('user_id', 36).nullable()
      table.timestamps(true)
    })
    .createTable('refresh_tokens', (table) => {
      table.string('id').primary()
      table.timestamp('expires_at', true).notNullable()
      table.specificType('scope', 'scope[]').notNullable().defaultTo('{}')
      table.string('client_id', 36).notNullable()
      table.string('user_id', 36).notNullable()
      table.timestamps(true)

      table.foreign('client_id')
        .references('clients.id')
        .onDelete('CASCADE')
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTable('refresh_tokens')
    .dropTable('clients')
    .dropTable('users')
    .raw(`DROP TYPE scope;`)
    .raw(`DROP TYPE grant_type;`)
}
