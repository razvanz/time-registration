import angular from 'angular'

function OAuth2TokenProvider () {
  var config = {
    name: 'oauth2-token',
    token_type: 'Bearer'
  }

  this.configure = function (params) {
    if (!(params instanceof Object)) {
      throw new TypeError('Invalid argument: `config` must be an `Object`.')
    }

    angular.extend(config, params)

    return config
  }

  this.$get = function ($localStorage) {
    class OAuth2Token {
      setToken (data) {
        $localStorage[config.name] = data

        return data
      }

      getToken () {
        return $localStorage[config.name]
      }

      getAuthorizationHeader () {
        const { access_token: accessToken } = this.getToken() || {}

        if (!accessToken) return

        return `${config.token_type} ${accessToken}`
      }

      removeToken () {
        return delete $localStorage[config.name]
      }
    }

    return new OAuth2Token()
  }

  this.$get.$inject = ['$localStorage']
}

export default OAuth2TokenProvider
