import PropTypes from 'prop-types'
import { useEffect, useRef } from 'react'

const useResizeObserver = ({ callback, element }: any) => {
  const current = element && element.current
  const observer = useRef(null)

  useEffect(() => {
    if (observer && observer.current && current) {
      observer.current.unobserve(current)
    }

    const observe = () => {
      if (element && element.current && observer.current) {
        observer.current.observe(element.current)
      }
    }

    const resizeObserverOrPolyfill = ResizeObserver
    observer.current = new resizeObserverOrPolyfill(callback)
    observe()

    return () => {
      if (observer && observer.current && element && element.current) {
        observer.current.unobserve(element.current)
      }
    }
  }, [callback, current, element])
}

useResizeObserver.propTypes = {
  element: PropTypes.object,
  callback: PropTypes.func,
}

export default useResizeObserver
