import React, { useEffect, useMemo, useState } from 'react'
import { List, ListItem, ListIcon, OrderedList, UnorderedList } from '@chakra-ui/react'
import { MdCheckCircle } from 'react-icons/md'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Pagination from '@mui/material/Pagination'
import { Box } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'

const DataSummary = (props: any) => {
  const [page, setPage] = React.useState(1)
  const [data, setData] = useState([])
  const [count, setCount] = useState(1)
  const { dataSource } = props

  useEffect(() => {
    setCount(dataSource.length)

    const tempArray = []
    for (let i = 0; i < dataSource.length; i++) {
      tempArray.push({ index: i, value: dataSource[i] })
    }
    setData(tempArray)
  }, [dataSource])

  const handleClick = () => {
    // onClickNext(2, true) // Move on to Tab 2
  }
  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
  }

  const card = (param: any) => {
    console.log(param)
    return (
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            <p>파일명 : {param.value.data}</p>
            <p>행/열: {param.value.shape}</p>
            <p>{param.value.date}</p>
            <p>결측치 : {param.value.missing.length === 0 ? '없음' : param.value.missing}</p>
          </Typography>
          <Typography variant="body2"></Typography>
        </CardContent>
        {/* <CardActions>
          <Button size="small">View details</Button>
        </CardActions> */}
      </Card>
    )
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <div>
          {data.length > 0 && (
            <>
              <Box m={1}>{page == 1 && card(data[0])}</Box>
              <Box m={1}>{page == 2 && card(data[1])}</Box>
              <Box m={1}>{page == 3 && card(data[2])}</Box>

              <Pagination count={count} page={page} onChange={handleChange} />
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
