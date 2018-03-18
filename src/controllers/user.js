import _ from 'lodash'
import { userDB } from '../services/db'
import {
  applyFilterQuery,
  applyPaginationQuery,
  applySortQuery,
  assignId,
  asyncMiddlewareAutoNext,
  buildReadQuery,
  validate
} from './decorators'

export const USER_SCHEMA = {
  id: {
    type: 'string',
    min_length: 36,
    max_length: 36,
    required: false,
    value: _.partialRight(_.get, 'params.id')
  },
  name: {
    type: 'string',
    min_length: 1,
    max_length: 128,
    required: true
  },
  email: {
    type: 'email',
    min_length: 5,
    max_length: 256,
    required: true
  },
  password: {
    type: 'password',
    required: (req) => ['POST'].includes(`${req.method}`.toUpperCase())
  }
}
export const USER_FILTER_CONFIG = {
  name: {
    type: 'string',
    operators: ['=', 'like'],
    case_insensitive: true
  }
}
export const USER_SORT_CONFIG = {
  name: {
    type: 'string',
    values: ['asc', 'desc']
  }
}

export default class UserController {
  @asyncMiddlewareAutoNext
  @buildReadQuery(userDB)
  @limitProxyReadToManager
  static async load (req, res) {
    const { createError } = req.locals
    const { queryBuilder: query } = req
    const [user] = await query

    if (!user) throw createError('E_HTTP_NOT_FOUND')

    req.data.user = user
  }

  @asyncMiddlewareAutoNext
  @buildReadQuery(userDB)
  @limitProxyReadToManager
  @applyFilterQuery(USER_FILTER_CONFIG)
  @applySortQuery(USER_SORT_CONFIG)
  @applyPaginationQuery
  @hidePasswordInResponse
  static async list (req, res) {
    const users = await req.queryBuilder

    res.json(users)
  }

  @asyncMiddlewareAutoNext
  @hidePasswordInResponse
  static async get (req, res) {
    res.json(req.data.user)
  }

  @asyncMiddlewareAutoNext
  @validate(USER_SCHEMA)
  @assignId
  static async create (req, res) {
    const { body } = req
    const [id] = await userDB.create(body)

    res.set('Location', `${req.url.replace(/\/$/, '')}/${id}`)
    res.status(201).json({ id })
  }

  @asyncMiddlewareAutoNext
  @validate(USER_SCHEMA)
  @hidePasswordInResponse
  static async update (req, res) {
    const { body, params } = req
    const value = { ...body, ...params }

    await userDB.update(params, value)
    res.json({
      ...req.data.user,
      ...value
    })
  }

  @asyncMiddlewareAutoNext
  static async delete (req, res) {
    // TODO delete or disable
    await userDB.delete(req.params)
    res.status(200).end()
  }
}

export function limitProxyReadToManager (target, key, descriptor) {
  let { value } = descriptor

  descriptor.value = (req, res, next) => {
    const { user, queryBuilder } = req
    const userScope = `${user.scope}`.split(/\s/)

    if (!userScope.includes('admin') || !userScope.includes('manager')) {
      // limit non-admin users only their entries
      queryBuilder.where('id', req.user.id)
    }

    return value(req, res, next)
  }

  return descriptor
}

export function hidePasswordInResponse (target, key, descriptor) {
  let { value } = descriptor

  descriptor.value = (req, res, next) => {
    const _json = res.json.bind(res)
    const hideUserPassword = function (user) {
      if ('password' in user) user.password = !!user.password

      return user
    }

    res.json = data => _json(Array.isArray(data)
      ? _.map(data, hideUserPassword)
      : hideUserPassword(data))

    return value(req, res, next)
  }

  return descriptor
}
