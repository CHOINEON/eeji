import React, { useEffect, useMemo, useState } from 'react'
import { List, Select, Space } from 'antd'
import { Typography } from '@mui/material'
import axios from 'axios'
import { useRecoilState } from 'recoil'
import { dataSetStore } from 'views/DataAnalysis/store/atom'
const { Option } = Select

/**버그가 있어서 일단 사용안함 */
const DataFileSelect = (props: any) => {
  const { onSelect } = props
  const [options, setOptions] = useState([])
  const [fileList, setFileList] = useState([])
  const selectedDataset = useRecoilState(dataSetStore)

  useEffect(() => {
    //두번씩 일어남
    console.log('----ds selected:', selectedDataset)
    // fetchIncludedFileList()
  }, [selectedDataset])

  const fetchIncludedFileList = () => {
    axios
      .get(process.env.REACT_APP_API_SERVER_URL + '/api/dataset/file?ds_id=' + selectedDataset[0])
      .then((response) => {
        console.log('fetchTagList:', response)
        setFileList(response.data)
        //TODO: variable list 세팅(default)
      })
      .catch((error) => console.log('Fetch tag list failed(Descption box):', error))
  }

  const handleChange = (param: any) => {
    // onSelect(param)
    console.log('change:', param)
  }

  return (
    <div>
      {/* <Typography variant="subtitle2" gutterBottom marginLeft={1}>
        파일 선택
      </Typography> */}

      {/* <List
        size="small"
        // header={<div>Header</div>}
        // footer={<div>Footer</div>}
        bordered
        dataSource={fileList}
        renderItem={(item) => <List.Item>{item.name}</List.Item>}
      /> */}

      {/* {item.size}
                {item.start_date}
                {item.end_date} */}

      <Select defaultValue={fileList[0]} onChange={handleChange} style={{ width: 400 }}>
        {fileList.length > 0 &&
          fileList.map((item, idx) => (
            <Option value={item.name} key={idx} label={item.name}>
              <Space>
                <span role="img" aria-label="China">
                  {item.name}
                </span>
                /{item.size}/{item.start_date}/{item.end_date}
              </Space>
            </Option>
          ))}
      </Select>
    </div>
  )
}

export default DataFileSelect
