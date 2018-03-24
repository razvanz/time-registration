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
      return next(createError('E_HTTP_BAD_REQUEST', err, err.detail))
    }

    return next(err)
  }
}
