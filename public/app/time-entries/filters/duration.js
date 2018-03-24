import moment from 'moment'

function duration () {
  return (input, reference, unit) => {
    return moment(input).diff(moment(reference), unit, true)
  }
}

export default duration
