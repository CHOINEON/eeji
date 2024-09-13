import { App, Badge, Table, Tag } from 'antd'
import ModelApi from 'apis/ModelApi'
import { IModelInfo, IModelList } from 'apis/type/Model'
import useGetModelList from 'hooks/queries/useGetModelList'
import { t } from 'i18next'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { Ellipsis } from 'styles/common'
import { validationCheck } from 'utils/DateFunction'
import { v4 } from 'uuid'
import { loadingAtom, stepCountStore } from 'views/AIModelGenerator/store/global/atom'
import { modelListAtom, selectedModelAtom } from 'views/AIModelGenerator/store/model/atom'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'
import Actions from '../Button/ModelActions'

const { Column } = Table

interface IBadge {
  key: number
  text: string
  status: 'default' | 'processing' | 'success' | 'error' | 'warning'
}

//메타데이터 구조 상세 참고 (https://docs.google.com/document/d/19lP80LLDBsnNQ27foyVKtP81Jc8XqRLM6GE1POXQIVQ/edit)
const status: IBadge[] = [
  { key: 0, text: t('waiting'), status: 'default' },
  { key: 1, text: t('created'), status: 'warning' },
  { key: 2, text: t('started'), status: 'processing' },
  { key: 3, text: t('preprocessing'), status: 'processing' },
  { key: 4, text: t('model training'), status: 'processing' },
  { key: 5, text: t('model training'), status: 'processing' },
  { key: 6, text: t('model training'), status: 'processing' },
  { key: 7, text: t('train completed'), status: 'processing' },
  { key: 8, text: t('analyzing'), status: 'processing' },
  { key: 9, text: t('result saved'), status: 'success' },
  { key: 10, text: t('failed'), status: 'error' },
]

const ModelListTable = () => {
  const { t } = useTranslation()
  const { data } = useGetModelList(localStorage.getItem('userId'))
  const [modelList, setModelList] = useRecoilState(modelListAtom)

  const MAX_DATA_COUNT = 5000
  const contentRef = useRef(null)
  const { message } = App.useApp()

  const setAnalysisResult = useSetRecoilState(analysisResponseAtom)
  const setActiveStep = useSetRecoilState(stepCountStore) /*activeStep = 실제step - 1 */
  const setSelectedModel = useSetRecoilState(selectedModelAtom)
  const setLoading = useSetRecoilState(loadingAtom)

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

  //TODO : Dataset name 가져오기 위한 mutation(백엔드 작업 대기)
  const { mutate: mutateModelDescription } = useMutation(ModelApi.getModelDescription, {
    // onSuccess: (result: IModelInfo[]) => {
    //     setModelList((prevModelList) => ({
    //       ...prevModelList,
    //       [result[0].id]: {
    //         ...prevModelList[result[0].id],
    //         dataset_name: result[0].dataset_name,
    //       }
    //     }));
    //   }

    onSuccess: (result: any) => {
      // setModelList((prevModelList) => ({
      //   ...prevModelList,
      //   [result[0].id]: { ...prevModelList[result[0].id], dataset_name: result[0].dataset_name },
      // }))
    },
  })

  useEffect(() => {
    if (Array.isArray(data)) {
      const updatedData = data.map((item, index) => ({
        ...item,
        key: index.toString(),
      }))
      setModelList(updatedData as IModelList)

      // TODO: 한꺼번에 전부 돌면 n번. pagination 먼저 처리해야됨
      // data.map((item: IModelInfo) => {
      //   mutateModelDescription({ model_id: item.id })
      // })
    }
  }, [data])

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

  const handleClick = (model: IModelInfo) => {
    setLoading(true)
    setSelectedModel(model)
    mutateTrainingResult({ model_id: model.id, is_xai: 'false' })
  }

  const renderStateBadge = (state: string, status: IBadge[]) => {
    const model_state = status.filter((item: IBadge) => item.key.toString() === state)[0]
    return <Badge className="row-item-tag m-auto" status={model_state?.status} text={model_state?.text}></Badge>
  }

  return (
    <>
      <Table
        className="w-[780px]"
        size="small"
        dataSource={modelList}
        pagination={{ pageSize: 10, position: ['bottomCenter'], pageSizeOptions: [10] }}
      >
        <Column
          title={t('Model Name')}
          dataIndex="name"
          key="name"
          align="center"
          render={(name: string) => <Ellipsis ref={contentRef}>{name}</Ellipsis>}
        />
        <Column title={t('Target')} dataIndex="target" key="target" align="center" ellipsis={false} />
        <Column title={t('Created')} dataIndex="created_at" key="created_at" align="center" />
        <Column
          title={t('State')}
          dataIndex="state"
          key="state"
          align="center"
          render={(state: string) => renderStateBadge(state, status)}
        />
        <Column
          title={t('Model Type')}
          dataIndex="is_classification"
          key="is_classification"
          align="center"
          render={(is_classification: boolean) => (
            <>
              {
                <Tag className="m-auto" color={is_classification ? '#2db7f5' : '#87d068'}>
                  {is_classification ? 'Classification' : 'Regression'}
                </Tag>
              }
            </>
          )}
        />
        <Column
          title={t('Result')}
          dataIndex="state"
          key="customKey"
          align="center"
          render={(text, record: IModelInfo) => (
            <>
              {record.state === '9' && (
                <button className="text-[#1677ff] cursor-pointer" onClick={() => handleClick(record)}>
                  {t('View')}
                </button>
              )}
            </>
          )}
        />
        <Column
          title={''}
          key="id"
          align="center"
          render={(text, record: IModelInfo) => <Actions model_id={record?.id} model_name={record?.name} />}
        />
      </Table>
    </>
  )
}

export default ModelListTable
