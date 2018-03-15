import InvalidTokenError from 'oauth2-server/lib/errors/invalid-token-error'
import * as jwt from '../../services/jwt'

export async function getAccessToken (accessToken) {
  if (!jwt.isJWT(accessToken)) {
    throw new InvalidTokenError('Invalid token: access token is invalid')
  }

  const data = await jwt.decode(accessToken)

  if (!data) return null

  return {
    accessToken,
    accessTokenExpiresAt: new Date(data.exp * 1000),
    client: data.client,
    user: data.user,
    scope: data.scope
  }
}
