import { Client } from 'pg'
import knex from 'knex'

const dbOptions = require('../knexfile')
const { host, port, user, password, database } = dbOptions.connection
const client = new Client({ host, port, user, password, database: 'postgres' })

const disconnectUsers = `
SELECT pg_terminate_backend(pid) FROM pg_stat_activity
WHERE pid <> pg_backend_pid() AND datname = '${database}';
`
const createSQL = `
CREATE DATABASE "${database}" WITH ENCODING "UTF8";
`
const dropSQL = `
DROP DATABASE "${database}";
`

before(function () {
  this.timeout(10000)
  process.stdout.write(`Creating test database - ${database} ...`)
  return Promise.resolve()
    .then(() => client.connect())
    .then(() => client.query(createSQL))
    .then(() => knex(dbOptions).migrate.latest())
    .then(() => {
      const { default: db } = require('../src/services/db')
      return db.init()
    })
    .then(() => {
      process.stdout.write('Done\n')
      process.stdout.write(`DB: ${process.env.DB_URL}\n\n`)
    })
    .catch(e => {
      process.stdout.write('Failed\n')
      process.stderr.write(e.stack)
    })
})

after(function () {
  this.timeout(10000)
  return Promise.resolve()
    .then(() => client.query(disconnectUsers))
    .then(() => client.query(dropSQL))
    .then(() => { client.end() })
})
