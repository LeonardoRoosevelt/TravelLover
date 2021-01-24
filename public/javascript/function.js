module.exports = {
  monthFilter: (date) => {
    let unixTime = date.valueOf() / 1000
    let isoDate = new Date(unixTime * 1000)
    let monthFilter = isoDate.getMonth()

    return monthFilter
  },
  yearFilter: (date) => {
    let unixTime = date.valueOf() / 1000
    let isoDate = new Date(unixTime * 1000)
    let yearFilter = isoDate.getFullYear()

    return yearFilter
  },
}
