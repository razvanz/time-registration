import _ from 'lodash'
import zxcvbn from 'zxcvbn'
import assert from 'assert'

const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

export default function validator (trutly, message) {
  assert(trutly, message)
}

export function equal (comparator, value, message) {
  assert(value === comparator, message)
}

export function is (type, value, message) {
  switch (type) {
    case 'number':
      isNumber(value, message)
      return
    case 'string':
      isString(value, message)
      return
    case 'date':
      isDate(value, message)
      return
    case 'object':
      isObject(value, message)
      return
    case 'email':
      isString(value, message)
      isEmail(value, message)
      return
    case 'password':
      isString(value, message)
      isPassword(value, message)
      return
    default:
      throw new Error(`No validator available for type "${type}"`)
  }
}

export function isNumber (value, message) {
  assert(!isNaN(value), message)
}

export function isString (value, message) {
  assert(typeof value === 'string', message)
}

export function isDate (value, message) {
  assert(new Date(value).toString() !== 'Invalid Date', message)
}

export function isObject (value, message) {
  assert(_.isPlainObject(value), message)
}

export function isEmail (value, message) {
  assert(EMAIL_REGEXP.test(`${value}`.toLowerCase()), message)
}

export function isPassword (value) {
  const { score, feedback: { warning, suggestions } } = zxcvbn(value)
  const message = `${warning}\n${suggestions.join('\n')}`

  assert(score > 1, message)
}

export function property (obj, prop, message) {
  assert(prop in obj, message)
}

export function notProperty (obj, prop, message) {
  assert(!(prop in obj), message)
}

export function greaterThan (than, value, message) {
  if (!than) throw new Error(`Invalid comparator value "${than}"`)

  assert(value >= than, message)
}

export function lessThan (than, value, message) {
  if (!than) throw new Error(`Invalid comparator value "${than}"`)

  assert(value <= than, message)
}

export function between (min, max, value, message) {
  greaterThan(min, value, message)
  lessThan(max, value, message)
}

export function includes (arr, value, message) {
  if (!Array.isArray(arr)) throw new Error(`Expected "${arr}" to be an Array`)

  assert(arr.includes(value), message)
}
