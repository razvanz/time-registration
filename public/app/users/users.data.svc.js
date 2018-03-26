import _ from 'lodash'
import qs from 'qs'

function factory ($q, $http) {
  class UsersDataSvc {
    constructor () {
      this.users = []

      this.query = null
    }

    parseQuery (query) {
      query = query || { id: '', name: '' }
      query.offset = query.offset || 0
      query.size = query.size || 100

      const params = {
        sort: { created_at: 'desc' },
        pagination: {
          offset: query.offset,
          size: query.size
        }
      }

      if (query.name) {
        params.filter = {
          ...(params.filter || {}),
          name: { 'like': `${query.name}%` }
        }
      }

      if (Array.isArray(query.id)) {
        params.filter = {
          ...(params.filter || {}),
          id: { 'in': _.uniq(query.id) }
        }
        // In this case allow bigger "pages"
        params.pagination.size = _.max([params.pagination.size, params.filter.id.in.length])
      } else if (query.id) {
        params.filter = {
          ...(params.filter || {}),
          id: { '=': query.id }
        }
      }

      return params
    }

    list (query, saveState, returnRaw) {
      return $http.get(`/user?${qs.stringify(this.parseQuery(query))}`)
        .then(res => {
          if (saveState) {
            this.query = { ...query, total: parseInt(res.headers('x-pagination-total'), 10) }
            this.data = res.data
          }

          return returnRaw ? res : res.data
        })
    }

    listMore () {
      const query = this.query && {
        ...this.query,
        offset: this.data.length
      }

      if (query.offset >= query.total) {
        return $q.resolve([])
      }

      return this.list(query, false, true)
        .then(res => {
          this.query = { ...query, total: parseInt(res.headers('x-pagination-total'), 10) }
          this.data = _.unionBy(this.data, res.data, 'id')

          return res.data
        })
    }

    load (id) {
      return $http.get(`/user/${id}`)
        .then(res => res.data)
    }

    create (data, saveState) {
      return $http.post(`/user`, data)
        .then(res => this.load(res.data.id))
        .then(user => {
          if (saveState) this.data.unshift(user)

          return user
        })
    }

    update (id, data, saveState) {
      return $http.put(`/user/${id}`, data)
        .then(res => this.load(res.data.id))
        .then(user => {
          if (saveState) {
            this.data.splice(_.findIndex(this.data, { id: user.id }), 1, user)
          }

          return user
        })
    }

    delete (id, saveState) {
      return $http.delete(`/user/${id}`)
        .then(res => {
          if (saveState) this.data.splice(_.findIndex(this.data, { id }), 1)

          return res.data
        })
    }
  }

  return new UsersDataSvc()
}

factory.$inject = ['$q', '$http']

export default factory
