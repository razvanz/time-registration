import _ from 'lodash'
import { userDB } from '../../services/db'

export async function validateScope (user, client, scope) {
  let authorizedScope = user.scope || _.get(await userDB.get(user.id), 'scope').join(' ')
  let requestedScope = scope

  if (!requestedScope) return authorizedScope

  const authorizedScopeArr = `${authorizedScope}`.split(/\s/)
  const requestedScopeArr = `${requestedScope}`.split(/\s/)
  const isScopeAuthorized = authorizedScopeArr.includes.bind(authorizedScopeArr)

  if (authorizedScopeArr.includes('admin')) return requestedScope
  if (!requestedScopeArr.every(isScopeAuthorized)) return false

  return requestedScope
}
