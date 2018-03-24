import jwtDecode from 'jwt-decode'
import qs from 'qs'

function OAuth2Provider () {
  this.configure = (options) => {
    this.defaultConfig = {
      clientId: null,
      clientSecret: null,
      grantPath: '/oauth2/token',
      ...options
    }
  }

  this.$get = function ($q, $http, OAuth2Token) {
    class OAuth2 {
      constructor (config) {
        this.config = config
      }

      configure (options) {
        this.config = {
          clientId: null,
          clientSecret: null,
          grantPath: '/oauth2/token',
          ...options
        }
      }

      isAuthenticated () {
        return !!OAuth2Token.getToken()
      }

      getUser () {
        try {
          const token = OAuth2Token.getToken()
          const { user, scope } = jwtDecode(token.access_token)

          return $q.resolve({
            ...user,
            scope: `${scope}`.split(/\s/)
          })
        } catch (e) {
          const error = new Error('Please login to continue.')
          error.code = 'E_INVALID_TOKEN'

          return $q.reject(error)
        }
      }

      authenticate (data, options) {
        data = {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'password',
          ...data
        }
        options = {
          headers: {
            'Authorization': undefined,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          ...options
        }

        return $http.post(`${this.config.grantPath}`, qs.stringify(data), options)
          .then((res) => {
            OAuth2Token.setToken(res.data)

            return res
          })
      }

      refreshToken (data, options) {
        data = {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'refresh_token',
          ...data
        }
        options = {
          headers: {
            'Authorization': undefined,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          ...options
        }

        return $http.post(`${this.config.grantPath}`, qs.stringify(data), options)
          .then((res) => {
            OAuth2Token.setToken(res.data)

            return res
          })
          .catch(error => {
            if (error.code === 'E_INVALID_GRANT') {
              error.message = 'Your session has expired. Please login to continue.'
            }

            return $q.reject(error)
          })
          // .catch(error => {
          //   if (['E_INVALID_REQUEST', 'E_INVALID_GRANT'].error.code === )
          // })
      }

      revokeToken (data, options) {
        // const { access_token: accessToken, refresh_token: refreshToken } = OAuth2Token.getToken()
        //
        // data = {
        //   client_id: this.config.clientId,
        //   client_secret: this.config.clientSecret,
        //   token: refreshToken || accessToken,
        //   token_type_hint: refreshToken ? 'refresh_token' : 'access_token',
        //   ...data
        // }
        // options = {
        //   headers: {
        //     'Content-Type': 'application/x-www-form-urlencoded'
        //   },
        //   ...options
        // }
        //
        // return $http.post(this.config.revokePath, qs.stringify(data), options)
        //   .then((res) => {
        //     OAuth2Token.removeToken()
        //
        //     return res
        //   })

        return Promise.resolve(OAuth2Token.removeToken())
      }
    }

    return new OAuth2(this.defaultConfig)
  }

  this.$get.$inject = ['$q', '$http', 'OAuth2Token']
}

export default OAuth2Provider
