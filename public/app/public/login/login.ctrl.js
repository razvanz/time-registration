function LoginCtrl ($state, $stateParams, OAuth2, DEFAULT_STATE) {
  this.credentials = { username: '', password: '' }
  this.error = $stateParams.e

  this.login = () => {
    const { credentials } = this
    const redirect = $stateParams.redirect && $stateParams.redirect.name
      ? $stateParams.redirect
      : DEFAULT_STATE

    OAuth2.authenticate(credentials)
      .then(() => { $state.go(redirect) })
      .catch(error => {
        if (error.status === 400) this.error = 'Invalid credentials'
      })
  }
}

LoginCtrl.$inject = ['$state', '$stateParams', 'OAuth2', 'DEFAULT_STATE']

export default LoginCtrl
