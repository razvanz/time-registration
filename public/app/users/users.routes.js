function route ($stateProvider) {
  const routes = [{
    state: 'index.users',
    config: {
      url: '/users?{name}',
      templateUrl: 'users/users.html',
      controllerAs: 'vm',
      controller: 'UsersCtrl',
      params: {
        name: { type: 'string' }
      },
      resolve: {
        users: [
          'user', '$stateParams', 'UsersDataSvc',
          (user, $stateParams, UsersDataSvc) => {
            return UsersDataSvc.list(
              $stateParams.name ? { name: `${$stateParams.name}%` } : {},
              true
            )
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
