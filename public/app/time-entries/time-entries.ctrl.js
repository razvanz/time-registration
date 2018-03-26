import _ from 'lodash'
import moment from 'moment'
import qs from 'qs'

function TimeEntriesCtrl (
  $location,
  $scope,
  $timeout,
  $state,
  $stateParams,
  OAuth2,
  OAuth2Token,
  TimeEntriesDataSvc,
  UsersDataSvc,
  toastr,
  timeEntries,
  user
) {
  const today = moment().toISOString()

  this.today = today
  this.user = user
  this.dataSvc = TimeEntriesDataSvc
  this.userMap = {} // build by $scope.$watchCollection
  this.filters = {
    from: ($stateParams.from && moment($stateParams.from).toISOString()),
    to: ($stateParams.to && moment($stateParams.to).toISOString())
  }
  // utils
  this.editMode = {}
  this.clone = _.cloneDeep

  this.resetNewEntry = () => {
    this.newEntry = {
      user: _.cloneDeep(user),
      user_id: user.id,
      start_ts: today,
      end_ts: moment(today).add(user.preferred_hours || 8, 'hours').toISOString(),
      description: []
    }
  }

  this.searchUsers = (str) => {
    return UsersDataSvc.list({ name: str })
      .then((data) => {
        return data
      })
  }

  /************************************************************************************************
   * Filtering
   ***********************************************************************************************/

  this.applyFilters = (filters) => {
    const reverse = moment.utc(filters.from).isAfter(moment.utc(filters.to))
    const params = {
      ...$stateParams,
      from: moment(reverse ? filters.to : filters.from)
        .add(moment().utcOffset(), 'minutes') // Fix UI-Router assumes local date
        .toISOString(),
      to: moment(reverse ? filters.from : filters.to)
        .endOf('day')
        .add(moment().utcOffset(), 'minutes') // Fix UI-Router assumes local date
        .toISOString()
    }

    $state.go($state.current.name, params)
  }

  this.export = () => {
    return OAuth2.refreshToken(_.pick(OAuth2Token.getToken(), 'refresh_token'))
      .then(() => {
        const query = this.dataSvc.parseQuery(this.dataSvc.query)
        const params = {
          access_token: _.get(OAuth2Token.getToken(), 'access_token'),
          sort: query.sort,
          filter: query.filter,
          tz: moment().utcOffset(),
          pagination: {
            offset: 0,
            size: this.dataSvc.query.total || 100
          }
        }

        const hostname = `${$location.protocol()}://${$location.host()}:${$location.port()}`
        const url = `${hostname}/time-entry?${qs.stringify(params)}`
        window.open(url, '_blank').focus()
      })
  }

  /************************************************************************************************
   * Data actions
   ***********************************************************************************************/

  this.loadMoreData = () => {
    if (this.isLoadingMore) return

    this.isLoadingMore = true
    this.dataSvc.listMore()
      .finally(() => { this.isLoadingMore = false })
  }

  this.create = (entry) => {
    const data = _.pick(entry, ['user_id', 'start_ts', 'end_ts', 'description'])

    this.dataSvc.create(data, true)
      .then(() => {
        this.resetNewEntry()
        $scope.newEntryForm.$setPristine(true)
        toastr.success('The new entry has been successfully booked!')
      })
      .catch(error => {
        if (error.status === 500 || error.status === 401) return

        this.newEntryError = error.message
      })
      .finally(() => {
        $timeout(() => {
          this.newEntryError = ''
        }, 5000)
      })
  }

  this.update = (id, entry) => {
    const data = _.pick(entry, ['user_id', 'start_ts', 'end_ts', 'description'])

    this.dataSvc.update(id, data, true)
      .then(() => {
        this.editMode[id] = false
        toastr.success('The entry has been successfully updated!')
      })
      .catch(error => {
        if (error.status === 500 || error.status === 401) return

        toastr.error('Failed to update the entry. Please check for errors and try again!')
      })
  }

  this.delete = (id) => {
    this.dataSvc.delete(id, true)
      .then(() => {
        toastr.warning('The entry has been successfully deleted!')
      })
      .catch(error => {
        if (error.status === 500 || error.status === 401) return

        toastr.error(error.message)
      })
  }

  /************************************************************************************************
   * Watchers
   ***********************************************************************************************/

  $scope.$watchCollection(() => this.dataSvc.data, (newVal) => {
    this.userMap = _.keyBy(_.map(newVal, 'user'), 'id') // build user map
  })
}

TimeEntriesCtrl.$inject = [
  '$location',
  '$scope',
  '$timeout',
  '$state',
  '$stateParams',
  'OAuth2',
  'OAuth2Token',
  'TimeEntriesDataSvc',
  'UsersDataSvc',
  'toastr',
  'timeEntries',
  'user'
]

export default TimeEntriesCtrl
