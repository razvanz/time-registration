import _ from 'lodash'

function UsersCtrl (
  $scope,
  $timeout,
  $state,
  $stateParams,
  UsersDataSvc,
  toastr,
  user,
  users
) {
  this.user = user
  this.dataSvc = UsersDataSvc
  this.filters = { name: $stateParams.name }
  // utils
  this.roles = {
    'user': JSON.stringify(['user']),
    'manager': JSON.stringify(['user', 'manager']),
    'admin': JSON.stringify(['user', 'manager', 'admin'])
  }
  this.editMode = {}
  this.clone = _.cloneDeep

  this.resetNew = () => {
    this.newUser = {
      name: '',
      email: '',
      password: '',
      preferred_hours: 0,
      scope: ['user']
    }
  }

  /************************************************************************************************
   * Filtering
   ***********************************************************************************************/

  this.applyFilters = (filters) => {
    $state.go($state.current.name, {
      ...$stateParams,
      name: filters.name
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

  this.create = (user) => {
    const data = {
      name: user.name,
      email: user.email,
      password: user.password,
      preferred_hours: user.preferred_hours || 0,
      scope: user.scope
    }

    this.dataSvc.create(data, true)
      .then(() => {
        this.resetNew()
        $scope.newUserForm && $scope.newUserForm.$setPristine(true)
        toastr.success('The new user has been successfully created!')
      })
      .catch(error => {
        if (error.status === 500 || error.status === 401) return
        if (error.status === 409) {
          this.newEntryError = 'Email address is already in use.'
          return
        }

        this.newEntryError = error.message
      })
      .finally(() => {
        $timeout(() => {
          this.newEntryError = ''
        }, 5000)
      })
  }

  this.update = (id, user) => {
    const data = {
      name: user.name,
      email: user.email,
      preferred_hours: user.preferred_hours || 0,
      scope: user.scope
    }

    if (user.password !== true) {
      data.password = user.password
    }

    this.dataSvc.update(id, data, true)
      .then(() => {
        this.editMode[id] = false
        toastr.success('The entry has been successfully updated!')
      })
      .catch(error => {
        if (error.status === 500 || error.status === 401) return
        if (error.status === 409) {
          toastr.error('Email address is already in use. Please pick another one!')
          return
        }

        toastr.error(`Failed to update the entry. Server responded with ${error.message}!`)
      })
  }

  this.delete = (id) => {
    this.dataSvc.delete(id, true)
      .then(() => {
        toastr.warning('The user has been successfully deleted!')
      })
      .catch(error => {
        if (error.status === 500 || error.status === 401) return

        toastr.error(error.message)
      })
  }
}

UsersCtrl.$inject = [
  '$scope',
  '$timeout',
  '$state',
  '$stateParams',
  'UsersDataSvc',
  'toastr',
  'user',
  'users'
]

export default UsersCtrl
