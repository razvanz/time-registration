import { genRandomString } from '../../services/utils'

export function generateAuthorizationCode (client, user, scope) {
  return genRandomString(128, 'base64')
}
