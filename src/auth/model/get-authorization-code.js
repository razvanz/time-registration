import { authorizationCodeDB, clientDB, userDB } from '../../services/db'

export async function getAuthorizationCode (authCode) {
  const [data] = await authorizationCodeDB.find({ id: authCode })

  if (!data) return null

  const [client] = await clientDB.find({ id: data.clientId })
  const user = await userDB.get(data.userId)

  return {
    code: data.id,
    expiresAt: data.expiresAt,
    redirectUri: data.redirectUri,
    scope: data.scope,
    client,
    user
  }
}
