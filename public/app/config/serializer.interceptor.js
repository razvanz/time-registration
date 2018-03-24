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
      $log.debug('http:serializer:error', res)

      if (!res) {
        res = {
          status: 500,
          headers: () => 'application/json',
          data: {}
        }
      } else if (res instanceof Error) {
        // retrying in an error interceptor will have already gone through the interceptors flow
        return $q.reject(res)
      }

      // Check content type
      if (!res.headers('Content-Type').includes('application/json')) {
        const error = new Error(`Unsupported content type: ${res.headers('Content-Type')}`)
        error.code = 'E_UNSUPPORTED_CONTENT_TYPE'
        return $q.reject(error)
      }

      const error = new Error(res.data.message || 'Internal server error')
      error.code = res.data.code || 'E_INTERNAL'
      error.status = res.status || 500
      error.requestId = res.headers('x-request-id')

      return $q.reject(error)
    }
  }
}

errorInterceptor.$inject = ['$q', '$log']

export default errorInterceptor
