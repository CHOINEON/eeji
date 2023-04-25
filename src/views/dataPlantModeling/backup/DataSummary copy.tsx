import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@chakra-ui/react'
import { List, ListItem, ListIcon, OrderedList, UnorderedList } from '@chakra-ui/react'
import { MdCheckCircle } from 'react-icons/md'

const DataSummary = (props: any) => {
  const { dataSource } = props

  const handleClick = () => {
    // onClickNext(2, true) // Move on to Tab 2
  }

  return (
    <>
      <div style={{ border: '1px solid grey' }}>
        {dataSource && (
          <List spacing={3}>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              파일명 : {dataSource.data}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              날짜 : {dataSource.date}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              행/열 : {dataSource.shape}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              결측치 :{dataSource.missing.length === 0 ? ' 없음' : dataSource.missing}
            </ListItem>
          </List>
        )}
      </div>

      {/* <div style={{ textAlign: 'right' }}>
        {' '}
        <Button colorScheme="teal" variant="ghost" onClick={handleClick}>
          NEXT
        </Button>
      </div> */}
    </>
  )
}

export default DataSummary
