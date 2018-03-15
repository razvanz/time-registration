import { refreshTokenDB, clientDB, userDB } from '../../services/db'

export async function getRefreshToken (refreshToken) {
  const [data] = await refreshTokenDB.find({ id: refreshToken })

  if (!data) return null

  const [client] = await clientDB.find({ id: data.clientId })
  const user = await userDB.get(data.userId)

  return {
    refreshToken: data.id,
    refreshTokenExpiresAt: data.expiresAt,
    scope: data.scope,
    client,
    user
  }
}
