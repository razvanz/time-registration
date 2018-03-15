import { userDB } from '../../services/db'

export async function getUserFromClient (client) {
  if (!client.userId) return null

  return userDB.get(client.userId)
}
