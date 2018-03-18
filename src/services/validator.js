import _ from 'lodash'
import assert from 'assert'

export default function validator (trutly, message) {
  assert(trutly, message)
}

export function equal (comparator, value, message) {
  assert(value === comparator, message)
}

export function is (type, value, message) {
  switch (type) {
    case 'number':
      return isNumber(value, message)
    case 'string':
      return isString(value, message)
    case 'date':
      return isDate(value, message)
    case 'object':
      return isObject(value, message)
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
