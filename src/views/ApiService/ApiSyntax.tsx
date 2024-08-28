import styled from '@emotion/styled'
import type { TableProps } from 'antd'
import { Input, Table } from 'antd'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecoilValue } from 'recoil'
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
  const { t } = useTranslation()
  const apiInfo = useRecoilValue(publishResultState)
  const [defaultValue, setDefaultValue] = useState('')

  useEffect(() => {
    const newDefaultValue: string = JSON.stringify(apiInfo?.response?.syntax)
    setDefaultValue(newDefaultValue)
  }, [apiInfo])
  // const [columns, setColumns] = useState<TableProps<DataType>['columns']>([])

  // useEffect(() => {
  //   if (result.api_key.length > 0) {
  //     //
  //   }
  // }, [result])

  // console.log('result?.response.syntax:', result?.response.syntax)

  const columns: TableProps<SyntaxDataType>['columns'] = [
    {
      title: t('Method'),
      dataIndex: 'method',
      key: 'method',
      render: (text) => <a>{text.toUpperCase()}</a>,
    },
    {
      title: t('Request URL'),
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
      title: t('Parameter'),
      dataIndex: 'parameter',
      key: 'parameter',
    },
    {
      title: t('Type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('Required'),
      dataIndex: 'required',
      key: 'required',
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
    },
  ]

  const data_header: HeaderDataType[] = [
    {
      key: '1',
      parameter: 'api_key',
      type: 'string',
      required: 'yes',
      description: t('Authentication Key'),
    },
  ]

  const columns_element: TableProps<ElementDataType>['columns'] = [
    {
      title: t('Parameter'),
      dataIndex: 'parameter_name',
      key: 'parameter_name',
    },
    {
      title: t('Type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('Required'),
      dataIndex: 'required',
      key: 'required',
    },
    {
      title: t('Description'),
      dataIndex: 'description',
      key: 'description',
    },
  ]

  const data_element: ElementDataType[] = [
    {
      key: '1',
      parameter_name: 'data',
      type: 'list',
      required: 'yes',
      description: t('Data to input into the model'),
    },
  ]

  return (
    <SyntaxTableWrapper>
      <div className="w-1/4 p-3 inline-block float-left">
        {/* <div className="mb-5">
          <TableName>Model Input Variables</TableName>
        </div> */}

        <div className="mb-5">
          <TableName>{t('Request Syntax')}</TableName>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
        <div className="mb-5">
          <TableName>{t('Request Header')}</TableName>
          <Table columns={columns_header} dataSource={data_header} pagination={false} />
        </div>
      </div>
      <div className="w-1/4 p-3 inline-block float-left">
        <div className="mb-5">
          <TableName>{t('Request Elements')}</TableName>
          <Table columns={columns_element} dataSource={data_element} pagination={false} />
        </div>
      </div>
      <div className="w-2/4 p-3 inline-block float-left">
        <TableName>{t('Response Syntax')}</TableName>
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

const TableName = styled.p`
  color: #002d65;
  font-family: 'Noto Sans';
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 5px;
`
