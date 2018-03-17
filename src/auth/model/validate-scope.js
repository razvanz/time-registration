import _ from 'lodash'
import { userScopeDB } from '../../services/db'

export async function validateScope (user, client, scope) {
  let authorizedScope = user.scope
  let requestedScope = scope

  if (!authorizedScope) {
    // For the authorize request, the user object does not contain it's
    // scope property, hence fetch authorized scopes here.
    authorizedScope = _.map(await userScopeDB.find({ user_id: user.id }), 'scope').join(' ')
  }

  if (!requestedScope) return authorizedScope

  const authorizedScopeArr = `${authorizedScope}`.split(/\s/)
  const requestedScopeArr = `${requestedScope}`.split(/\s/)
  const isScopeAuthorized = authorizedScopeArr.includes.bind(authorizedScopeArr)

  if (authorizedScopeArr.includes('admin')) return requestedScope
  if (!requestedScopeArr.every(isScopeAuthorized)) return false

  return requestedScope
}
