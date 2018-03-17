import { authorizationCodeDB } from '../../services/db'

export async function saveAuthorizationCode (code, client, user) {
  const authorizationCode = {
    id: code.authorizationCode,
    expires_at: code.expiresAt,
    redirect_uri: code.redirectUri,
    scope: code.scope,
    client_id: client.id,
    user_id: user.id
  }

  await authorizationCodeDB.create(authorizationCode)

  return Object.assign({ client, user }, code)
}
