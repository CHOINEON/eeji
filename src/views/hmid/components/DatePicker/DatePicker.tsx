/**
 * 생성 날짜 : 2023-07-04
 * 작업자 : 박윤희
 * 화면 : HMID Config
 * 설명 : DatePicker widget
 * 최종 수정 날짜 : 2023-07-04
 */

import React from 'react'
import { DatePicker } from 'antd'

interface DatePickerProps {
  PickDate: (e: any) => void
}

export const DatePickerWidget: React.FC<DatePickerProps> = (props: any) => {
  const { RangePicker } = DatePicker

  const ChangeDate = (e: any) => {
    const dateObj: any = new Object()
    dateObj.startDate = e[0].$d
    dateObj.endDate = e[1].$d

    props.PickDate(dateObj)
  }

  return (
    <>
      <RangePicker onChange={ChangeDate} />
    </>
  )
}

export default DatePickerWidget
