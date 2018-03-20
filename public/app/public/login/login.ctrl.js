function LoginCtrl ($state, $stateParams, OAuth2) {
  this.credentials = { username: '', password: '' }
  this.error = $stateParams.e
  this.redirect = $stateParams.redirect

  this.login = () => {
    const { credentials, redirect } = this

    OAuth2.authenticate(credentials)
      .then(() => {
        $state.go(redirect)
      })
      .catch(error => {
        if (error.status === 400) this.error = 'Invalid credentials'
      })
  }
}

LoginCtrl.$inject = ['$state', '$stateParams', 'OAuth2']

export default LoginCtrl
