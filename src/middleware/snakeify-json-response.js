import _ from 'lodash'

const toCase = (caseFn, val) => Array.isArray(val)
  ? _.map(val, _.partial(toCase, caseFn))
  : _.transform(val, (res, v, k) => { res[caseFn(k)] = v; return res }, {})
const toSnakeCase = (val) => toCase(_.snakeCase, val)

export default function snakeifyJsonResponse () {
  return (req, res, next) => {
    const _json = res.json.bind(res)

    res.json = (data) => _json(toSnakeCase(data))
    next()
  }
}
