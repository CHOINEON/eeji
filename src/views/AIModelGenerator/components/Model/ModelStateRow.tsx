import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { useEffect, useState } from 'react'
import './style.css'

interface ITag {
  name: string
  color: string
  icon?: any
}

export interface IModelStateData {
  id: number
  name: string
  state: string
  target: string
  dataset: string
  accuracy: number
  errorRate: number
  created: string
  updated: string
  createdby: string
  isClassification: boolean | number
  descr: string
  starred: boolean | number
}

export interface IModelStateRows {
  data: Array<IModelStateData>
}

export interface IModelStateRow {
  rowData: IModelStateData
  key?: number
}

export interface IHeaders {
  headers: Array<string>
}

const ModelStateColHeader = ({ headers }: IHeaders) => {
  return (
    <>
      <div className="header-row">
        {headers.map((h: string, i: number) => {
          return (
            <div className="head-item" key={i}>
              {h}
            </div>
          )
        })}
      </div>
    </>
  )
}

const ModelStateRow = ({ rowData }: IModelStateRow) => {
  const [tag, setTag] = useState<ITag>()

  const status = [
    { name: 'created', color: 'default' },
    { name: 'ready', color: 'default', icon: <ClockCircleOutlined /> },
    { name: 'running', color: 'processing', icon: <SyncOutlined spin /> },
    { name: 'blocked', color: 'orange', icon: <CloseCircleOutlined /> },
    { name: 'completed', color: 'success', icon: <CheckCircleOutlined /> },
  ]

  useEffect(() => {
    if (rowData) {
      setTag(status.filter((item) => item.name === rowData.state)[0])
    }
  }, [rowData])

  return (
    <>
      {rowData && (
        <div className="table-container">
          <div className="table-row">
            <div className="row-item">{rowData.name}</div>
            <div className="row-item">{rowData.isClassification ? 'classification' : 'regression'}</div>
            <div className="row-item">{rowData.target}</div>
            <div className="row-item">{rowData.created}</div>
            <div className="row-item">
              <Tag className="row-item-tag" color={tag?.color} icon={tag?.icon}>
                {tag?.name}
              </Tag>
            </div>
            {/* <div className="row-item">{rowData.descr}</div> */}
            {/* <div className="row-item">{rowData.accuracy}</div>
            <div className="row-item">{rowData.errorRate}</div> */}
            {/* <div className="row-item">{rowData.updated}</div> */}
            {/* <div className="row-item">{rowData.createdby}</div> */}
            {/* <div className="row-item">
              <button className="btn-run">Run</button>
            </div> */}
          </div>
        </div>
      )}
    </>
  )
}

const ModelStateList = ({ data }: IModelStateRows) => {
  const headers: Array<string> = [
    'Model Name',
    'Model Type',
    'Target',
    'Created',
    'State',
    // 'Description',
    // 'Accuracy',
    // 'Error rate',
    // 'Updated',
    // 'Create by',
    // '',
  ]

  return (
    <>
      <ModelStateColHeader headers={headers} />
      {data?.length > 0 &&
        data.map((d: IModelStateData, i: number) => {
          return <ModelStateRow rowData={d} key={i} />
        })}
    </>
  )
}

export default ModelStateList
