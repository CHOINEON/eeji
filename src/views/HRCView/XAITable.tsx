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

const data: DataType[] = [
  {
    key: '1',
    name: 'Feature1',
    impact: 32,
  },
  {
    key: '2',
    name: 'Feature2',
    impact: 42,
  },
  {
    key: '3',
    name: 'Feature3',
    impact: 32,
  },
  {
    key: '4',
    name: 'Feature4',
    impact: 99,
  },
  {
    key: '5',
    name: 'Feature1',
    impact: 32,
  },
  {
    key: '6',
    name: 'Feature2',
    impact: 42,
  },
  {
    key: '7',
    name: 'Feature3',
    impact: 32,
  },
  {
    key: '8',
    name: 'Feature4',
    impact: 99,
  },
]

interface XAITableProps {
  xaiData?: XAIDataType
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

const XAITable = ({ xaiData }: XAITableProps) => {
  //차트에서 선택된 날짜에 예측기간이 더해진 날짜
  const [predDate, setPredDate] = useState('')

  //선택 가능한 모든 날짜
  const [allDates, setAllDates] = useState([])
  const [buttonValue, setButtonValue] = useState(0)

  const [tableData, setTableData] = useState([])
  const [description, setDescriptipn] = useState('')

  useEffect(() => {
    setPredDate(allDates[0])
  }, [allDates, predDate])

  useEffect(() => {
    // console.log('xai:', xaiData)

    //현재 날짜 기준 담긴 모든 데이터 날짜
    setAllDates(Object.keys(xaiData).slice(0, 7))
  }, [xaiData])

  useEffect(() => {
    //예측 날짜 바뀔때마다 테이블과 텍스트 변경함
    if (xaiData && predDate) {
      //사용자에게 보여줄 날짜는 predDate(배열 0번째 값이 디폴트)
      // setPredDate(Object.keys(xaiData).slice(0, 7)[buttonValue])
      const pred = Object.keys(xaiData).slice(0, 7)[buttonValue]

      //디스크립션
      setDescriptipn(xaiData[pred]?.xai_description) // Now this will work without error

      //테이블
      setTableData(formatArray(xaiData[pred]?.aggregated_xai))
    }
  }, [xaiData, buttonValue])

  function formatArray(arr: Array<Record<string, number>>): Array<{ key: string; name: string; impact: number }> {
    return arr.map((item, index) => {
      const [key, value] = Object.entries(item)[0] // 각 객체의 키와 값을 추출
      return {
        key: (index + 1).toString(), // 1부터 시작하는 key
        name: key, // Feature + index 값
        impact: Math.abs(value), // impact는 절대값으로
      }
    })
  }

  // rowSelection object indicates the need for row selection
  const rowSelection: TableProps<DataType>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
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
      <div>
        <div className="text-center">
          <div className="m-auto">
            <span className="mx-3">예측 기간</span>
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

        <div className="mt-3">
          <h2 className="text-center">HRC가격 변동 요인</h2>
          <Divider />
          <Table<DataType>
            size="small"
            rowSelection={{ type: 'radio', ...rowSelection }}
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: 5, pageSizeOptions: [10], position: ['bottomCenter'], showSizeChanger: false }}
          />
        </div>

        <div dangerouslySetInnerHTML={{ __html: description }} />
      </div>
    </>
  )
}

export default XAITable
