import { refreshTokenDB } from '../../services/db'

export async function saveToken (token, client, user) {
  const savedToken = Object.assign({ client, user }, token)

  if (!token.refreshToken) return savedToken

  const refreshToken = {
    id: token.refreshToken,
    expires_at: token.refreshTokenExpiresAt,
    scope: `${token.scope}`.split(' '),
    client_id: client.id,
    user_id: user.id
  }

  await refreshTokenDB.create(refreshToken)

  return savedToken
}
