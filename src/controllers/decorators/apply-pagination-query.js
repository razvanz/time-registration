const MAX_PAGE = 1000000000000000
const MAX_SIZE = 1000000

export default function applyPaginationQuery (target, key, descriptor) {
  let { value } = descriptor

  descriptor.value = (req, res, next) => {
    const {
      queryBuilder: query,
      locals: { validator },
      query: { pagination }
    } = req
    let { page, size } = pagination || { page: 1, size: 100 }

    // Validate page number
    validator.is('number', page,
      `Invalid page number value "${page}".`)
    validator.between(1, MAX_PAGE, parseInt(page, 10),
      `Page number must have a value between 1 - ${MAX_PAGE}`)

    // Validate page size
    validator.is('number', size,
      `Invalid page size value "${size}".`)
    validator.between(1, MAX_SIZE, parseInt(size, 10),
      `Page size must have a value between 1 - ${MAX_SIZE}`)

    query.offset((page - 1) * size).limit(size)

    res.set('x-pagination-page', `${page}`)
    res.set('x-pagination-size', `${size}`)

    return value(req, res, next)
  }

  return descriptor
}
