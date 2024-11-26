import React from 'react'

const PanelWrapper = ({ panel1, panel2 }: { panel1: React.ReactNode; panel2: React.ReactNode }) => {
  return (
    <div className="flex">
      <div className="bg-[#FFFFFF] w-[65%] min-h-[780px] p-5">{panel1}</div>
      <div className="bg-[#F3F7FE] w-[35%] min-h-[780px] p-5">{panel2}</div>
    </div>
  )
}

export default PanelWrapper
