import { refreshTokenDB } from '../../services/db'

export function revokeToken (token) {
  return refreshTokenDB.delete({ id: token.refreshToken })
}
