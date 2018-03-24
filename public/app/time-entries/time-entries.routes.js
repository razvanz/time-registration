function route ($stateProvider) {
  const routes = [{
    state: 'index.time_entries',
    config: {
      url: '/time-entries?{from}{to}',
      templateUrl: 'time-entries/time-entries.html',
      controllerAs: 'vm',
      controller: 'TimeEntriesCtrl',
      params: {
        from: { type: 'date' },
        to: { type: 'date' }
      },
      resolve: {
        timeEntries: [
          'user', '$stateParams', 'TimeEntriesDataSvc',
          (user, $stateParams, TimeEntriesDataSvc) => {
            return TimeEntriesDataSvc.list({
              from: $stateParams.from,
              to: $stateParams.to
            }, true)
          }
        ]
      }
    }
  }]

  for (let i = 0; i < routes.length; i++) {
    $stateProvider.state(routes[i].state, routes[i].config)
  }
}

route.$inject = ['$stateProvider']

export default route
