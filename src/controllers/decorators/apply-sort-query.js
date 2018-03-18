import _ from 'lodash'

export default function applySortQuery (sortConfig) {
  return function (target, key, descriptor) {
    let { value } = descriptor

    descriptor.value = (req, res, next) => {
      const {
        queryBuilder: query,
        locals: { validator },
        query: { sort }
      } = req

      _.forEach(sort, (order, prop) => {
        validator.property(sortConfig, prop, `Unknow sort property "${prop}"`)
        const { type, values } = sortConfig[prop]
        order = `${order}`.toLowerCase()

        validator.is(type, order, `"${prop}" sort value must be a ${type}`)
        validator.includes(values, order, `Unsupported sort order "${order}" for "${prop}". ` +
          `Supported orders are "${values.join('", "')}".`)

        query.orderBy(prop, order)
      })

      return value(req, res, next)
    }

    return descriptor
  }
}
