import angular from 'angular'
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
        const token = OAuth2Token.getToken()

        if (!token) {
          const error = new Error('Please login to continue.')
          error.code = 'E_INVALID_TOKEN'
          return $q.reject(error)
        } else if (token.access_token_expires_at < new Date().toISOString()) {
          return this.refreshToken({ refresh_token: token.refresh_token })
            .then(() => this.getUser())
        }

        const { user, scope } = jwtDecode(token.access_token)

        return $q.resolve({
          ...user,
          scope: `${scope}`.split(/\s/)
        })
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
        const {
          refresh_token: refreshToken,
          refresh_token_expires_at: refreshTokenExpiresAt
        } = OAuth2Token.getToken()

        if (refreshTokenExpiresAt < new Date().toISOString()) {
          const error = new Error('Your session has expired. Please login to continue.')
          error.code = 'E_INVALID_TOKEN'
          return $q.reject(error)
        }

        data = {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
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

      revokeToken (data, options) {
        const { access_token: accessToken, refresh_token: refreshToken } = OAuth2Token.getToken()

        data = angular.extend({
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          token: refreshToken || accessToken,
          token_type_hint: refreshToken ? 'refresh_token' : 'access_token'
        }, data)
        options = angular.extend({
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }, options)

        return $http.post(this.config.revokePath, qs.stringify(data), options)
          .then((res) => {
            OAuth2Token.removeToken()

            return res
          })
      }
    }

    return new OAuth2(this.defaultConfig)
  }

  this.$get.$inject = ['$q', '$http', 'OAuth2Token']
}

export default OAuth2Provider
