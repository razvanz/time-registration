function oauth2Interceptor ($q, $rootScope, OAuth2Token) {
  return {
    request: function (config) {
      config.headers = config.headers || {}

      // Inject `Authorization` header.
      if (!config.headers.hasOwnProperty('Authorization') && OAuth2Token.getAuthorizationHeader()) {
        config.headers.Authorization = OAuth2Token.getAuthorizationHeader()
      }

      return config
    }
    // ,
    // responseError: function (error) {
    //   if (!error) return $q.reject(error)
    //
    //   // Remove token for `E_INVALID_REQUEST` and `E_INVALID_GRANT`.
    //   if (error.status === 400 && (['E_INVALID_REQUEST', 'E_INVALID_GRANT'].includes(error.code))) {
    //     OAuth2Token.removeToken()
    //     $rootScope.$emit('oauth2:error', error)
    //   }
    //
    //   // Catch `invalid_token` and `unauthorized` errors.
    //   // The token isn't removed here so it can be refreshed when the `invalid_token` error occurs.
    //   if (error.status === 401 && error.code === 'E_INVALID_TOKEN') {
    //     $rootScope.$emit('oauth2:error', error)
    //   }
    //
    //   return $q.reject(error)
    // }
  }
}

oauth2Interceptor.$inject = ['$q', '$rootScope', 'OAuth2Token']

export default oauth2Interceptor
