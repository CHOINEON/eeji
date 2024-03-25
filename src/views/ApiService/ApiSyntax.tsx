import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { Input, Space, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import { useRecoilState, useRecoilValue } from 'recoil'
import { publishResultState } from './store/atom'

interface HeaderDataType {
  key: string
  parameter: string
  type: string
  required: string
  description: string
}

interface ElementDataType {
  key: string
  parameter_name: string
  type: string
  required: string
  description: string
}

interface SyntaxDataType {
  key: string
  method: string
  url: string
}

const { TextArea } = Input

const ApiSyntax = () => {
  const result = useRecoilValue(publishResultState)
  const [defaultValue, setDefaultValue] = useState('')

  useEffect(() => {
    const newDefaultValue: string = JSON.stringify(result?.response?.syntax)
    setDefaultValue(newDefaultValue)
  }, [result])
  // const [columns, setColumns] = useState<TableProps<DataType>['columns']>([])

  // useEffect(() => {
  //   if (result.api_key.length > 0) {
  //     //
  //   }
  // }, [result])

  // console.log('result?.response.syntax:', result?.response.syntax)

  const columns: TableProps<SyntaxDataType>['columns'] = [
    {
      title: '메서드',
      dataIndex: 'method',
      key: 'method',
      render: (text) => <a>{text.toUpperCase()}</a>,
    },
    {
      title: '요청 URL',
      dataIndex: 'url',
      key: 'url',
    },
  ]

  const data: SyntaxDataType[] = [
    {
      key: '1',
      method: 'POST',
      url: 'https://ineeji.com/api_key',
    },
  ]

  const columns_header: TableProps<HeaderDataType>['columns'] = [
    {
      title: '파라미터',
      dataIndex: 'parameter',
      key: 'parameter',
    },
    {
      title: '타입',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '필수여부',
      dataIndex: 'required',
      key: 'required',
    },
    {
      title: '설명',
      dataIndex: 'description',
      key: 'description',
    },
  ]

  const data_header: HeaderDataType[] = [
    {
      key: '1',
      parameter: 'APIKey',
      type: 'string',
      required: 'yes',
      description: '인증 키',
    },
  ]

  const columns_element: TableProps<ElementDataType>['columns'] = [
    {
      title: '파라미터',
      dataIndex: 'parameter_name',
      key: 'parameter_name',
    },
    {
      title: '타입',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '필수여부',
      dataIndex: 'required',
      key: 'required',
    },
    {
      title: '설명',
      dataIndex: 'description',
      key: 'description',
    },
  ]

  const data_element: ElementDataType[] = [
    {
      key: '1',
      parameter_name: 'target',
      type: 'string',
      required: 'yes',
      description: '타겟변수',
    },
    {
      key: '2',
      parameter_name: 'input_data',
      type: 'list',
      required: 'yes',
      description: '데이터',
    },
  ]

  return (
    <SyntaxTableWrapper>
      <div className="w-1/4 p-3 inline-block float-left">
        <div className="mb-5">
          <TableName>Request Syntax</TableName>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
        <div className="mb-5">
          <TableName>Request Header</TableName>
          <Table columns={columns_header} dataSource={data_header} pagination={false} />
        </div>
      </div>
      <div className="w-1/4 p-3 inline-block float-left">
        <TableName>Request Elements</TableName>
        <Table columns={columns_element} dataSource={data_element} pagination={false} />
      </div>
      <div className="w-2/4 p-3 inline-block float-left">
        <TableName>Response Syntax</TableName>
        <TextArea
          rows={12}
          value={defaultValue}
          // onChange={onChange}
          // style={{ height: 300, resize: 'none' }}
        />
      </div>
    </SyntaxTableWrapper>
  )
}

export default ApiSyntax

const SyntaxTableWrapper = styled.div`
  display: block;
  float: left;
  background-color: #fff;
  margin-top: 20px;
  border: 1px solid #d5dcef;
  width: 100%;
  border-radius: 25px;
  box-shadow: 0px 0px 10px #5951db33;
  padding: 1%;
`

const TableWrapper = styled.div`
  border: 1px solid red;
`

const TableName = styled.p`
  color: #002d65;
  font-family: 'Noto Sans';
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 5px;
`
