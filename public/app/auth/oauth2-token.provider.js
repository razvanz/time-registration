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

  this.$get = function ($localStorage, $sessionStorage) {
    class OAuth2Token {
      setToken (data) {
        $sessionStorage[config.name] = data.access_token
        $localStorage[config.name] = data.refresh_token

        return data
      }

      getToken () {
        return {
          access_token: $sessionStorage[config.name],
          refresh_token: $localStorage[config.name]
        }
      }

      getAuthorizationHeader () {
        const { access_token: accessToken } = this.getToken() || {}

        if (!accessToken) return

        return `${config.token_type} ${accessToken}`
      }

      removeToken () {
        delete $localStorage[config.name]
        delete $sessionStorage[config.name]
      }
    }

    return new OAuth2Token()
  }

  this.$get.$inject = ['$localStorage', '$sessionStorage']
}

export default OAuth2TokenProvider
