import React, { useCallback, useMemo, useRef, useState } from 'react'
import { render } from 'react-dom'
import { AgGridReact } from '@ag-grid-community/react'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import {
  CheckboxSelectionCallbackParams,
  ColDef,
  ColGroupDef,
  FirstDataRenderedEvent,
  Grid,
  GridOptions,
  GridReadyEvent,
} from '@ag-grid-community/core'
import { IOlympicData } from './interfaces'
import { ModuleRegistry } from '@ag-grid-community/core'
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([ClientSideRowModelModule])

const SeriesSelectionGrid = () => {
  const gridRef = useRef<AgGridReact<IOlympicData>>(null)
  const containerStyle = useMemo(() => ({ width: '100%', height: '200px' }), [])
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), [])
  const [rowData, setRowData] = useState<IOlympicData[]>()
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      field: 'TagName',
      headerCheckboxSelection: true,
      checkboxSelection: (params: CheckboxSelectionCallbackParams<IOlympicData>) => {
        return !!params.data && params.data.year === 2012
      },
      showDisabledCheckboxes: true,
    },
    { field: 'Unit' },
    { field: 'min' },
    { field: 'max' },
    { field: 'avg' },
  ])
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
    }
  }, [])

  const onGridReady = useCallback((params: GridReadyEvent) => {
    // fetch('https://www.ag-grid.com/example-assets/small-olympic-winners.json')
    //   .then((resp) => resp.json())
    //   .then((data: IOlympicData[]) => setRowData(data))
    // setRowData(data)
  }, [])

  const onFirstDataRendered = useCallback((params: FirstDataRenderedEvent<IOlympicData>) => {
    gridRef.current!.api.forEachNode((node: any) => node.setSelected(!!node.data && node.data.year !== 2012))
  }, [])

  return (
    <div style={containerStyle}>
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact<IOlympicData>
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={'multiple'}
          suppressRowClickSelection={true}
          onGridReady={onGridReady}
          onFirstDataRendered={onFirstDataRendered}
        ></AgGridReact>
      </div>
    </div>
  )
}

export default SeriesSelectionGrid
