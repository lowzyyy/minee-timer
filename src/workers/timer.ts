import { one_minute, renderTimer, stepFrequency } from './helpers'

let timer: number
let remaining: number
let inMode: 'focus' | 'rest' = 'focus'
const times = { focus: 0, rest: 0 }
let cx: number, cy: number, r: number

const startFocus = () => {
  timer = setInterval(() => {
    if (remaining === 1) {
      clearInterval(timer)
      inMode = 'rest'
      startRest()
    } else {
      renderTimer(times.focus, --remaining, inMode, cx, cy, r)
    }
  }, 1000 / stepFrequency)
}

const startRest = () => {
  timer = setInterval(() => {
    if (remaining === times.rest) {
      clearInterval(timer)
      inMode = 'focus'
      startFocus()
    } else {
      renderTimer(times.rest, ++remaining, inMode, cx, cy, r)
    }
  }, 1000 / stepFrequency)
}

onmessage = (e: any) => {
  if (e.data.type && e.data.type === 'start') {
    times.focus = e.data.times.focus * stepFrequency * one_minute
    times.rest = e.data.times.rest * stepFrequency * one_minute
    remaining = e.data.remaining
    inMode = e.data.mode ?? inMode
    cx = e.data.cx
    cy = e.data.cy
    r = e.data.r
    if (inMode === 'focus') startFocus()
    if (inMode === 'rest') startRest()
  }
  if (e.data.type && e.data.type === 'stop') {
    clearInterval(timer)
  }
  if (e.data.type && e.data.type === 'reset') {
    clearInterval(timer)
  }
}
