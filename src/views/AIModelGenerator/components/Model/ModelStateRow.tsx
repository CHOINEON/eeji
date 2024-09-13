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
import { useToast } from 'hooks/useToast'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useSetRecoilState } from 'recoil'
import { Ellipsis } from 'styles/common'
import { validationCheck } from 'utils/DateFunction'
import { v4 } from 'uuid'
import { loadingAtom, stepCountStore } from 'views/AIModelGenerator/store/global/atom'
import { selectedModelAtom } from 'views/AIModelGenerator/store/model/atom'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'
import Actions from '../Button/ModelActions'
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

interface ModelStateListProps {
  data: IModelInfo[] | undefined
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
  const MAX_DATA_COUNT = 5000
  const contentRef = useRef(null)
  const { message } = App.useApp()
  const { t } = useTranslation()

  const setAnalysisResult = useSetRecoilState(analysisResponseAtom)
  const setActiveStep = useSetRecoilState(stepCountStore) /*activeStep = 실제step - 1 */
  const setSelectedModel = useSetRecoilState(selectedModelAtom)
  const setLoading = useSetRecoilState(loadingAtom)
  const [tag, setTag] = useState<ITag>({ key: 0, name: '', color: '' })

  const { mutate: mutateTrainingResult } = useMutation(ModelApi.getTrainingResultUrl, {
    onSuccess: (result: any) => {
      // GCS에서 받아온 만료시간이 GMT으로 설정되어 있어 한국 시간대(GMT + 9)로 변경하여 확인함
      if (validationCheck(result.expiration, 9)) downloadData(result.signed_url)
      else message.error(t('Sorry. This request has expired.'))
    },
    onError: (error: Error) => {
      message.error(t('The result is not available. Please contact the administrator.'))
    },
  })

  //메타데이터 구조 상세 참고 (https://docs.google.com/document/d/19lP80LLDBsnNQ27foyVKtP81Jc8XqRLM6GE1POXQIVQ/edit)
  const status: ITag[] = [
    { key: 0, name: t('waiting'), color: 'default', icon: <ClockCircleOutlined /> },
    { key: 1, name: t('created'), color: 'default' },
    { key: 2, name: t('started'), color: 'default', icon: <PlayCircleOutlined /> },
    { key: 3, name: t('preprocessing'), color: 'processing', icon: <SyncOutlined spin /> },
    { key: 4, name: t('model training'), color: 'processing', icon: <SyncOutlined spin /> },
    { key: 5, name: t('model training'), color: 'processing', icon: <SyncOutlined spin /> },
    { key: 6, name: t('model training'), color: 'processing', icon: <SyncOutlined spin /> },
    { key: 7, name: t('train completed'), color: 'processing', icon: <CheckCircleOutlined /> },
    { key: 8, name: t('analyzing'), color: 'processing', icon: <SyncOutlined spin /> },
    { key: 9, name: t('result saved'), color: 'success', icon: <CheckCircleOutlined /> },
    { key: 10, name: t('failed'), color: 'error', icon: <CloseCircleOutlined /> },
  ]

  useEffect(() => {
    if (rowData) {
      setTag(status.filter((item: ITag) => item.key.toString() == rowData.state)[0])
    }
  }, [rowData, t])

  const handleClick = (model: IModelInfo) => {
    setLoading(true)
    setSelectedModel(model)
    mutateTrainingResult({ model_id: model.id, is_xai: 'false' })
  }

  const downloadData = async (url: string) => {
    try {
      const result = await ModelApi.getJsonResult(url)

      // (24-08-29) 끝에서 5000개만 그리도록 수정
      function sliceResultObj(obj: any, num: number) {
        // 객체의 키들을 배열로 변환
        const keys = Object.keys(obj)
        // 마지막 5000개의 키 추출
        const last5000Keys = keys.slice(-num)

        // 마지막 10개의 키-값 쌍으로 새 객체 생성
        const last5000Obj = last5000Keys.reduce((result: any, key: string) => {
          result[key] = obj[key]
          return result
        }, {})

        return last5000Obj
      }

      function sliceResultArr(obj: { pred: Array<unknown>; truth: Array<unknown> }, num: number) {
        return { pred: obj['pred'].slice(-num), truth: obj['truth'].slice(-num) }
      }

      setAnalysisResult([
        {
          key: v4(),
          pred_data:
            result['prediction_data']['pred'].length > MAX_DATA_COUNT
              ? sliceResultArr(result['prediction_data'], MAX_DATA_COUNT)
              : result['prediction_data'],
          feature_data: result['feature_piechart_data'],
          input: result['selected_input'],
          error: result['metrics'],
          row_data:
            Object.keys(result['result_table']).length > MAX_DATA_COUNT
              ? sliceResultObj(result['result_table'], MAX_DATA_COUNT)
              : result['result_table'],
          metrics: result['metrics'],
          performance: result['peformance_table'],
          uuid: result['get_uuid'],
          classes: Boolean(result['isClassification']) ? result['classes'] : null,
        },
      ])
      setActiveStep(1)
      setLoading(false)
    } catch (error) {
      console.error(error)
      message.error(t('Sorry. This request has expired.'))
    }
  }

  return (
    <>
      {rowData && (
        <div className="table-container">
          <div className="table-row">
            <div className="row-item">
              <Ellipsis ref={contentRef}>{rowData.name}</Ellipsis>
            </div>

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
                  {t('View')}
                </button>
              )}
            </div>
            <div>
              <Actions model_id={rowData.id} model_name={rowData.name} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// const ModelStateInfo = () => {
//   return (
//     <>
//       {status.map((tag: ITag, idx: number) => {
//         return (
//           <Tag className="row-item-tag m-auto mr-2" color={tag?.color} icon={tag?.icon} key={idx}>
//             <span className="tracking-normal">{tag?.name}</span>
//           </Tag>
//         )
//       })}
//     </>
//   )
// }

const ModelStateList = ({ data }: ModelStateListProps) => {
  const { fireToast } = useToast()
  const { t } = useTranslation()

  const [prevData, setPrevData] = useState<IModelInfo[]>([])
  const [newData, setNewData] = useState<IModelInfo[]>([])
  const headers: Array<string> = [t('Model Name'), t('Target'), t('Created'), t('State'), t('Result')]

  useEffect(() => {
    setNewData(data)
  }, [])

  const extractItems = (stateCheck: (oldState: string, newState: string) => boolean) => {
    return newData.filter((newItem: IModelInfo) => {
      const oldItem = prevData.find((item: IModelInfo) => item.id === newItem.id)
      return oldItem && stateCheck(oldItem.state, newItem.state)
    })
  }

  const showToastMessages = (items: IModelInfo[], type: 'success' | 'error', content: string) => {
    items.forEach((item: IModelInfo) => fireToast({ id: item.id, type, title: 'AI Model Generator', content }))
  }

  useEffect(() => {
    if (prevData.length > 0 && newData.length > 0) {
      // 이전 데이터와 새로운 데이터를 비교하여 조건에 맞는 배열 요소를 추출
      const updatedItems = extractItems((oldState, newState) => oldState !== '9' && newState === '9')
      showToastMessages(updatedItems, 'success', '모델 학습이 완료되었습니다.')

      const failedItems = extractItems((oldState, newState) => oldState !== '10' && newState === '10')
      showToastMessages(failedItems, 'error', '모델 학습이 실패하였습니다.')
    }

    // 이전 데이터를 새로운 데이터로 업데이트
    setPrevData(newData)
  }, [newData, extractItems, showToastMessages])

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
