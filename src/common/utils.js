import TimeAgo from 'javascript-time-ago'
import { canonical } from 'javascript-time-ago/gradation'
import zh from 'javascript-time-ago/locale/zh'
import en from 'javascript-time-ago/locale/en'
import Cookies from 'js-cookie'

TimeAgo.addLocale(zh)
TimeAgo.addLocale(en)

const ago = new TimeAgo('zh')
const enAgo = new TimeAgo('en')
const zhAgo = new TimeAgo('zh-CN')

export const timeAgo = time => ago.format(time, { gradation: canonical })

export let newTimeAgo = function (time) {
}

export function getCurrentLocale() {
  let locale = Cookies.get('locale') || 'zh-CN';
  return locale
}

export function updateNewTimeAgo() {
  let newago;
  let locale = Cookies.get('locale') || 'zh-CN';
  if (locale === 'en') {
    newago = enAgo;
  } else if (locale === 'zh-CN') {
    newago = zhAgo;
  } else {
    console.error('unrecognized locale ' + time)
  }
  newTimeAgo = function (time) {
    return newago.format(time, { gradation: canonical })
  }
}

export const delay = ms =>
  new Promise(resolve => window.setTimeout(resolve, ms))

export const isIntStr = str => Number.parseInt(str).toString() === str

export function downloadString(strContent, fileName) {
  const a = document.createElement('a')
  a.download = fileName
  var blob = new Blob([strContent])
  a.href = window.URL.createObjectURL(blob)
  document.body.appendChild(a)
  a.click()
  window.setTimeout(function () {
    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  }, 0)
}

export const copyText = text => {
  let targetId = '_hiddenCopyText_'
  let target = document.getElementById(targetId)
  if (!target) {
    target = document.createElement('textarea')
    target.style.position = 'absolute'
    target.style.left = '-9999px'
    target.style.top = '0'
    target.id = targetId
    document.body.appendChild(target)
  }
  target.textContent = text
  let currentFocus = document.activeElement
  target.focus()
  target.setSelectionRange(0, target.value.length)

  let succeed
  try {
    succeed = document.execCommand('copy')
  } catch (e) {
    succeed = false
  }
  if (currentFocus && typeof currentFocus.focus === 'function') {
    currentFocus.focus()
  }
  target.textContent = ''

  return succeed
}

export const ADDRESS_PREFIX = process.env.VUE_APP_ADDRESS_PREFIX

export const isValidAddressPrefix = address =>
  address.slice(0, ADDRESS_PREFIX.length) === ADDRESS_PREFIX

export const rmAddressPrefix = address => {
  if (isValidAddressPrefix(address))
    return address.slice(ADDRESS_PREFIX.length, address.length)
  return address
}
export const getStrDate = function (str){
  try {
    let date = new Date(str)
    return (
      date.getFullYear() +
      '-' +
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) +
      '-' +
      (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
      ' ' +
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
      ':' +
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    )
  } catch (e) {
    console.error(e)
    return ''
  }
}
export const  getStrHandled = function (bHandled){
  if (bHandled) {
    return 'Y'
  } else {
    return 'N'
  }
}
