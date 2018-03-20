import { refreshTokenDB, clientDB, userDB } from '../../services/db'

export async function getRefreshToken (refreshToken) {
  const [data] = await refreshTokenDB.find({ id: refreshToken })

  if (!data) return null

  const client = await clientDB.get(data.client_id)
  const user = await userDB.get(data.user_id)

  return {
    refreshToken: data.id,
    refreshTokenExpiresAt: new Date(data.expires_at),
    scope: (data.scope || []).join(' '),
    client: {
      ...client,
      userId: client.userId
    },
    user
  }
}
