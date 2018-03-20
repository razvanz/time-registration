import _ from 'lodash'
import BunyanLogger from 'bunyan'
import http from 'http'

const MASKED_BODY_PROPERTIES = ['password']

export function errorSerializer (error) {
  return error.toJSON
    ? error.toJSON()
    : BunyanLogger.stdSerializers.err(error)
}

export function reqSerializer (req) {
  const {
    id: requestId,
    method, protocol, url,
    headers, body, query
  } = req
  const endpoint = `${protocol}://${headers.host}${url}`

  return {
    requestId: requestId,
    message: method + ' ' + endpoint,
    method,
    url: endpoint,
    headers,
    body: maskProperties(body, MASKED_BODY_PROPERTIES),
    query
  }
}

export function resSerializer (res) {
  const { req, statusCode, _headers: headers } = res
  const { id: requestId, protocol, url, method, headers: reqHeaders } = req
  const endpoint = `${protocol}://${reqHeaders.host}${url}`

  return {
    requestId: requestId,
    message: statusCode + ' ' + http.STATUS_CODES[statusCode],
    method,
    url: endpoint,
    headers,
    status: statusCode
  }
}

export function maskProperties (object, keys) {
  if (!object) return {}

  return _.transform(object, (result, value, key) => {
    if (keys.includes(key)) {
      result[key] = '...hidden...'
    } else {
      result[key] = value
    }

    return result
  }, {})
}
