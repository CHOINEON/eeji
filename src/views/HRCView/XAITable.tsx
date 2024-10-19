import { Radio, Table, TableColumnsType } from 'antd'

import { TableProps } from 'antd'

import { Divider } from 'antd'
import { useEffect, useState } from 'react'

interface DataType {
  key: React.Key
  name: string
  impact: number
}

const columns: TableColumnsType<DataType> = [
  {
    title: '변수 이름',
    dataIndex: 'name',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: '영향도',
    dataIndex: 'impact',
  },
]

interface XAITableProps {
  xaiData?: XAIDataType
  onChangeFeature?: (name: string) => void
}

// Update the XAIDataType to allow dynamic keys
type XAIDataType = {
  [key: string]: {
    aggregated_xai: Array<Record<string, number>>
    base_date: string
    base_value: number
    time_delta: number
    value_delta: number
    value: number
    xai_description: string
  }
}

const XAITable = ({ xaiData, onChangeFeature }: XAITableProps) => {
  const [buttonValue, setButtonValue] = useState(0)
  const [tableData, setTableData] = useState([])
  const [description, setDescriptipn] = useState('')

  useEffect(() => {
    //예측 날짜 바뀔때마다 테이블과 텍스트 변경함
    if (xaiData) {
      const pred = Object.keys(xaiData).slice(0, 7)[buttonValue]

      //디스크립션
      setDescriptipn(xaiData[pred]?.xai_description) // Now this will work without error

      //테이블
      setTableData(formatArray(xaiData[pred]?.aggregated_xai))
    }
  }, [xaiData, buttonValue])

  function formatArray(arr: Array<Record<string, number>>): Array<{ key: string; name: string; impact: number }> {
    return arr?.map((item, index) => {
      const [key, value] = Object.entries(item)[0] // 각 객체의 키와 값을 추출
      return {
        key: (index + 1).toString(), // 1부터 시작하는 key
        name: key, // Feature + index 값
        impact: value, // impact는 절대값으로
      }
    })
  }

  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
      onChangeFeature(selectedRows[0].name)
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  }

  const handleRadioClick = (args: any) => {
    setButtonValue(args.target.value)
  }

  return (
    <>
      <div className="m-3">
        <div className="text-center">
          <div className="m-auto">
            <p className="text-lg font-bold text-center m-2">예측 기간</p>
            <Radio.Group defaultValue="a" buttonStyle="solid" onChange={handleRadioClick} value={buttonValue}>
              <Radio.Button value={0}>1일</Radio.Button>
              <Radio.Button value={1}>7일</Radio.Button>
              <Radio.Button value={2}>30일</Radio.Button>
              <Radio.Button value={3}>60일</Radio.Button>
              <Radio.Button value={4}>90일</Radio.Button>
              <Radio.Button value={5}>120일</Radio.Button>
            </Radio.Group>
          </div>
        </div>
        <Divider />
        <div className="mt-3">
          <p className="text-lg font-bold text-center m-2">HRC가격 변동 요인</p>
          <Table<DataType>
            size="small"
            rowSelection={{ type: 'radio', ...rowSelection }}
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: 5, pageSizeOptions: [10], position: ['bottomCenter'], showSizeChanger: false }}
          />
        </div>

        <Divider />
        <div>
          <p className="text-lg font-bold text-center m-2">예측 설명</p>
          <div className="overflow-scroll h-[230px]" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      </div>
    </>
  )
}

export default XAITable
