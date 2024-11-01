import React, { ReactNode, useRef, useState } from 'react'

interface ResizablePanelsProps {
  panel1: ReactNode
  panel2: ReactNode
  panel3: ReactNode
  panel4: ReactNode
}

const ResizablePanels: React.FC<ResizablePanelsProps> = ({ panel1, panel2, panel3, panel4 }) => {
  const [panel1Height, setPanel1Height] = useState(80) // 첫 번째 패널의 높이 (%)
  const [panel2Height, setPanel2Height] = useState(50) // 두 번째 패널의 높이 (%)
  const [leftPanelWidth, setLeftPanelWidth] = useState(70) // 좌측 패널의 너비 (%)
  const isResizingRow1 = useRef(false) // panel1과 panel3의 높이 조정 중인지 추적
  const isResizingRow2 = useRef(false) // panel2와 panel4의 높이 조정 중인지 추적
  const isResizingColumn = useRef(false) // 좌우 패널의 너비 조정 중인지 추적

  const handleMouseDownRow1 = () => {
    isResizingRow1.current = true
  }

  const handleMouseDownRow2 = () => {
    isResizingRow2.current = true
  }

  const handleMouseDownColumn = () => {
    isResizingColumn.current = true
  }

  const handleMouseUp = () => {
    isResizingRow1.current = false
    isResizingRow2.current = false
    isResizingColumn.current = false
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isResizingRow1.current) {
      const newHeight1 = (e.clientY / window.innerHeight) * 100
      if (newHeight1 > 10 && newHeight1 < 90) {
        setPanel1Height(newHeight1)
      }
    }

    if (isResizingRow2.current) {
      const newHeight2 = (e.clientY / window.innerHeight) * 100
      if (newHeight2 > 10 && newHeight2 < 90) {
        setPanel2Height(newHeight2)
      }
    }

    if (isResizingColumn.current) {
      const newLeftPanelWidth = (e.clientX / window.innerWidth) * 100
      if (newLeftPanelWidth > 10 && newLeftPanelWidth < 90) {
        setLeftPanelWidth(newLeftPanelWidth)
      }
    }
  }

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return (
    <div className="h-screen flex">
      {/* 좌측 패널 */}
      <div className="flex flex-col" style={{ width: `${leftPanelWidth}%` }}>
        {/* Panel 1 */}
        <div className="bg-white p-4 overflow-auto" style={{ height: `${panel1Height}%` }}>
          {panel1}
        </div>

        {/* 가로 Splitter (panel1과 panel3의 높이 조정) */}
        <div className="h-1 bg-gray-500 cursor-ns-resize" onMouseDown={handleMouseDownRow1} />

        {/* Panel 3 */}
        <div className="bg-yellow-300 p-4 overflow-auto" style={{ height: `${100 - panel1Height}%` }}>
          {panel3}
        </div>
      </div>

      {/* 세로 Splitter (좌우 패널 너비 조정) */}
      <div className="w-1 bg-gray-500 cursor-ew-resize" onMouseDown={handleMouseDownColumn} />

      {/* 우측 패널 */}
      <div className="flex flex-col flex-grow">
        {/* Panel 2 */}
        <div className="bg-white p-4 overflow-auto" style={{ height: `${panel2Height}%` }}>
          {panel2}
        </div>

        {/* 가로 Splitter (panel2와 panel4의 높이 조정) */}
        <div className="h-1 bg-gray-500 cursor-ns-resize" onMouseDown={handleMouseDownRow2} />

        {/* Panel 4 */}
        <div className="bg-red-300 p-4 overflow-auto" style={{ height: `${100 - panel2Height}%` }}>
          {panel4}
        </div>
      </div>
    </div>
  )
}

export default ResizablePanels
