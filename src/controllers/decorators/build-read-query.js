export default function buildReadQuery (db) {
  return function (target, key, descriptor) {
    let { value } = descriptor

    descriptor.value = (req, res, next) => {
      req.queryBuilder = db.find(req.params)

      return value(req, res, next)
    }

    return descriptor
  }
}
