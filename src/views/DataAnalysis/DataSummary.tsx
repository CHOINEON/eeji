import React, { useEffect, useMemo, useState } from 'react'

// import Card from '@mui/material/Card'
// import CardActions from '@mui/material/CardActions'
// import CardContent from '@mui/material/CardContent'
import { Card } from 'antd'
import Button from '@mui/material/Button'
import { Box, Stack } from '@mui/material'
import Pagination from '@mui/material/Pagination'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'
import { AgGridReact } from 'ag-grid-react'
import { Typography } from 'antd'

const { Title } = Typography

const DataGrid = (props: any) => {
  const [rowData, setRowData] = useState([])
  const [columnDefs] = useState([
    { field: 'Tag', width: 160 },
    { field: 'Total', width: 80 },
    { field: 'Percent', width: 100 },
  ])

  useEffect(() => {
    setRowData(props.data)
  }, [props])

  return (
    <>
      <div className="ag-theme-alpine" style={{ height: 200, width: 340, margin: '10px' }}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
      </div>
    </>
  )
}

const DataSummary = (props: any) => {
  const [page, setPage] = React.useState(1)
  const [summaryData, setSummaryData] = useState([])
  const [count, setCount] = useState(1)
  const { data } = props

  useEffect(() => {
    // console.log('---summay:', data)
    if (data) setSummaryData(data)
  }, [data])

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const card = (param: any) => {
    return (
      <>
        <Box display="block">
          <Title level={5} style={{ color: '#002D65' }}>
            Data Summary
          </Title>
        </Box>
        <Box display="block">
          <div style={{ width: 410 }}>
            <div style={{ fontSize: 14 }} color="text.secondary">
              <p>파일명 : {param.name}</p>
              <p>
                행/열 : {param.rowCount}/{param.colCount}
              </p>
              <p>시작(일) : {param.startDate}</p>
              <p>종료(일) : {param.endDate}</p>
              {/* <div>
                결측치 : {param.value.missing.length === 0 ? '없음' : param.value.missing.length + '개'}
                {param.value.missing.length > 0 && <DataGrid data={param.value.missing}></DataGrid>}
              </div> */}
            </div>
          </div>
        </Box>
      </>
    )
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <div>
          {summaryData.length > 0 && (
            <>
              <Box>{page == 1 && card(summaryData[0])}</Box>
              <Box>{page == 2 && card(summaryData[1])}</Box>
              <Box>{page == 3 && card(summaryData[2])}</Box>
              <Stack alignItems="center" sx={{ mt: 3 }}>
                {count > 1 && <Pagination count={count} page={page} onChange={handleChange} />}
              </Stack>
            </>
          )}
        </div>

        {/* <Box m={1}>{page == 1 && card(data[page - 1])}</Box>
            <Box m={1}>{page == 2 && card(data[page - 1])}</Box>
            <Box m={1}>{page == 3 && card(data[page - 1])}</Box>
            <Pagination count={3} page={page} onChange={handleChange} style={{ float: 'right' }} /> */}
      </ThemeProvider>
    </>
  )
}

export default DataSummary
