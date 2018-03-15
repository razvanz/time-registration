import { refreshTokenDB } from '../../services/db'

export async function saveToken (token, client, user) {
  const savedToken = Object.assign({ client, user }, token)

  if (!token.refreshToken) return savedToken

  const refreshToken = {
    id: token.refreshToken,
    expiresAt: token.refreshTokenExpiresAt,
    scope: token.scope,
    clientId: client.id,
    userId: user.id
  }

  await refreshTokenDB.create(refreshToken)

  return savedToken
}
