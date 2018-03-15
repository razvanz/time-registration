import * as jwt from '../../services/jwt'
import { serializeClient, serializeUser } from '../utils'

export function generateAccessToken (client, user, scope) {
  const payload = {
    client: serializeClient(client),
    user: serializeUser(user),
    scope: scope || user.scope
  }

  return jwt.encode(payload)
}
