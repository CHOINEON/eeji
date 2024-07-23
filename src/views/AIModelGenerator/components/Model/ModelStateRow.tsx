import { CheckCircleOutlined, CloseCircleOutlined, PlayCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { IModelStatus } from 'apis/type/Model'
import { useEffect, useState } from 'react'
import './style.css'

interface ITag {
  key: number
  name: string
  color: string
  icon?: any
}

export interface IModelStateRow {
  rowData: IModelStatus
  key?: number
}

export interface IHeaders {
  headers: Array<string>
}

//메타데이터 구조 상세 참고 (https://docs.google.com/document/d/19lP80LLDBsnNQ27foyVKtP81Jc8XqRLM6GE1POXQIVQ/edit)
const status: ITag[] = [
  { key: 1, name: 'created', color: 'default' },
  { key: 2, name: 'started', color: 'processing', icon: <PlayCircleOutlined /> },
  { key: 3, name: 'preprocessing', color: 'processing', icon: <SyncOutlined spin /> },
  { key: 4, name: 'model training', color: 'processing', icon: <SyncOutlined spin /> },
  { key: 5, name: 'model training', color: 'processing', icon: <SyncOutlined spin /> },
  { key: 6, name: 'model training', color: 'processing', icon: <SyncOutlined spin /> },
  { key: 7, name: 'completed', color: 'success', icon: <CheckCircleOutlined /> },
  { key: 8, name: 'failed', color: 'error', icon: <CloseCircleOutlined /> },
]

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
  const [tag, setTag] = useState<ITag>({ key: 0, name: '', color: '' })

  useEffect(() => {
    if (rowData) {
      setTag(status.filter((item: ITag) => item.key == rowData.state)[0])
    }
  }, [rowData])

  const handleClick = (model_id: string) => {
    console.log('modelid:', model_id)
  }

  return (
    <>
      {rowData && (
        <div className="table-container">
          <div className="table-row">
            <div className="row-item">{rowData.name}</div>
            <div className="row-item">{rowData.target}</div>
            <div className="row-item">{rowData?.created_at}</div>
            <div className="row-item">
              <Tag className="row-item-tag m-auto" color={tag?.color} icon={tag?.icon}>
                <span className="tracking-normal">{tag?.name}</span>
              </Tag>
            </div>
            <div className="row-item">
              <button className="btn-run" onClick={() => handleClick(rowData.id)}>
                Run
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface ModelStateListProps {
  data: IModelStatus[] | undefined
}

const ModelStateInfo = () => {
  return (
    <>
      {status.map((tag: ITag, idx: number) => {
        return (
          <Tag className="row-item-tag m-auto mr-2" color={tag?.color} icon={tag?.icon} key={idx}>
            <span className="tracking-normal">{tag?.name}</span>
          </Tag>
        )
      })}
    </>
  )
}

const ModelStateList = ({ data }: ModelStateListProps) => {
  const headers: Array<string> = ['Model Name', 'Target', 'Created', 'State', 'Result']

  return (
    <>
      <ModelStateColHeader headers={headers} />
      {data?.length > 0 &&
        data.map((d: IModelStatus, i: number) => {
          return <ModelStateRow rowData={d} key={i} />
        })}
      <div className="text-right">
        state : <ModelStateInfo />
      </div>
    </>
  )
}

export default ModelStateList
