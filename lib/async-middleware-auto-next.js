module.exports = function asyncMiddlewareAutoNext (target, key, descriptor) {
  let { value } = descriptor

  descriptor.value = (req, res, next) =>
    value(req, res, next)
      .then((route) => {
        process.nextTick(() => {
          if (res.headersSent) return
          if (typeof route === 'string') return next(route)

          return next()
        })
      })
      .catch(next)

  return descriptor
}
