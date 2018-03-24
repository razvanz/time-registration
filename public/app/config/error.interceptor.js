function errorInterceptor ($q, $log, $injector) {
  return {
    responseError: (error) => {
      $log.error('http:error', error)

      switch (error.code) {
        case 'E_INTERNAL':
          const toastr = $injector.get('toastr')

          toastr.error('Our server is not responding. Please try again!' + (error.requestId
            ? '\n\nIf the problem persists, contact our support and provide the following code: ' +
              error.requestId
            : ''
          ))
          break
        default:
          break
      }

      return $q.reject(error)
    }
  }
}

errorInterceptor.$inject = ['$q', '$log', '$injector']

export default errorInterceptor
