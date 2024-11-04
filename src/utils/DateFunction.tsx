export function isValidDatetimeFormat(data: any) {
  let isValid = false

  //step1. 정규식 체크
  // YYYY-MM-DD HH:MM:SS
  const regex1 =
    /\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):(0[1-9]|[0-5][0-9]):(0[1-9]|[0-5][0-9])$/

  // YYYY/MM/DD HH:MM:SS
  const regex2 =
    /\d{4}\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):(0[1-9]|[0-5][0-9]):(0[1-9]|[0-5][0-9])$/

  // MM/DD/YYYY HH:MM:SS
  const regex3 =
    /\^(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])\/d{4} (0[0-9]|1[0-9]|2[0-3]):(0[1-9]|[0-5][0-9]):(0[1-9]|[0-5][0-9])$/

  // DD/MM/YYYY HH:MM:SS
  const regex4 =
    /\^(0[1-9]|[12][0-9]|3[01]) \/(0[1-9]|1[012])\d{4} (0[0-9]|1[0-9]|2[0-3]):(0[1-9]|[0-5][0-9]):(0[1-9]|[0-5][0-9])$/

  //YYYY-MM-DD
  const regex5 = /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/

  //YYYY/MM/DD
  const regex6 = /^\d{4}\/(0[1-9]|1[012])\/(0[1-9]|[12][0-9]|3[01])$/

  const regexFormats = [regex1, regex2, regex3, regex4, regex5, regex6]

  for (let i = 0; i < regexFormats.length; i++) {
    isValid = regexFormats[i].test(data)
  }

  //step2. 입력받은 string을 날짜객체로 변환 가능해서 한번 더 확인
  const isValidDate = function (value: string) {
    const dValue = new Date(value)

    return dValue instanceof Date && isNaN(Date.parse(value)) === false
  }

  // console.log('isValidDate:', isValidDate(data))
  isValid = isValidDate(data)
  return isValid
}

export function formatTimestampToYYYYMMDD(timestamp: number) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

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

/**
 * signed_url의 expiration date를 확인해 현재 유효한지 확인
 * @param string 형식의 날짜
 * @param number GMT기준 로컬 시간과의 차이
 * @returns {boolean} 유효한지 여부. 유효하면 true, 유효하지 않으면 false
 */

export function validationCheck(date: string, timeOffset: number) {
  const expiration = new Date(date).getTime()
  const kstOffset = timeOffset * 60 * 60 * 1000
  const expiration_KST = expiration + kstOffset
  const now = new Date().getTime()

  if (expiration_KST > now) return true
  else return false
}
