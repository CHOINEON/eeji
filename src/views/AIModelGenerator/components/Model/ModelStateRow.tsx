import { CheckCircleOutlined, CloseCircleOutlined, PlayCircleOutlined, SyncOutlined } from '@ant-design/icons'
import { App, Tag } from 'antd'
import ModelApi from 'apis/ModelApi'
import { IModelInfo } from 'apis/type/Model'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState, useSetRecoilState } from 'recoil'
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
  const { message } = App.useApp()

  const [analysisResult, setAnalysisResult] = useRecoilState(analysisResponseAtom)
  const setActiveStep = useSetRecoilState(stepCountStore) /*activeStep = 실제step - 1 */
  const setSelectedModel = useSetRecoilState(selectedModelAtom)

  const [tag, setTag] = useState<ITag>({ key: 0, name: '', color: '' })

  const { mutate: mutateTrainingResult } = useMutation(ModelApi.getTrainingResultUrl, {
    onSuccess: (result: any) => {
      // console.log(result)
    },
    onError: (error: Error) => {
      console.log('err:', error)
    },
  })

  useEffect(() => {
    if (rowData) {
      setTag(status.filter((item: ITag) => item.key.toString() == rowData.state)[0])
    }
  }, [rowData])

  const handleClick = (model: IModelInfo) => {
    setSelectedModel(model)

    const classification_mock_response = {
      expiration: '2024-07-26T01:41:00.346176',
      signed_url:
        'https://storage.googleapis.com/cloudai-dev-shared/2da1a293d4fd11ed9be8047c161d2619/ineeji_testno3/008e4f27718749c7ae9807b63c904e3d.csv_844fe5860414461db7e03d9ea8abcc2a_packed_results.json?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=cloudai-data-uploader%40ineeji-cloudai-test.iam.gserviceaccount.com%2F20240724%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240724T014100Z&X-Goog-Expires=172800&X-Goog-SignedHeaders=host&X-Goog-Signature=04c3f242dc5773550109b1cf396ed879d888c29180063e70b77c0d763c2217c2836bb9dd748b5d3842d3b3205f1ed18f82d9f4a4678898bb666addeba25d24cc7d74fc90f92c1653915f1b78feac9a23f6a047e8e67f3266fe68d430ac721e7160a5c0d3d78d773c1554b0cf1ee2e4aa4c0d4be1c198bf765ac4ba0a5e1de11e5d17eac9a088d34b04f0639912c64ad140820c910564667ddb10ab588df323c08a79ff26789b424ffe00a1af15bca2aaa71452b2628660a10403023b99c7f58b1ff053b428b2b9584007744bacda0a8de4c9b417a52c2facef1978bdd3395d333d4f0209c148170af0e395f7e2975cf92a753569afc8e4b7a38c4f36f8b70ad4',
    }

    const regression_mock_response = {
      expiration: '2024-07-27T02:23:25.793196',
      signed_url:
        'https://storage.googleapis.com/cloudai-dev-shared/2da1a293d4fd11ed9be8047c161d2619/ineeji_testno3/packed_results.json?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=cloudai-data-uploader%40ineeji-cloudai-test.iam.gserviceaccount.com%2F20240725%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20240725T022325Z&X-Goog-Expires=172800&X-Goog-SignedHeaders=host&X-Goog-Signature=38f021f28dc79b1e0daa611741295055a1cceb9a2325a01a15562d4f4158448ac78ae17222bc43c3283d0b2252b3931417caf03727d061edeb63731eec00d0971826974289ebf62321d6837a1dfd7cc28a2de53a22e1ec65c9d7778ec463f724ffbc2ace404266f512b02e3a455a8ba5f7aab07eb68480cccfc1a5a358eb499ca4f5b5651d9dc550a6cfc0e412d000f17b228ba72ba5205233bff97ad6c4416d8ccda49577dd3b087f0bd71b44fc7fcae0624cc6ab37355d2c0e3cae53f78425ad8c08fb031fca9dd7bc9347bd4966e9a1dc4878c9dad92466bbb704efc9b0e7979d57ab146ed7a7aefc909aff1ec096a5d48eaf0c28a19524c4250a9581adc3',
    }
    downloadData(classification_mock_response.signed_url)
  }

  const downloadData = async (url: string) => {
    try {
      const result = await ModelApi.getJsonResult(url)

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
      console.error(error.response.data)
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
              {rowData.state === '7' && (
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
      <div className="text-right">
        state : <ModelStateInfo />
      </div>
    </>
  )
}

export default ModelStateList
