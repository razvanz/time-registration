import _ from 'lodash'

export const handlingLogger = () => {
  return function (req, res, next) {
    const { logger } = req.locals

    logger.info({ type: 'http-request', req })

    res.once('finish', () => {
      logger.info({ type: 'http-response', res })
    })

    return next()
  }
}

export const errorLogger = () => {
  return function (err, req, res, next) {
    const { locals: { logger } } = req

    _.forEach(
      err instanceof Array ? err : [err],
      e => logger.error({ error: e })
    )

    return next(err)
  }
}
