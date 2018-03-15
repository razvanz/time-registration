import OAuth2Server from 'oauth2-server'
import OAuthError from 'oauth2-server/lib/errors/oauth-error'
import InvalidTokenError from 'oauth2-server/lib/errors/invalid-token-error'
import InvalidRequestError from 'oauth2-server/lib/errors/invalid-request-error'
import * as model from './model'

export default new OAuth2Server({
  model: model,
  allowBearerTokensInQueryString: true,
  accessTokenLifetime: process.env.JWT_VALIDITY
})
export { Request, Response } from 'oauth2-server'
export const errors = {
  OAuthError,
  InvalidTokenError,
  InvalidRequestError
}
