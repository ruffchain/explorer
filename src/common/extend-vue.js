import Vue from 'vue'
import fecha from 'fecha'
import './global-data'

Vue.filter('dateformat', (date, format) => {
  if (!date) return '-'
  if (typeof date === 'string') {
    date = new Date(date)
  }
  return fecha.format(date, format)
})

Vue.filter('toLoaclString', date => {
  return new Date(date).toLocaleString()
})

Vue.filter('slice', (date, n) => {
  let res = ''
  try {
    res = date.toString().slice(n)
  } catch (e) {}
  return res
})

Vue.filter('ms', value => value * 1000)

Vue.filter('toKB', value => parseFloat(value) / 1024)

Vue.filter('toFixed', (value, n) => {
  if (value === 0) {
    return 0
  }
  return value.toFixed(n)
})

Vue.filter(
  'shortHash',
  hash => hash.slice(0, 12) + '...' + hash.slice(hash.length - 12, hash.length)
)
