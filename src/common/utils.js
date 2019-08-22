import TimeAgo from 'javascript-time-ago'
import { canonical } from 'javascript-time-ago/gradation'
import zh from 'javascript-time-ago/locale/zh'

TimeAgo.addLocale(zh)
const ago = new TimeAgo('zh')

export const timeAgo = time => ago.format(time, { gradation: canonical })

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
  window.setTimeout(function() {
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
