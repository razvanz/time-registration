import _ from 'lodash'
import knex from 'knex'
import ResourceDB from '../../../lib/resource-db'
import UserDB from './user-db'
import options from '../../../knexfile'
import moment from 'moment'
import { types } from 'pg'

const timestampParser = val => val === null ? null : moment.utc(val).toISOString()

const db = knex(options)
db.init = async function () {
  const typeInfo = await db('pg_type')
    .select(['typname', 'typarray'])
    .whereIn('typname', ['scope', 'grant_type'])

  const PG_TIMESTAMP_OID = 1114
  const OID_ARRAY_TEXT = 1009
  const OID_ARRAY_SCOPE = _.get(_.find(typeInfo, { typname: 'scope' }), 'typarray')
  const OID_ARRAY_GRANT_TYPE = _.get(_.find(typeInfo, { typname: 'grant_type' }), 'typarray')

  types.setTypeParser(PG_TIMESTAMP_OID, timestampParser)
  types.setTypeParser(OID_ARRAY_SCOPE, types.getTypeParser(OID_ARRAY_TEXT))
  types.setTypeParser(OID_ARRAY_GRANT_TYPE, types.getTypeParser(OID_ARRAY_TEXT))
}

export default db
export const userDB = new UserDB(db, 'users')
export const clientDB = new ResourceDB(db, 'clients')
export const refreshTokenDB = new ResourceDB(db, 'refresh_tokens')
export const timeEntryDB = new ResourceDB(db, 'time_entries')
