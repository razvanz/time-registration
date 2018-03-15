import _ from 'lodash'

const INCLUDE_CLIENT_PROPERTIES = [
  'id',
  'name'
]
const INCLUDE_USER_PROPERTIES = [
  'id',
  'name',
  'email'
]

export const serializeClient = obj => _.pick(obj, INCLUDE_CLIENT_PROPERTIES)
export const serializeUser = obj => _.pick(obj, INCLUDE_USER_PROPERTIES)
