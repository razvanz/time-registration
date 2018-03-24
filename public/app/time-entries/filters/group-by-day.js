import _ from 'lodash'
import moment from 'moment'

function groupByDay () {
  // https://stackoverflow.com/questions/16507040/angular-filter-works-but-causes-10-digest-iterations-reached
  return _.memoize(
    (input, prop) => _.groupBy(input, v => moment(_.get(v, prop)).format('YYYY-MM-DDT00:00:00.000\\Z')),
    (input) => JSON.stringify(input)
  )
}

export default groupByDay
