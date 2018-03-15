module.exports = () => {
  return function (req, res, next) {
    const { createError } = req.locals

    if (!res.headersSent) {
      return next(createError('E_HTTP_NOT_FOUND'))
    }

    return next()
  }
}
