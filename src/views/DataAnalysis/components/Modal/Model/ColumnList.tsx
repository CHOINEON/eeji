import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import 'views/DataAnalysis/style/xai.css'

interface IColumnData {
  data: Array<any>
  onSelect: any
}

const ColumnList = (props: IColumnData) => {
  const [checkedList, setCheckedList] = useState<string[]>([])
  const columnData = props.data

  useEffect(() => {
    props.onSelect(checkedList)
  }, [checkedList])

  const checkHandler = (e: React.ChangeEvent<HTMLInputElement>, value: string) => {
    checkedItemHandler(value, e.target.checked)
  }

  const checkedItemHandler = (value: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckedList((prev) => [...prev, value])
    }

    if (!isChecked && checkedList.includes(value)) {
      setCheckedList(checkedList.filter((item) => item !== value))
    }
  }

  const ColumnItem = ({ item, ...rest }: any) => {
    return (
      <ItemWrapper>
        <Label htmlFor={item}>{item}</Label>
        <Checkbox>
          <input
            type="checkbox"
            id={item}
            checked={checkedList.includes(item)}
            onChange={(e) => checkHandler(e, item)}
          />
          <label htmlFor={item}></label>
        </Checkbox>
      </ItemWrapper>
    )
  }

  return (
    <>
      {columnData && <p> 변수명</p>}
      {columnData?.map((value: string, index: number) => {
        return <ColumnItem key={index} item={value.toString()} />
      })}
    </>
  )
}

export default ColumnList

const ItemWrapper = styled.div`
  //   border: 1px solid blue;
  float: left;
  background-color: #f6f8ff;
  width: 100%;
  border-radius: 5px;
  padding: 0 10px;
  margin: 5px 0;
`

const Label = styled.label`
  display: inline-block;
  float: left;
  width: 90%;
  color: #002d65;
  opacity: 0.9;
  line-height: 35px;
`

const Checkbox = styled.div`
  display: inline-block;
  float: left;
  width: 10%;
`
