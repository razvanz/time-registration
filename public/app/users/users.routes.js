function route ($stateProvider) {
  const routes = []

  for (let i = 0; i < routes.length; i++) {
    $stateProvider.state(routes[i].state, routes[i].config)
  }
}

route.$inject = ['$stateProvider']

export default route
