import { authorizationCodeDB } from '../../services/db'

export function revokeAuthorizationCode (code) {
  return authorizationCodeDB.delete({ id: code.code })
}
