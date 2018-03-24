import _ from 'lodash'
import moment from 'moment'

function TimeEntriesCtrl ($timeout, TimeEntriesDataSvc, toastr, timeEntries, user) {
  const today = new Date().toISOString()
  const newEntry = {
    user_id: user.id,
    start_ts: today,
    end_ts: moment(today).add(8, 'hours').toISOString(), // user prefered hours
    description: ''
  }

  this.dataSvc = TimeEntriesDataSvc
  this.user = user
  this.today = today
  this.filters = {
    from: null,
    to: null
  }

  this.resetNewEntry = () => {
    this.newEntry = _.cloneDeep(newEntry)
  }

  this.create = (entry) => {
    this.dataSvc.create(entry, true)
      .then(() => this.resetNewEntry())
      .catch(error => {
        if (error.status !== 500 && error.status !== 401) this.newEntryError = error.message
      })
      .finally(() => {
        $timeout(() => {
          this.newEntryError = ''
        }, 5000)
      })
  }

  this.delete = (id) => {
    this.dataSvc.delete(id, true)
      .catch(error => {
        if (error.status !== 500 && error.status !== 401) toastr.error(error.message)
      })
  }

  this.loadMoreData = () => {
    console.log('load more data')
    if (this.isLoadingMore) return

    this.isLoadingMore = true
    this.dataSvc.listMore()
      .finally(() => { this.isLoadingMore = false })
  }

  this.uiOnParamsChanged = (newParams) => {
    console.log('new params: ', newParams)
  }

  // this.entries = timeEntries
  console.log('TimeEntriesCtrl ', timeEntries)

  this.printFn = () => {
    console.log(this)
  }
}

TimeEntriesCtrl.$inject = ['$timeout', 'TimeEntriesDataSvc', 'toastr', 'timeEntries', 'user']

export default TimeEntriesCtrl
