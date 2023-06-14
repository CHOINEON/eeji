import React, { useEffect, useState } from 'react'
import { ListView } from '@syncfusion/ej2-lists'
import styled from '@emotion/styled'
import axios from 'axios'

const StyledTagListView = styled.div``

const TagListView = () => {
  const [rowData, setRowData] = useState<{ [key: string]: unknown }[]>()
  const groupData: { [key: string]: unknown }[] = [
    {
      text: 'Audi A4',
      id: '9bdb',
      category: 'Audi',
    },
    {
      text: 'Audi A5',
      id: '4589',
      category: 'Audi',
    },
  ]

  const grpListObj: ListView = new ListView({
    dataSource: rowData,
    fields: { groupBy: 'table_nm', child: 'name' },
  })

  useEffect(() => {
    fetchTaglistData()
    grpListObj.appendTo('#listview-grp')
  }, [])

  const fetchTaglistData = () => {
    axios
      .post(process.env.REACT_APP_API_SERVER_URL + '/api/tag/list', {
        com_id: localStorage.getItem('companyId'),
        search_type: 'all',
      })
      .then((response) => {
        // console.log('fetchTaglistData/process:', response)
        setRowData(response.data)
      })
      .catch((error) => error('Data Load Failed'))
  }

  return (
    <div id="group-list">
      <h4>Group List</h4>

      <div id="listview-grp"></div>
    </div>
  )
}

export default TagListView
