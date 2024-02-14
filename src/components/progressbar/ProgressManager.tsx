import React from 'react'
import { useRecoilState } from 'recoil'
import { ProgressState } from 'stores/progress'

const ProgressManager = (value: number) => {
  console.log('ProgressManager value:', value)

  //호출불가..!!
  // const [progressValue, setProgressValue] = useRecoilState(ProgressState)
  // return setProgressValue({ progress: Math.round(value), isLoading: value < 100 })
}

export default ProgressManager
