import React, { forwardRef, useEffect } from 'react'
import ReactToPrint from 'react-to-print'

interface Props {
  content: any
}

const ComponentToPrint = forwardRef<HTMLDivElement, Props>((props, ref) => {
  useEffect(() => {
    console.log(props)
    console.log(ref)
  }, [])

  return (
    <div ref={ref}>
      ComponentToPrint
      {props.content}
    </div>
  )
})

export default ComponentToPrint
