import { authorizationCodeDB } from '../../services/db'

export async function saveAuthorizationCode (code, client, user) {
  const authorizationCode = {
    id: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    scope: code.scope,
    clientId: client.id,
    userId: user.id
  }

  await authorizationCodeDB.create(authorizationCode)

  return Object.assign({ client, user }, code)
}
