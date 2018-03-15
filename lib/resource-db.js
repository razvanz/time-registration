const _ = require('lodash')

const OPERATIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete'
}

const toCase = (caseFn, val) => (typeof val === 'string')
  ? caseFn(val)
  : _.transform(val, (res, v, k) => { res[caseFn(k)] = v; return res }, {})
const toCamelCase = (val) => toCase(_.camelCase, val)
const toSnakeCase = (val) => toCase(_.snakeCase, val)

module.exports = class ResourceDB {
  constructor (knex, table) {
    this._knex = knex
    this._table = table
  }

  get db () {
    return this._knex(this._table)
  }

  /****************************************************************************
   * API
   ***************************************************************************/

  find (...criteria) {
    return this._withWhere(this.db, criteria)
      .select()
      .then(this.decode.bind(this))
  }

  get (id) {
    return this.find({ id })
      .then(rows => rows[0])
  }

  create (...value) {
    let insert = _.map(value, (v) => this.encode(this.defaults(v, OPERATIONS.CREATE)))

    return this.db.insert(insert).returning('id')
  }

  update (...criteria) { // [...criteria, update]
    let update = this.encode(this.defaults(criteria.pop(), OPERATIONS.UPDATE))

    return this._withWhere(this.db, criteria).update(update)
  }

  delete (...criteria) {
    return this._withWhere(this.db, criteria).delete()
  }

  upsert (value) {
    let insertSQL = super.create(value).toString()
    let updateSQL = super.update(value).toString()

    return this._knex.raw(
      `${insertSQL}
      ON CONFLICT ("id") DO
      ${updateSQL.replace(/update .* set/i, 'update set')}`
    )
  }

  truncate () {
    return this.db.truncate()
  }

  transact (fn) {
    return this._knex.transaction(function (trx) {
      return Promise.resolve(fn(trx))
        .then(trx.commit)
        .catch(trx.rollback)
    })
  }

  raw (...args) {
    return this._knex.raw(...args)
  }

  /****************************************************************************
   * Encoding
   ***************************************************************************/

  encode (criteria) {
    if (criteria instanceof Array) {
      return [toSnakeCase(criteria[0]), ...criteria.slice(1)]
    }

    return toSnakeCase(criteria)
  }

  decode (data) {
    if (data instanceof Array) {
      return _.map(data, this.decode.bind(this))
    }

    return toCamelCase(data)
  }

  /****************************************************************************
   * Defaults
   ***************************************************************************/

  defaults (value, op) {
    let now = this.now()

    if (op === OPERATIONS.CREATE) return _.defaults({}, value, { createdAt: now })
    if (op === OPERATIONS.UPDATE) return _.defaults({}, value, { updatedAt: now })

    return value
  }

  now () {
    return new Date().toISOString()
  }

  /****************************************************************************
   * Private helper methods
   ***************************************************************************/

  /**
   * Adds where clauses to a given query based on provided criteria(s).
   * criteria can be:
   *  - Array       : ['col1', 'is', null]
   *  - Object      : { col1: null }
   *  - Array<Array>: [['col1', 'is', null], ['col2', 'is not', null]]
   * @method  _withWhere
   * @param   {knex.QueryBuilder}           baseQuery Knex query to be enriched with where clauses
   * @param   {Array|Object|Array<Array>}   criteria  Criteria(s) to be added as where clauses
   * @returns {knex.QueryBuilder}                     Query enriched with where clauses
   */
  _withWhere (baseQuery, criteria) {
    return _.reduce(
      !(_.isPlainObject(criteria[0]) || criteria[0] instanceof Array) ? [criteria] : criteria,
      (q, c) => (c instanceof Array) ? q.where(...this.encode(c)) : q.where(this.encode(c)),
      baseQuery
    )
  }
}
