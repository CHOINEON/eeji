'use client'

import { useState } from 'react'
import Progressbar from './Progressbar'
import process_icon from 'assets/img/components/processing.svg'

const Page = () => {
  const [per, setPer] = useState(0)
  const [tmpPer, setTmpPer] = useState(5.5)
  const handleValue = (val: any) => {
    const value = Number(val.target.value)
    if (isNaN(value)) return

    if (value > 99) {
      setPer(100)
      setTmpPer(99)
    } else if (value < 5) {
      setPer(value)
      setTmpPer(5.5)
    } else {
      setPer(value)
      setTmpPer(value)
    }
  }

  return (
    <section className="h-screen">
      <div className="container p-5 h-full flex flex-col items-center">
        <div>
          <input
            type="text"
            pattern="[0-9]*"
            value={per}
            className="mb-6 w-[550px] bg-gray-50  text-gray-900 text-sm rounded-lg ring-offset-1 ring-2 focus:ring-[#4338F7] focus:outline-none block p-2.5"
            onChange={(val) => {
              handleValue(val)
            }}
          />
        </div>
        <div className="w-[550px] h-[28px] border border-[#4338F7] relative rounded-full overflow-hidden">
          <div
            style={{ width: `${tmpPer}%` }}
            className={`top-0 h-[22px] top-[2px] ml-[3px] bg-gradient-to-r from-[#4338F724] to-[#4338F79A] duration-700 transition-all relative rounded-full`}
          >
            <div className="absolute top-[1px] right-0">
              <img src={process_icon} alt="" className="max-w-[30px] max-h-[20px]" />
            </div>
          </div>
        </div>
        <div className="w-[550px] h-[28px]  relative  overflow-hidden mt-3">
          <Progressbar currentValue={tmpPer} maxValue={100} />
        </div>
      </div>
    </section>
  )
}

export default Page
