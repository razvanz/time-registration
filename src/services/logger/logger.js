import _ from 'lodash'
import BunyanLogger from 'bunyan'
import {
  reqSerializer,
  resSerializer,
  errorSerializer
} from './utils'

export default class Logger extends BunyanLogger {
  constructor (options = {}, childOptions = {}, contextFields) {
    if (options instanceof Logger) {
      super(options, childOptions)
      return this
    }

    const envLogLevel = parseInt(process.env.LOG_LEVEL, 10) || process.env.LOG_LEVEL

    options.name = options.name || process.env.npm_package_name
    options.level = options.level || envLogLevel || 30

    options.serializers = _.defaults(options.serializers, {
      req: reqSerializer,
      res: resSerializer,
      err: errorSerializer,
      error: errorSerializer
    })

    super(options)

    this.contextFields = contextFields || Logger.DEFAULT_CONTEXT_FIELDS
  }

  with (context) {
    return this.child(_.pick(context, this.contextFields))
  }

  static get DEFAULT_CONTEXT_FIELDS () {
    return [
      'requestId'
    ]
  }
}
