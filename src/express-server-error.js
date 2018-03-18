import ServiceError from '@razvanz/service-error'

class ExpressServerError extends ServiceError {
  constructor (error, innerError, ...args) {
    super(error, innerError, ...args)

    this.status_code = error.status_code || (innerError && innerError.status_code) || 500
  }

  toJSON () {
    return Object.assign(super.toJSON(), { status_code: this.status_code })
  }

  serialize () {
    return {
      code: this.code,
      message: this.message
    }
  }
}

module.exports = ExpressServerError
