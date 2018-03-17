import _ from 'lodash'
import asyncMiddlewareAutoNext from '../../lib/async-middleware-auto-next'
import { default as oAuth2, Request, Response, errors as oAuthErrors } from '../auth'

const OAUTH_ERROR_MAP = {
  server_error: 'E_INTERNAL',
  invalid_argument: 'E_INVALID_ARGUMENT',
  access_denied: 'E_ACCESS_DENIED',
  insufficient_scope: 'E_INSUFFICIENT_SCOPE',
  invalid_client: 'E_INVALID_CLIENT',
  invalid_grant: 'E_INVALID_GRANT',
  invalid_request: 'E_INVALID_REQUEST',
  invalid_scope: 'E_INVALID_SCOPE',
  invalid_token: 'E_INVALID_TOKEN',
  unauthorized_client: 'E_UNAUTHORIZED_CLIENT',
  unauthorized_request: 'E_UNAUTHORIZED_REQUEST',
  unsupported_grant_type: 'E_UNSUPPORTED_GRANT_TYPE',
  unsupported_response_type: 'E_UNSUPPORTED_RESPONSE_TYPE'
}

export default class AuthController {
  @asyncMiddlewareAutoNext
  static async token (req, res, next) {
    const request = new Request(req)
    const response = new Response(res)

    const result = await oAuth2.token(request, response)

    res.json(_.omit(result, ['client', 'user']))
  }

  static errorHandler (err, req, res, next) {
    const { createError } = req.locals

    // map jsonwebtoken errors to OAuthError
    if (err.name === 'server_error' && err.inner &&
      ['JsonWebTokenError', 'TokenExpiredError'].includes(err.inner.name)) {
      err = new oAuthErrors.InvalidTokenError(err.inner)
    }

    if (err instanceof oAuthErrors.OAuthError) {
      return next(createError(OAUTH_ERROR_MAP[err.name], err, err.message))
    }

    return next(err)
  }
}
