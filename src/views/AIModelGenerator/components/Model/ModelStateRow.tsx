import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { App, Tag } from 'antd'
import ModelApi from 'apis/ModelApi'
import { IModelInfo } from 'apis/type/Model'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useSetRecoilState } from 'recoil'
import { validationCheck } from 'utils/DateFunction'
import { v4 } from 'uuid'
import { stepCountStore } from 'views/AIModelGenerator/store/global/atom'
import { selectedModelAtom } from 'views/AIModelGenerator/store/model/atom'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'
import './style.css'

interface ITag {
  key: number
  name: string
  color: string
  icon?: any
}

export interface IModelStateRow {
  rowData: IModelInfo
  key?: number
}

export interface IHeaders {
  headers: Array<string>
}

//메타데이터 구조 상세 참고 (https://docs.google.com/document/d/19lP80LLDBsnNQ27foyVKtP81Jc8XqRLM6GE1POXQIVQ/edit)
const status: ITag[] = [
  { key: 0, name: 'waiting', color: 'default', icon: <ClockCircleOutlined /> },
  { key: 1, name: 'created', color: 'default' },
  { key: 2, name: 'started', color: 'default', icon: <PlayCircleOutlined /> },
  { key: 3, name: 'preprocessing', color: 'processing', icon: <SyncOutlined spin /> },
  { key: 4, name: 'model training', color: 'processing', icon: <SyncOutlined spin /> },
  { key: 5, name: 'model training', color: 'processing', icon: <SyncOutlined spin /> },
  { key: 6, name: 'model training', color: 'processing', icon: <SyncOutlined spin /> },
  { key: 7, name: 'train completed', color: 'processing', icon: <CheckCircleOutlined /> },
  { key: 8, name: 'analyzing', color: 'processing', icon: <SyncOutlined spin /> },
  { key: 9, name: 'result saved', color: 'success', icon: <CheckCircleOutlined /> },
  { key: 10, name: 'failed', color: 'error', icon: <CloseCircleOutlined /> },
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
  const { message } = App.useApp()

  const setAnalysisResult = useSetRecoilState(analysisResponseAtom)
  const setActiveStep = useSetRecoilState(stepCountStore) /*activeStep = 실제step - 1 */
  const setSelectedModel = useSetRecoilState(selectedModelAtom)

  const [tag, setTag] = useState<ITag>({ key: 0, name: '', color: '' })

  const { mutate: mutateTrainingResult } = useMutation(ModelApi.getTrainingResultUrl, {
    onSuccess: (result: any) => {
      // GCS에서 받아온 만료시간이 GMT으로 설정되어 있어 한국 시간대(GMT + 9)로 변경하여 확인함
      if (validationCheck(result.expiration, 9)) downloadData(result.signed_url)
      else message.error('데이터 유효기간이 만료되었습니다.')
    },
    onError: (error: Error) => {
      message.error('결과를 확인할 수 없습니다. 관리자에게 문의하세요')
    },
  })

  useEffect(() => {
    if (rowData) {
      setTag(status.filter((item: ITag) => item.key.toString() == rowData.state)[0])
    }
  }, [rowData])

  const handleClick = (model: IModelInfo) => {
    setSelectedModel(model)
    mutateTrainingResult({ model_id: model.id, is_xai: 'false' })
  }

  const downloadData = async (url: string) => {
    try {
      const result = await ModelApi.getJsonResult(url)
      //운영계에만 에러 발생하여 로그 확인하기 위해 임시로 콘솔 찍음
      console.log('download result::', result)
      setAnalysisResult([
        {
          key: v4(),
          pred_data: result['prediction_data'],
          feature_data: result['feature_piechart_data'],
          input: result['selected_input'],
          error: result['metrics'],
          row_data: result['result_table'],
          metrics: result['metrics'],
          performance: result['peformance_table'],
          uuid: result['get_uuid'],
          classes: Boolean(result['isClassification']) ? result['classes'] : null,
        },
      ])
      setActiveStep(1)
    } catch (error) {
      console.error(error)
      message.error('데이터 유효기간이 만료되었습니다.')
    }
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
              {rowData.state === '9' && (
                <button className="btn-run" onClick={() => handleClick(rowData)}>
                  View result
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

interface ModelStateListProps {
  data: IModelInfo[] | undefined
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
        data.map((d: IModelInfo, i: number) => {
          return <ModelStateRow rowData={d} key={i} />
        })}
      {/* <div className="text-right">
        * state : <ModelStateInfo />
      </div> */}
    </>
  )
}

export default ModelStateList
