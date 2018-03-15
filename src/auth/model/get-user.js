import { userDB } from '../../services/db'

export function getUser (email, password) {
  return userDB.getByCredentials(email, password)
}
