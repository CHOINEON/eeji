import React, { useEffect, useRef } from 'react'

const Test = () => {
  useEffect(() => {
    renderComplete()
  }, [])

  const aRef = useRef<HTMLAnchorElement>(null)

  const renderComplete = () => {
    // console.log('aRef.current:', aRef.current)

    aRef.current.addEventListener('onClick', () => {
      return alert('test')
    })
  }

  const handleClick = () => {
    alert('clicked')
  }

  return (
    <div>
      <a href="#" id="browse" ref={aRef}>
        <u>Browse</u>
      </a>{' '}
      <button title="test"></button>
    </div>
  )
}

export default Test
