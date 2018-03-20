function route ($stateProvider, $urlRouterProvider) {
  const routes = [{
    state: 'index',
    config: {
      url: '/',
      // abstract: true,
      templateUrl: 'index.html',
      // controllerAs: 'index',
      // controller: 'IndexCtrl',
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

  $urlRouterProvider.when('', '/')
}

route.$inject = ['$stateProvider', '$urlRouterProvider']

export default route
