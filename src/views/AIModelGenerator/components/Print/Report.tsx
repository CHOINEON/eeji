import { Ref, forwardRef, useEffect } from 'react'

const Report = forwardRef((props: any, ref: Ref<HTMLDivElement>) => {
  useEffect(() => {
    console.log('Report props: ', props)
    console.log('ref: ', ref)
  }, [])

  return (
    <section ref={ref}>
      <h2>report</h2>
      {props.content}
    </section>
  )
})

export default Report
