function errorInterceptor ($q, $log) {
  return {
    request: function (config) {
      config = config || {}
      config.headers = config.headers || {}

      // Inject `Content-Type` header.
      if (!config.headers.hasOwnProperty('Content-Type')) {
        config.headers['Content-Type'] = 'application/json'
      }

      // Inject `Accept` header.
      if (!config.headers.hasOwnProperty('Accept')) {
        config.headers['Accept'] = 'application/json'
      }

      return config
    },
    responseError: (res) => {
      if (!res) {
        res = {
          status: 500,
          headers: () => 'application/json',
          data: {}
        }
      }

      // Check content type
      if (!res.headers('Content-Type').includes('application/json')) {
        const error = new Error(`Unsupported content type: ${res.headers('Content-Type')}`)
        error.code = 'E_UNSUPPORTED_CONTENT_TYPE'
        return $q.reject(error)
      }

      const error = new Error(res.data.message || 'Internal error')
      error.code = res.data.code || 'E_INTERNAL'
      error.status = res.status || 500

      switch (error.code) {
        case 'E_INVALID_GRANT':
          error.message = 'Session has expired. Please login to continue.'
          break
        default:
          break
      }

      $log.error(error)
      return $q.reject(error)
    }
  }
}

errorInterceptor.$inject = ['$q', '$log']

export default errorInterceptor
