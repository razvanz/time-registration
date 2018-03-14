const url = require('url')
const moment = require('moment')
const types = require('pg').types

const PG_TIMESTAMP_OID = 1114
const timestampParser = val => val === null ? null : moment.utc(val).toISOString()
types.setTypeParser(PG_TIMESTAMP_OID, timestampParser)

if (!process.env.DB_URL) {
  throw new Error(`Invalid value "${process.env.DB_URL}" for env variable DB_URL`)
}

const DEFAULTS = {
  connection: {
    dateStrings: false
  },
  pool: { min: 2, max: 10 },
  migrations: { tableName: 'knex_migrations' }
}

const config = url.parse(process.env.DB_URL)
const options = {
  client: config.protocol.replace(/:$/, ''),
  connection: {}
}

if (!['pg'].includes(options.client)) {
  throw new Error(`Unsupported client ${options.client}`)
}

const auth = config.auth.split(':')
options.connection = Object.assign({
  host: config.hostname,
  port: config.port,
  database: config.pathname.match(/^\/(.*)/)[1],
  user: auth[0],
  password: auth[1]
}, DEFAULTS.connection)

module.exports = Object.assign(DEFAULTS, options)
