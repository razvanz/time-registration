import _ from 'lodash'

module.exports = (options) => {
  return function (err, req, res, next) {
    if (res.headersSend) return next()

    const firstError = _.head(err instanceof Array ? err : [err])
    res.status(firstError.status_code || 500).json(firstError.serialize())

    return next()
  }
}
