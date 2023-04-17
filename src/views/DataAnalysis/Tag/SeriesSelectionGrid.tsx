import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { render } from 'react-dom'
import { AgGridReact } from '@ag-grid-community/react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import { CheckboxSelectionCallbackParams, ColDef } from '@ag-grid-community/core'
import { ModuleRegistry } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import axios from 'axios'

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([ClientSideRowModelModule])

const SeriesSelectionGrid = (props: any) => {
  const { selectedTags } = props

  const gridRef = useRef<AgGridReact<any>>(null)
  const containerStyle = useMemo(() => ({ width: '100%', height: '200px' }), [])
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
  const [rowData, setRowData] = useState<any[]>()
  const [statistic, setStatistic] = React.useState([])
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: 'tagName',
      headerCheckboxSelection: true,
      checkboxSelection: (params: CheckboxSelectionCallbackParams<any>) => {
        return !!params.data && params.data.year === 2012
      },
      showDisabledCheckboxes: true,
    },
    { field: 'min' },
    { field: 'max' },
    { field: 'avg' },
  ])

  useEffect(() => {
    //한번에 불러서 배열에서 찾게 바꾸기(arr.find())
    const fetchStatistic = () => {
      // console.log('selectedTags:', selectedTags)
      axios.post('http://220.94.157.27:59871/api/tag/describe', selectedTags).then(
        (response: any) => {
          // console.log('response:', response)
          setStatistic(response.data)
        },
        (error) => {
          console.log('error:', error)
        }
      )
    }
    fetchStatistic()
  }, [selectedTags])

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    }
  }, [])

  // const onGridReady = useCallback((params: GridReadyEvent) => {
  //   // fetch('https://www.ag-grid.com/example-assets/small-olympic-winners.json')
  //   //   .then((resp) => resp.json())
  //   //   .then((data: IOlympicData[]) => setRowData(data))
  //   // setRowData(data)
  // }, [])

  // const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent<any>) => {
  //   gridRef.current!.api.forEachNode((node: any) => node.setSelected(!!node.data && node.data.year !== 2012))
  // }, [])

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact<any>
          ref={gridRef}
          rowData={statistic}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={'multiple'}
          suppressRowClickSelection={true}
          // onGridReady={onGridReady}
          // onFirstDataRendered={onFirstDataRendered}
        ></AgGridReact>
      </div>
    </div>
  )
}

export default SeriesSelectionGrid
