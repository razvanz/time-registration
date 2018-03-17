import { userDB } from '../../services/db'

export async function getUserFromClient (client) {
  if (!client.user_id) return null

  return userDB.get(client.user_id)
}
