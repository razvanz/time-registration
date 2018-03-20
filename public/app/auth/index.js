import angular from 'angular'
import oauth2Interceptor from './oauth2.interceptor'
import OAuth2Provider from './oauth2.provider'
import OAuth2TokenProvider from './oauth2-token.provider'

require('ngstorage')

export default angular
  .module('tr.auth', [
    'ngStorage'
  ])
  .provider('OAuth2Token', OAuth2TokenProvider)
  .provider('OAuth2', OAuth2Provider)
  .factory('oauth2Interceptor', oauth2Interceptor)
  .config(['$httpProvider', ($httpProvider) => {
    $httpProvider.interceptors.push('oauth2Interceptor')
  }])
