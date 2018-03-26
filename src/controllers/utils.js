export default class UtilsController {
  static handleErrors (err, req, res, next) {
    const { createError } = req.locals

    // Validation errors
    if (err.code === 'ERR_ASSERTION') {
      return next(createError('E_HTTP_BAD_REQUEST', err, err.message))
    }

    // Postgresql errors (https://www.postgresql.org/docs/9.6/static/errcodes-appendix.html)
    if (err.code === '23505') { // unique constraint
      return next(createError('E_HTTP_CONFLICT', err, err.detail))
    }
    if (err.code === '23503') { // foreign key constraint
      return next(createError('E_HTTP_BAD_REQUEST', err, err.detail))
    }

    if (err.code === '23514') { // check constraint
      if (err.constraint === 'valid_ts_interval') {
        return next(createError('E_HTTP_BAD_REQUEST', err,
          '"start_ts" must be lower than "end_ts"'))
      } else if (err.constraint === 'day_hours') {
        return next(createError('E_HTTP_BAD_REQUEST', err,
          '"preferred_hours" must be greater (or equal) than 0 and lower or equal) than 24'))
      } else {
        return next(createError('E_HTTP_BAD_REQUEST', err, err.detail))
      }
    }

    return next(err)
  }
}
