import React from 'react'

interface IUseInterval {
  (callback: () => void, interval: number): void
}

export const UseInterval: IUseInterval = (callback: any, interval: any) => {
  const savedCallback = React.useRef<(() => void) | null>(null)

  React.useEffect(() => {
    savedCallback.current = callback
  })

  React.useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current()
      }
    }

    const id = setInterval(tick, interval)
    return () => clearInterval(id)
  }, [interval])
}

export default UseInterval
