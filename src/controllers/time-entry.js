import { timeEntryDB } from '../services/db'
import {
  applyFilterQuery,
  applyPaginationQuery,
  applySortQuery,
  assignId,
  asyncMiddlewareAutoNext,
  buildReadQuery,
  validate
} from './decorators'

export const TIME_ENTRY_SCHEMA = {
  id: {
    type: 'string',
    min_length: 36,
    max_length: 36,
    required: false,
    validate: (val, req) => val === req.params.id
  },
  user_id: {
    type: 'string',
    min_length: 36,
    max_length: 36,
    required: false
  },
  start_ts: {
    type: 'date',
    required: true
  },
  end_ts: {
    type: 'date',
    required: true
  },
  description: {
    type: 'string',
    min_length: 0,
    max_length: 5000,
    required: false
  }
}
export const TIME_ENTRY_FILTER_CONFIG = {
  start_ts: {
    type: 'date',
    operators: ['=', '<', '>', '>=', '<='],
    case_insesitive: false
  },
  end_ts: {
    type: 'date',
    operators: ['=', '<', '>', '>=', '<='],
    case_insesitive: false
  }
}
export const TIME_ENTRY_SORT_CONFIG = {
  start_ts: {
    type: 'string',
    values: ['asc', 'desc']
  },
  end_ts: {
    type: 'string',
    values: ['asc', 'desc']
  }
}

export default class TimeEntryController {
  @asyncMiddlewareAutoNext
  @buildReadQuery(timeEntryDB)
  @limitProxyReadToAdmin
  static async load (req, res) {
    const { createError } = req.locals
    const { queryBuilder: query } = req
    const [timeEntry] = await query

    if (!timeEntry) throw createError('E_HTTP_NOT_FOUND')

    req.data.timeEntry = timeEntry
  }

  @asyncMiddlewareAutoNext
  @buildReadQuery(timeEntryDB)
  @limitProxyReadToAdmin
  @applyFilterQuery(TIME_ENTRY_FILTER_CONFIG)
  @applySortQuery(TIME_ENTRY_SORT_CONFIG)
  @applyPaginationQuery
  static async list (req, res) {
    const timeEntries = await req.queryBuilder

    // TODO Respond with timeEntries based on content type (export)
    res.json(timeEntries)
  }

  @asyncMiddlewareAutoNext
  static async get (req, res) {
    res.json(req.data.timeEntry)
  }

  @asyncMiddlewareAutoNext
  @validate(TIME_ENTRY_SCHEMA)
  @limitProxyWriteToAdmin
  @assignId
  static async create (req, res) {
    const { body } = req
    const [id] = await timeEntryDB.create(body)

    res.set('Location', `${req.url.replace(/\/$/, '')}/${id}`)
    res.status(201).json({ id })
  }

  @asyncMiddlewareAutoNext
  @validate(TIME_ENTRY_SCHEMA)
  @limitProxyWriteToAdmin
  static async update (req, res) {
    const { body, params } = req
    const value = { ...body, ...params }

    await timeEntryDB.update(params, value)
    res.json({
      ...req.data.timeEntry,
      ...value
    })
  }

  @asyncMiddlewareAutoNext
  static async delete (req, res) {
    await timeEntryDB.delete(req.params)
    res.status(200).end()
  }
}

export function limitProxyReadToAdmin (target, key, descriptor) {
  let { value } = descriptor

  descriptor.value = (req, res, next) => {
    const { user, queryBuilder } = req
    const userScope = `${user.scope}`.split(/\s/)

    if (!userScope.includes('admin')) {
      // limit non-admin users only their entries
      queryBuilder.where('user_id', req.user.id)
    }

    return value(req, res, next)
  }

  return descriptor
}

export function limitProxyWriteToAdmin (target, key, descriptor) {
  let { value } = descriptor

  descriptor.value = (req, res, next) => {
    const {
      locals: { createError },
      user,
      body
    } = req
    const userScope = `${user.scope}`.split(/\s/)

    // limit non-admin users only their entries
    if (!userScope.includes('admin') && body.user_id !== user.id) {
      throw createError('E_HTTP_FORBIDDEN')
    }

    return value(req, res, next)
  }

  return descriptor
}
