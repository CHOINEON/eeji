import ResizablePanels from './ResizablePanels'
import VisualPanel from './VisualPanel'

const Main = () => {
  return (
    <ResizablePanels
      panel1={<VisualPanel />}
      panel2={
        <div>
          <h1 className="text-xl font-bold">Panel 2</h1>
          <p>This is the content of Panel 2.</p>
        </div>
      }
      panel3={
        <div>
          <h1 className="text-xl font-bold">Panel 3</h1>
          <p>This is the content of Panel 3.</p>
        </div>
      }
      panel4={
        <div>
          <h1 className="text-xl font-bold">Panel 4</h1>
          <p>This is the content of Panel 4.</p>
        </div>
      }
    />
  )
}

export default Main
