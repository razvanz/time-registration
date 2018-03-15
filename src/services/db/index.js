import knex from 'knex'
import ResourceDB from '../../../lib/resource-db'
import UserDB from './user-db'
import options from '../../../knexfile'

const db = knex(options)
export default db
export const authorizationCodeDB = new ResourceDB(db, 'authorization_codes')
export const clientDB = new ResourceDB(db, 'clients')
export const refreshTokenDB = new ResourceDB(db, 'refresh_tokens')
export const userScopeDB = new ResourceDB(db, 'user_scopes')
export const userDB = new UserDB(db, 'users', userScopeDB)
