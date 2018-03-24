function RegisterCtrl ($state, DEFAULT_STATE, $http, OAuth2) {
  this.user = { name: '', email: '', password: '', scope: ['user'] }
  this.error = ''

  this.register = () => {
    const { user } = this

    $http.post('/user', user)
      .then(() => OAuth2.authenticate({ username: user.email, password: user.password }))
      .then(() => {
        $state.go(DEFAULT_STATE)
      })
      .catch(error => {
        if (error.status === 409) this.error = 'Email address already in use.'
        else if (error.status === 400) this.error = error.message
        else this.error = 'Internal server error. Please try again.' // TODO generic handler
      })
  }
}

RegisterCtrl.$inject = ['$state', 'DEFAULT_STATE', '$http', 'OAuth2']

export default RegisterCtrl
