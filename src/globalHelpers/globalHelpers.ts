const formatPart = (value: number) => (value < 10 ? '0' + value : value + '')

export const formatTime = (unformattedTime: number) => {
  if (unformattedTime < 60) return '00:' + formatPart(unformattedTime)
  else {
    const minutes = Math.floor(unformattedTime / 60)
    const seconds = unformattedTime % 60
    return formatPart(minutes) + ':' + formatPart(seconds)
  }
}
