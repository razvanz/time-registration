import { userDB } from '../../services/db'

export async function getUserFromClient (client) {
  if (!client.user_id) return null

  const user = await userDB.get(client.user_id)

  if (!user) return null

  return {
    ...user,
    scope: (user.scope || []).join(' ')
  }
}
