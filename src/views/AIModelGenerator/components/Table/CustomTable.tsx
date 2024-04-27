import { UndoOutlined } from '@ant-design/icons'
import styled from '@emotion/styled'
import { Button, Select } from 'antd'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { filterWithConstraint, filteredResultState } from 'views/AIModelGenerator/store/response/atoms'

export interface IConstraint {
  data: string
  filterKey: string
  filterValue: number | string
}
export interface IStringKeyObject {
  [key: string]: string | number
}

const CustomTable = () => {
  const rowData: any = useRecoilValue(filteredResultState('row_data'))[0]
  const classList: any = useRecoilValue(filteredResultState('classes'))[0]
  const columns: any = useRecoilValue(filteredResultState('input'))[0]

  const [data, setData] = useState([])
  const [options, setOptions] = useState([])

  const [constraint, setConstraint] = useState(Array<IConstraint>)
  const filteredData: any = useRecoilValue(filterWithConstraint(constraint))
  const [selectValue, setSelectValue] = useState({ 실제: {}, 예측결과: {} })

  useEffect(() => {
    console.log('analysisResponse:', analysisResponse)
    console.log('columns:', columns)

    setData(rowData)
    // renderTable(analysisResponse[0].row_data)

    const newOption: Array<any> = []
    classList?.map((item: any, index: number) => {
      newOption.push({ value: item, label: item })
    })

    setOptions(newOption)
  }, [])

  useEffect(() => {
    console.log(filteredData)
    if (filteredData) setData(filteredData)
    else setData(rowData)
  }, [filteredData])

  // const renderTable = (dataObj: any) => {
  //   console.log('dataObj:', dataObj)
  //   Object.values(dataObj).map((item: any, idx:number) => {
  //     console.log('item:', item['실제']) // row 하나
  //     return (
  //       <div style={{ border: '1px solid blue' }}>
  //         <CellItem>{item['실제']}</CellItem>
  //         <CellItem>{item['실제']}</CellItem>
  //         <CellItem>{item['예측결과']}</CellItem>
  //         {columns.map((col: any, idx: number) => (
  //           <CellItem key={idx}>{item[col]}</CellItem>
  //         ))}
  //       </div>
  //     )
  //   })
  // }

  const handleChange = (selectedValue: any, filterKey: string) => {
    console.log('selectedValue:', selectedValue)

    setSelectValue({ ...selectValue, [filterKey]: { value: selectedValue, label: selectedValue } })

    setConstraint([
      ...constraint.filter((item: any) => item.filterKey !== filterKey),
      { data: 'row_data', filterKey: filterKey, filterValue: selectedValue },
    ])
  }

  const handleClearFilter = () => {
    setConstraint([])
    setSelectValue({ 실제: { label: '', value: '' }, 예측결과: { label: '', value: '' } })
  }

  return (
    <>
      <div className="mt-5 mb-7">
        <Title>데이터 필터링</Title>
        <div className="ml-1">
          <div className="mr-3 inline-block ">
            실제값 :{' '}
            <Select
              className="w-[120px]"
              placeholder="Select..."
              // defaultValue={options[0]?.value}
              value={selectValue['실제']}
              onChange={(e: any) => handleChange(e, '실제')}
              options={options}
            />
          </div>
          <div className="mr-3 inline-block">
            예측값 :{' '}
            <Select
              className="w-[120px]"
              placeholder="Select..."
              value={selectValue['예측결과']}
              // defaultValue={options[0]?.label}
              onChange={(e: any) => handleChange(e, '예측결과')}
              options={options}
            />
          </div>
          <Button type="text" icon={<UndoOutlined />} onClick={handleClearFilter}>
            Clear Filter
          </Button>
        </div>
      </div>

      <CustomTableContainer>
        <LabelContainer>
          <CellItem>인덱스</CellItem>
          <CellItem>실제</CellItem>
          <CellItem>예측결과</CellItem>
          {columns?.map((col: string, idx: number) => (
            <CellItem key={idx}>{col}</CellItem>
          ))}
        </LabelContainer>
        <>
          {data &&
            Object.values(data)?.map((item: IStringKeyObject, idx: number) => {
              return (
                <RowItem key={idx}>
                  <CellItem>{idx}</CellItem>
                  <CellItem>{item['실제']}</CellItem>
                  <CellItem>{item['예측결과']}</CellItem>
                  {columns?.map((col: string, idx: number) => (
                    <CellItem key={idx}>{item[col]}</CellItem>
                  ))}
                </RowItem>
              )
            })}
        </>
      </CustomTableContainer>
      <p>Total row count : {Object.keys(data).length}</p>
    </>
  )
}

export default CustomTable

const Title = styled.div`
  color: #002d65;
  font-family: 'Helvetica Neue';
  font-size: 17px;
  margin: 5px 3px;
  font-weight: bold;
`

const CustomTableContainer = styled.div`
  // background-color: pink;
  width: 68%;
  height: 540px;
  overflow: auto;
  white-space: nowrap;
  padding: 0 5px;
  overflow-y: scroll;
  overflow-x: scroll;
  overflow: -moz-scrollbars-horizontal;
  overflow: -moz-scrollbars-vertical;

  &::-webkit-scrollbar {
    background: #332bbf;
    border-radius: 30%; //width가 너무 작아서 안보임..
    width: 4px;
    height: 4px;
    display: flex;
    overflow: auto;
  }
  &::-webkit-scrollbar-thumb {
    background: #332bbf;
    border-radius: 10%;
  }

  &::-webkit-scrollbar-track {
    background: #d5dcef;
    border-radius: 10%;
  }
`

const RowItem = styled.div`
  display: inline-block;
  width: 100%;
  float: left;
  height: 45px;
  border: 1px solid #d5dcef;
  border-radius: 10px;
  background-color: #f6f8ff;
  color: #002d65;
  margin-bottom: 10px;
`

const LabelContainer = styled.div`
  width: 100%;
  // border: 1px solid red;
  height: 40px;
  line-height: 30px;
  // margin-bottom: 10px;
  display: block;
  float: left;
  white-space: nowrap;
  overflow: scroll-x;
`

const CellItem = styled.div`
  // border: 1px solid lightblue;
  width: 100px;
  height: 45px;
  font-family: 'Helvetica Neue';
  font-size: 14px;
  display: inline-block;

  text-align: center;
  line-height: 35px;
  overflow: hidden;
  padding: 5px 10px;
`

const RowWrapper = styled.div`
  width: 100%;
  height: 46px;
  // oveflow: hidden;
`
