import { genRandomString } from '../../services/utils'

export async function generateRefreshToken (client, user, scope) {
  return genRandomString(128, 'base64')
}
