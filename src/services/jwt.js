import jwt from 'jsonwebtoken'

export const sign = jwt.sign

export const isJWT = token => !!jwt.decode(token)

export function encode (payload, options) {
  options = Object.assign({
    algorithm: process.env.JWT_ALGORITHM,
    expiresIn: parseInt(process.env.JWT_VALIDITY, 10) || process.env.JWT_VALIDITY
    // FIXME Also configure token iss, sub, aud, etc.
    // https://tools.ietf.org/html/rfc7519#section-4.1
  }, options)

  return new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) =>
      err ? reject(err) : resolve(token)))
}

export function decode (token, options) {
  options = Object.assign({
    algorithm: process.env.JWT_ALGORITHM,
    ignoreExpiration: false
  }, options)

  return new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, options, (err, payload) =>
      err ? reject(err) : resolve(payload)))
}
