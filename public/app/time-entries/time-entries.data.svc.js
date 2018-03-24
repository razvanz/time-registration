import _ from 'lodash'
import qs from 'qs'

function factory ($q, $http, UsersDataSvc) {
  class TimeEntriesDataSvc {
    constructor () {
      this.data = []

      this.query = null
    }

    list (query, saveState, returnRaw) {
      query = query || { from: '', to: '' }
      query.offset = query.offset || 0
      // query.size = query.size || 100
      query.size = query.size || 5

      const params = {
        sort: {
          start_ts: 'desc'
        },
        pagination: {
          offset: query.offset,
          size: query.size
        }
      }

      if (query.from) {
        params.filter = {
          ...(params.filter || {}),
          start_ts: {
            ...((params.filter && params.filter.start_ts) || {}),
            '>': query.from
          }
        }
      }

      if (query.to) {
        params.filter = {
          ...(params.filter || {}),
          start_ts: {
            ...((params.filter && params.filter.start_ts) || {}),
            '<': query.to
          }
        }
      }

      return $http.get(`/time-entry?${qs.stringify(params)}`)
        .then(populateUser)
        .then(res => {
          if (saveState) {
            this.data = res.data
            this.query = query
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
      return $http.get(`/time-entry/${id}`)
        .then(populateUser)
        .then(res => res.data)
    }

    create (data, saveState) {
      return $http.post(`/time-entry`, data)
        .then(res => this.load(res.data.id))
        .then(user => {
          if (saveState) this.data.unshift(user)

          return user
        })
    }

    delete (id, saveState) {
      return $http.delete(`/time-entry/${id}`)
        .then(res => {
          if (saveState) this.data.splice(_.findIndex(this.data, { id }), 1)

          return res.data
        })
    }
  }

  function populateUser (res) {
    const userIds = _.uniq(_.map(Array.isArray(res.data) ? res.data : [res.data], 'user_id'))

    return UsersDataSvc.list({ id: userIds }, false)
      .then((users) => {
        const userMap = _.keyBy(users, 'id')

        return {
          ...res,
          data: Array.isArray(res.data)
            ? _.map(res.data, entry => ({ ...entry, user: userMap[entry.user_id] }))
            : { ...res.data, user: userMap[res.data.user_id] }
        }
      })
  }

  return new TimeEntriesDataSvc()
}

factory.$inject = ['$q', '$http', 'UsersDataSvc']

export default factory
