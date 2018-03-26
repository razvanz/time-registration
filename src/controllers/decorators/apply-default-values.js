import _ from 'lodash'

export default function applyDefaultValues (schemaConfig) {
  return function (target, key, descriptor) {
    let { value } = descriptor

    descriptor.value = (req, res, next) => {
      const { body } = req

      _.forEach(schemaConfig, (config, prop) => {
        if ('default' in config && !(prop in body)) {
          body[prop] = config.default
        }
      })

      return value(req, res, next)
    }

    return descriptor
  }
}
