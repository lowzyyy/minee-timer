export const stepFrequency = 4
export const one_minute = 60

// timer variables
// export const r = 100

// export const biggerCircleOffset = r / 2.2

// const timerBox = 2 * r + 2 * biggerCircleOffset + 10
// export const heightTimer = timerBox
// export const widthTimer = timerBox

// export const cx = widthTimer / 2
// export const cy = heightTimer / 2

// //little circles variables
// export const rSmall = r / 14

// const smallOffset = r + biggerCircleOffset / 2
// export const cxU = cx
// export const cyU = cy - smallOffset

// export const cxL = cx - smallOffset
// export const cyL = cy

// export const cxR = cx + smallOffset
// export const cyR = cy

// export const cxD = cx
// export const cyD = cy + smallOffset

export const getTimerParameters = (screenWidth: number) => {
  let r = 150
  if (screenWidth < 450) r = 110
  else if (screenWidth < 500) r = 130
  else if (screenWidth < 1000) r = 160
  else r = 200
  // timer variables
  const biggerCircleOffset = r / 2.2

  const timerBox = 2 * r + 2 * biggerCircleOffset + 10
  const heightTimer = timerBox
  const widthTimer = timerBox

  const cx = widthTimer / 2
  const cy = heightTimer / 2

  //little circles variables
  const rSmall = r / 14

  const smallOffset = r + biggerCircleOffset / 2
  const cxU = cx
  const cyU = cy - smallOffset

  const cxL = cx - smallOffset
  const cyL = cy

  const cxR = cx + smallOffset
  const cyR = cy

  const cxD = cx
  const cyD = cy + smallOffset

  return {
    cx,
    cy,
    r,
    rSmall,
    widthTimer,
    heightTimer,
    cxU,
    cyU,
    cxD,
    cyD,
    cxR,
    cyR,
    cxL,
    cyL,
    biggerCircleOffset
  }
}

export const renderTimer = (
  time: number,
  remaining: number,
  mode: 'focus' | 'rest',
  cx: number,
  cy: number,
  r: number
) => {
  const step = 360 / time

  const x = cx + r * Math.cos(toRadians(step * (time - remaining)))
  const y = cy + r * Math.sin(toRadians(step * (time - remaining)))

  postMessage([x, y, remaining, mode])
}

const toRadians = (degree: number) => {
  return (degree * Math.PI) / 180
}
