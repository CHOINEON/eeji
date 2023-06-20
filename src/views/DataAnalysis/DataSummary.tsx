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
    { field: 'Tag', width: 100 },
    { field: 'Total', width: 100 },
    { field: 'Percent', width: 140 },
  ])

  useEffect(() => {
    setRowData(props.data)
  }, [props])

  return (
    <>
      <div className="ag-theme-alpine" style={{ height: 200, width: 360, margin: '10px' }}>
        <AgGridReact rowData={rowData} columnDefs={columnDefs}></AgGridReact>
      </div>
    </>
  )
}

const DataSummary = (props: any) => {
  const [page, setPage] = React.useState(1)
  const [data, setData] = useState([])
  const [count, setCount] = useState(1)
  const { dataSource } = props

  useEffect(() => {
    // console.log('---summay:', dataSource)
    setCount(dataSource.length)

    const tempArray = []
    for (let i = 0; i < dataSource.length; i++) {
      tempArray.push({ index: i, value: dataSource[i] })
    }
    setData(tempArray)
  }, [dataSource])

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const card = (param: any) => {
    return (
      <>
        <Box display="block">
          <Title level={3} style={{ color: '#002D65' }}>
            Data Summary
          </Title>
        </Box>
        <Box display="block">
          <Card style={{ width: 400 }} className="rounded-box">
            <div style={{ fontSize: 14 }} color="text.secondary">
              <p>파일명 : {param.value.data}</p>
              <p>
                행/열 : {param.value.row_count}/{param.value.col_count}
              </p>
              <p>시작(일) : {param.value.startDate}</p>
              <p>종료(일) : {param.value.endDate}</p>
              <div>
                결측치 : {param.value.missing.length === 0 ? '없음' : param.value.missing.length + '개'}
                {param.value.missing.length > 0 && <DataGrid data={param.value.missing}></DataGrid>}
              </div>
            </div>
          </Card>
        </Box>
      </>
    )
  }
  return (
    <>
      <ThemeProvider theme={theme}>
        <div>
          {data.length > 0 && (
            <>
              <Box>{page == 1 && card(data[0])}</Box>
              <Box>{page == 2 && card(data[1])}</Box>
              <Box>{page == 3 && card(data[2])}</Box>
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
