import React from 'react'
import { useRecoilCallback } from 'recoil'
import { ProgressState } from 'stores/progress'

const useProgress = () => {
  const setProgressValue = useRecoilCallback(({ set }) => (value: number) => {
    set(ProgressState, (prev) => ({ ...prev, progress: Math.round(value), isLoading: value < 100 }))
  })

  return { setProgressValue }
}

export default useProgress
