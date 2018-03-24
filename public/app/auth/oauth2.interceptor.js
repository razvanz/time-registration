function oauth2Interceptor ($q, $rootScope, $log, $injector, OAuth2Token) {
  return {
    request: function (config) {
      config.headers = config.headers || {}

      if (!config.url.endsWith('.html')) {
        // Inject `Authorization` header for non-template calls.
        config.headers.Authorization = OAuth2Token.getAuthorizationHeader()
        $log.debug('set headers.authorization: ', config.headers.Authorization)
      }

      return config
    },
    responseError: function (res) {
      if (!res) return $q.reject(res)

      // Remove token for `E_INVALID_REQUEST` and `E_INVALID_GRANT`.
      if (res.status === 400 &&
        (['E_INVALID_REQUEST', 'E_INVALID_GRANT'].includes(res.data.code))) {
        const error = new Error(res.data.message)
        error.code = res.data.code
        error.status = res.status

        OAuth2Token.removeToken()
        $log.error('oauth2:error', res)
        $rootScope.$emit('oauth2:error', error)
      }

      // Catch `invalid_token` and `unauthorized` errors.
      // The token isn't removed here so it can be refreshed when the `invalid_token` error occurs.
      if (res.status === 401) {
        const $http = $injector.get('$http')
        const OAuth2 = $injector.get('OAuth2')
        const token = OAuth2Token.getToken()

        if (token && token.refresh_token) {
          $log.debug('access_token expired. Refresh token and retry.')
          // Refresh token and retry request
          return OAuth2.refreshToken({ refresh_token: token.refresh_token })
            .then(() => $http(res.config))
        }
      }

      return $q.reject(res)
    }
  }
}

oauth2Interceptor.$inject = ['$q', '$rootScope', '$log', '$injector', 'OAuth2Token']

export default oauth2Interceptor
