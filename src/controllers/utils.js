export default class UtilsController {
  static handleValidationErrors (err, req, res, next) {
    const { logger, createError } = req.locals

    if (err.code === 'ERR_ASSERTION') {
      logger.error({ type: 'validation-error' }, err)
      return next(createError('E_HTTP_BAD_REQUEST', err, err.message))
    }

    return next(err)
  }
}
