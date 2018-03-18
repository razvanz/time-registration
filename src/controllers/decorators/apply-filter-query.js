import _ from 'lodash'

export default function applyFilterQuery (filterConfig) {
  return function (target, key, descriptor) {
    let { value } = descriptor

    descriptor.value = (req, res, next) => {
      const {
        queryBuilder: query,
        locals: { validator },
        query: { filter }
      } = req

      _.forEach(filter, (val, prop) => {
        validator.property(filterConfig, prop, `Unknow filter property "${prop}"`)
        const { type, operators, case_insensitive: caseInsensitive } = filterConfig[prop]

        if (typeof val === 'string') val = { '=': val }

        _.forEach(val, (val, operator) => {
          validator.is(type, val, `"${prop}" filter value must be a ${type}`)
          validator.includes(operators, `${operator}`.toLowerCase(),
            `Unsupported operator "${operator}" for ` +
            `"${prop}" filter. Supported operators are "${operators.join('", "')}".`)

          if (caseInsensitive) {
            query.whereRaw(`LOWER("${prop}") ${operator} LOWER(?)`, val)
          } else {
            query.where(prop, operator, val)
          }
        })
      })

      return value(req, res, next)
    }

    return descriptor
  }
}
