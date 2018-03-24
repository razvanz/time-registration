function route ($stateProvider) {
  const routes = [{
    state: 'login',
    config: {
      url: '/login',
      templateUrl: 'public/login/login.html',
      controllerAs: 'vm',
      controller: 'LoginCtrl',
      params: {
        e: { value: '', squash: true },
        redirect: { value: '' }
      },
      resolve: {
        user: ['$q', 'OAuth2', ($q, OAuth2) => {
          // If user is already logged in redirect him to home
          return OAuth2.getUser()
            .then(() => {
              const error = new Error('Already authenticated')
              error.code = 'E_AUTHENTICATED'
              return $q.reject(error)
            })
            .catch(error => {
              if (['E_INVALID_TOKEN', 'E_INVALID_GRANT'].includes(error.code)) {
                return $q.resolve()
              }

              return $q.reject(error)
            })
        }]
      }
    }
  }, {
    state: 'register',
    config: {
      url: '/register',
      templateUrl: 'public/register/register.html',
      controllerAs: 'vm',
      controller: 'RegisterCtrl'
    }
  }]

  for (let i = 0; i < routes.length; i++) {
    $stateProvider.state(routes[i].state, routes[i].config)
  }
}

route.$inject = ['$stateProvider']

export default route
