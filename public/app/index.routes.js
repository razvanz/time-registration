function route ($stateProvider, $urlRouterProvider) {
  const routes = [{
    state: 'index',
    config: {
      url: '',
      abstract: true,
      templateUrl: 'index.html',
      controllerAs: 'vm',
      controller: ['user', 'OAuth2', '$state', function (user, OAuth2, $state) {
        this.user = user
        this.logout = function () {
          OAuth2.revokeToken()
            .then(() => { $state.go('login') })
        }
      }],
      resolve: {
        user: ['OAuth2', (OAuth2) => {
          return OAuth2.getUser()
        }]
      }
    }
  }]

  for (let i = 0; i < routes.length; i++) {
    $stateProvider.state(routes[i].state, routes[i].config)
  }

  $urlRouterProvider.when('', '/time-entries')
}

route.$inject = ['$stateProvider', '$urlRouterProvider']

export default route
