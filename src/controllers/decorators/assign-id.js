import uuid from 'uuid'

export default function assignId (target, key, descriptor) {
  let { value } = descriptor

  descriptor.value = (req, res, next) => {
    req.body.id = uuid()

    return value(req, res, next)
  }

  return descriptor
}
