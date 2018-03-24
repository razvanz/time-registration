function infiniteScroll ($debounce) {
  return {
    restrict: 'A',
    priority: 0,
    scope: {
      cb: '&trInfiniteScroll',
      debounce: '@trInfiniteScrollDebounce',
      coeficient: '@trInfiniteScrollCoeficient'
    },
    link: function (scope, elem) {
      const debounceTime = parseInt(scope.debounce, 10) || 1000
      const coeficient = parseFloat(scope.coeficient) || 1
      const el = elem[0] || elem
      const callback = $debounce(debounceTime, val => scope.cb())
      const handler = function () {
        const scrolledCoeficient = el.scrollTop / (el.scrollHeight - el.clientHeight)
        if (scrolledCoeficient >= coeficient) callback(scrolledCoeficient)
      }

      elem.on('scroll', handler)

      scope.$on('$destroy', () => {
        elem.off('scroll', handler)
      })
    }
  }
}

infiniteScroll.$inject = ['debounce']

export default infiniteScroll
