import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '@chakra-ui/react'
import { List, ListItem, ListIcon, OrderedList, UnorderedList } from '@chakra-ui/react'
import { MdCheckCircle } from 'react-icons/md'

const DataInfoGrid = (props: any) => {
  const { dataInfo, onClickNext } = props

  const handleClick = () => {
    onClickNext(2, true) // Move on to Tab 2
  }

  return (
    <>
      {dataInfo && (
        <List spacing={3}>
          <ListItem>
            <ListIcon as={MdCheckCircle} color="green.500" />
            파일명 : {dataInfo.data}
          </ListItem>
          <ListItem>
            <ListIcon as={MdCheckCircle} color="green.500" />
            날짜 : {dataInfo.date}
          </ListItem>
          <ListItem>
            <ListIcon as={MdCheckCircle} color="green.500" />
            행/열 : {dataInfo.shape}
          </ListItem>
          <ListItem>
            <ListIcon as={MdCheckCircle} color="green.500" />
            결측치 :{dataInfo.missing.length === 0 ? ' 없음' : dataInfo.missing}
          </ListItem>
        </List>
      )}

      <div style={{ textAlign: 'right' }}>
        {' '}
        <Button colorScheme="teal" variant="ghost" onClick={handleClick}>
          NEXT
        </Button>
      </div>
    </>
  )
}

export default DataInfoGrid
