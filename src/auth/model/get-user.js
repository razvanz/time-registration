import { userDB } from '../../services/db'

export async function getUser (email, password) {
  const user = await userDB.getByCredentials(email, password)

  if (!user) return null

  return {
    ...user,
    scope: (user.scope || []).join(' ')
  }
}
