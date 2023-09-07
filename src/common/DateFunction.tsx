export function dateTimeToString(date: any) {
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()

  month = month >= 10 ? month : '0' + month
  day = day >= 10 ? day : '0' + day
  hour = hour >= 10 ? hour : '0' + hour
  minute = minute >= 10 ? minute : '0' + minute
  second = second >= 10 ? second : '0' + second

  return date.getFullYear() + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
}

export function getNowDateTime() {
  const now = new Date()
  const year = now.getFullYear()

  let month: any = now.getMonth() + 1
  if (month.toString().length === 1) month = '0' + month
  let date: any = now.getDate()
  if (date.toString().length === 1) date = '0' + date
  let hour: any = now.getHours()
  if (hour.toString().length === 1) hour = '0' + hour
  let minutes: any = now.getMinutes()
  if (minutes.toString().length === 1) minutes = '0' + minutes
  let seconds: any = now.getSeconds()
  if (seconds.toString().length === 1) seconds = '0' + seconds

  return year + month + date + hour + minutes + seconds
}

export function removeSeparator(date: string) {
  if (date.length === 19) {
    return date.replace('T', ' ')
  } else {
    return date
  }
}
