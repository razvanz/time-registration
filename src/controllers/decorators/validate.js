import _ from 'lodash'

export default function validate (schemaConfig) {
  return function (target, key, descriptor) {
    let { value } = descriptor

    descriptor.value = (req, res, next) => {
      const {
        locals: { validator },
        body
      } = req

      validator.is('object', body, `Invalid request body value "${body}". Please send an object.`)

      const extraProps = _.difference(_.keys(body), _.keys(schemaConfig))

      validator.equal(extraProps.length, 0,
        `Invalid properties: "${extraProps.join('", "')}".` +
        `Supported properties are: "${_.keys(schemaConfig).join('", "')}"`)

      _.forEach(schemaConfig, (config, prop) => {
        const required = typeof config.required === 'function'
          ? config.required(req)
          : config.required

        if (required) {
          validator.equal(!!body[prop], true, `Missing required property "${prop}"`)
        } else if (!body[prop]) {
          return
        }

        validator.is(config.type, body[prop],
          `"${prop}" filter value must be a ${config.type}`)

        if (config.min_length) {
          validator.greaterThan(config.min_length, `${body[prop]}`.length,
            `"${prop}" value must be longer than ${config.min_length}`)
        }

        if (config.max_length) {
          validator.lessThan(config.max_length, `${body[prop]}`.length,
            `"${prop}" value must be no longer than ${config.max_length}`)
        }

        if (config.validate && typeof config.validate === 'function') {
          validator.equal(config.validate(body[prop], req), true, `Invalid value for "${prop}"`)
        }
      })

      return value(req, res, next)
    }

    return descriptor
  }
}
