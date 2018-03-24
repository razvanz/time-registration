import _ from 'lodash'
import qs from 'qs'

function factory ($http) {
  class UsersDataSvc {
    constructor () {
      this.users = []

      this.query = null
    }

    list (query, saveState, returnRaw) {
      query = query || { id: '', name: '' }
      query.offset = query.offset || 0
      // query.size = query.size || 100
      query.size = query.size || 5
      const params = {
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

      return $http.get(`/user?${qs.stringify(params)}`)
        .then(res => {
          if (saveState) {
            this.data = res.data
            this.query = query
          }

          return returnRaw ? res : res.data
        })
    }
  }

  return new UsersDataSvc()
}

factory.$inject = ['$http']

export default factory
