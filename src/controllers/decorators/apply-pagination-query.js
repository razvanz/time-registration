const MAX_PAGE = 1000000000000000
const MAX_OFFSET = 1000000000000000
const MAX_SIZE = 1000000

export default function applyPaginationQuery (target, key, descriptor) {
  let { value } = descriptor

  descriptor.value = async (req, res, next) => {
    const {
      queryBuilder: query,
      locals: { validator }
    } = req
    const pagination = req.query.pagination || {}

    validator.is('object', pagination, `Invalid pagination value "${pagination}".`)

    let { page, offset, size } = pagination

    if ('page' in pagination) {
      validator.is('integer', page, `Invalid pagination.page integer value "${page}".`)
      validator.between(1, MAX_PAGE, parseInt(page, 10),
        `pagination.page integer must have a value between 1 - ${MAX_PAGE}`)
    } else if ('offset' in pagination) {
      validator.is('integer', offset, `Invalid pagination.offset integer value "${offset}".`)
      validator.between(0, MAX_OFFSET, parseInt(offset, 10),
        `pagination.offset integer must have a value between 0 - ${MAX_OFFSET}`)
    } else {
      offset = 0
    }

    if ('size' in pagination) {
      validator.is('integer', size, `Invalid pagination.size value "${size}".`)
      validator.between(1, MAX_SIZE, parseInt(size, 10),
        `pagination.size must have a value between 1 - ${MAX_SIZE}`)
    } else {
      size = 100
    }

    const [{ total }] = await query.clone().count('id as total')
    res.set('x-pagination-total', `${total}`)
    res.set('x-pagination-size', `${size}`)

    if (page) {
      query.offset((page - 1) * size).limit(size)
      res.set('x-pagination-page', `${page}`)
    } else {
      query.offset(offset).limit(size)
      res.set('x-pagination-offset', `${offset}`)
    }

    return value(req, res, next)
  }

  return descriptor
}
