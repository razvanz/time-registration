import _ from 'lodash'

module.exports = (options) => {
  return function (err, req, res, next) {
    const { createError } = req.locals

    err = _.map(
      err instanceof Array ? err : [err],
      e => e instanceof options.type ? e : createError(e)
    )

    return next(err)
  }
}
