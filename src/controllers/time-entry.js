import _ from 'lodash'
import moment from 'moment'
import { timeEntryDB, userDB } from '../services/db'
import * as validator from '../services/validator'
import {
  applyDefaultValues,
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
    type: 'array',
    required: false,
    validate: (val) => _.every(val, v =>
      !validator.is('string', v) && !validator.between(1, 256, v.length))
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
  @applyPaginationQuery
  @applySortQuery(TIME_ENTRY_SORT_CONFIG)
  static async list (req, res) {
    const timeEntries = await req.queryBuilder

    if (`${req.get('Accept')}`.includes('application/json')) {
      res.json(timeEntries)
      return
    }

    // Respond with HTML for export
    const userIds = _.uniq(_.map(timeEntries, 'user_id'))
    const userMap = _.keyBy(await userDB.find(['id', 'in', userIds]).select(['id', 'name']), 'id')

    await new Promise((resolve, reject) => {
      res.render('time-entries-export', {
        timeEntries: _.map(timeEntries, te => ({
          ...te,
          user: userMap[te.user_id],
          start_ts: moment(te.start_ts).add(req.query.tz || 0, 'minutes').toISOString(),
          duration: Math.round(moment(te.end_ts)
            .diff(moment(te.start_ts), 'hours', true) * 10 * 2) / 10 / 2
        }))
      }, (err, html) => {
        if (err) return reject(err)

        res.send(html)
        resolve()
      })
    })
  }

  @asyncMiddlewareAutoNext
  static async get (req, res) {
    res.json(req.data.timeEntry)
  }

  @asyncMiddlewareAutoNext
  @applyDefaultValues(TIME_ENTRY_SCHEMA)
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
