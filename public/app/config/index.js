import angular from 'angular'
import errorInterceptor from './error.interceptor'
import serializerInterceptor from './serializer.interceptor'

export default angular
  .module('tr.config', [])
  .value('DEFAULT_STATE', 'index.time_entries')
  .config(['$logProvider', ($logProvider) => {
    // enable or disable based on preference
    $logProvider.debugEnabled(true)
  }])
  .factory('errorInterceptor', errorInterceptor)
  .factory('serializerInterceptor', serializerInterceptor)
  .config(['$httpProvider', ($httpProvider) => {
    $httpProvider.interceptors.unshift('serializerInterceptor')
    $httpProvider.interceptors.unshift('errorInterceptor')
  }])
