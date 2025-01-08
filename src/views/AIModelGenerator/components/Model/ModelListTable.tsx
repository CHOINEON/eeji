import { EllipsisOutlined } from '@ant-design/icons'
import { App, Badge, Button, Dropdown, MenuProps, Space, Table, Tag } from 'antd'
import ModelApi from 'apis/ModelApi'
import { IModelDetailInfo, IModelInfo, IModelList } from 'apis/type/Model'
import { useGetModelList_v1 } from 'hooks/queries/useGetModelList'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import { useHistory } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'
import { Ellipsis } from 'styles/common'
import { validationCheck } from 'utils/DateFunction'
import { v4 } from 'uuid'
import { loadingAtom, stepCountStore } from 'views/AIModelGenerator/store/global/atom'
import { selectedModelAtom } from 'views/AIModelGenerator/store/model/atom'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'
import InfoCircle from '../Icon/InfoCircle'
import './style.css'

const { Column } = Table

export interface IBadge {
  key: number
  text: string
  status: 'default' | 'processing' | 'success' | 'error' | 'warning'
}

const ModelListTable = () => {
  const { t } = useTranslation()

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 9

  const { models, total_count, refetch } = useGetModelList_v1(
    ((currentPage - 1) * pageSize).toString(),
    pageSize.toString()
  )
  const [modelList, setModelList] = useState<Array<unknown>>()

  const MAX_DATA_COUNT = 5000
  const contentRef = useRef(null)
  const { message } = App.useApp()

  const setAnalysisResult = useSetRecoilState(analysisResponseAtom)
  const setActiveStep = useSetRecoilState(stepCountStore) /*activeStep = 실제step - 1 */
  const setSelectedModel = useSetRecoilState(selectedModelAtom)
  const setLoading = useSetRecoilState(loadingAtom)
  const history = useHistory()

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

  const error_codes: { [key: number]: string } = {
    0: t('errorCodes.0'),
    1: t('errorCodes.1'),
    2: t('errorCodes.2'),
    3: t('errorCodes.3'),
    4: t('errorCodes.4'),
    5: t('errorCodes.5'),
    6: t('errorCodes.6'),
    7: t('errorCodes.7'),
    8: t('errorCodes.8'),
    9: t('errorCodes.9'),
    10: t('errorCodes.10'),
    11: t('errorCodes.11'),
    111: t('errorCodes.111'),
    1001: t('errorCodes.1001'),
    1002: t('errorCodes.1002'),
    1003: t('errorCodes.1003'),
    1004: t('errorCodes.1004'),
    1005: t('errorCodes.1005'),
    1006: t('errorCodes.1006'),
  }

  const { mutate: mutateTrainingResult } = useMutation(ModelApi.getTrainingResultUrl, {
    onSuccess: (result: any) => {
      // GCS에서 받아온 만료시간이 GMT으로 설정되어 있어 한국 시간대(GMT + 9)로 변경하여 확인함
      if (validationCheck(result.expiration, 9)) downloadData(result.signed_url)
      else message.error(t('Sorry. This request has expired.'))
    },
    onError: () => {
      message.error(t('The result is not available. Please contact the administrator.'))
    },
  })

  const { mutate: mutateModelDetail } = useMutation(ModelApi.getModelDescription, {
    onSuccess: (result: IModelDetailInfo[]) => {
      // models 배열에서 id가 result[0].id와 일치하는 요소를 찾음
      const targetModel = models?.find((model) => model.id === result[0].id)

      if (models && targetModel) {
        // 이전 상태를 기반으로 업데이트하는 방식 사용
        setModelList((prevModelList: IModelList) => {
          // 기존 modelList에서 특정 id의 dataset_name만 업데이트
          return prevModelList.map(
            (model) =>
              model.id === targetModel.id
                ? { ...model, dataset_name: result[0].dataset_name } // id가 일치하는 경우 dataset_name 업데이트
                : model // id가 일치하지 않으면 기존 model 반환
          )
        })
      }
    },
  })

  const { mutate: mutateDeleteModel } = useMutation(ModelApi.deleteModel, {
    onSuccess: () => {
      message.info(t('Successfully Requested'))
      refetch()
    },
    onError: () => {
      message.error(t('The request has failed. Please try again later.'))
    },
  })

  const { mutate: mutateCancelTraning } = useMutation(ModelApi.cancelModelTraining, {
    onSuccess: () => {
      message.info(t('Successfully Requested'))
      refetch()
    },
    onError: () => {
      message.error(t('Please contact the administrator.'))
    },
  })

  useEffect(() => {
    setModelList(models)

    models?.map((model) => {
      mutateModelDetail({ model_id: model.id })
    })
  }, [models])

  useEffect(() => {
    refetch()
  }, [currentPage])

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
    if (model) {
      history.push(`/admin/view-model-results/${model.id}`)
    }
  }

  const renderStateBadge = (state: string, status: IBadge[], is_canceled: number) => {
    if (is_canceled === 1) {
      return (
        <p>
          <span className="mx-1">{t('stopped')}</span>
        </p>
      )
    }
    const model_state = status.filter((item: IBadge) => item.key.toString() === state)[0]

    return <Badge className="row-item-tag m-auto" status={model_state?.status} text={model_state?.text}></Badge>
  }

  const ModelStateInfo: React.FC<{ status: IBadge[] }> = ({ status }) => {
    // 중복 제거
    const uniqueStatus = status.filter((item, index, self) => index === self.findIndex((t) => t.text === item.text))
    uniqueStatus.push({ key: 0, text: t('stopped'), status: 'default' })

    return (
      <Space direction="vertical">
        {uniqueStatus.map((item) => (
          <Badge key={item.key} status={item.status} text={<span className="text-white">{item.text}</span>} />
        ))}
      </Space>
    )
  }

  const getFilteredItems = (rowData: IModelInfo) => {
    const items: MenuProps['items'] = [
      {
        key: '1',
        label: (
          <button onClick={() => mutateCancelTraning(rowData.id)}>
            <p className="text-[#FF3D50]">{t('Stop')}</p>
          </button>
        ),
      },
      {
        key: '2',
        label: <button onClick={() => message.info('개발 중입니다.')}>{t('Edit')}</button>,
      },
      {
        key: '3',
        label: <button onClick={() => mutateDeleteModel(rowData.id)}>{t('Delete')}</button>,
      },
    ]

    //9: 저장, 10: 실패, 1: 취소
    if (rowData.state === '9' || rowData.state === '10' || rowData.is_canceled === 1) {
      return items.slice(1) // Return only the second and third items
    }

    return items // Return all items for other states
  }

  return (
    <>
      <Table
        className="w-100 h-[530px]"
        size="small"
        dataSource={modelList || []}
        scroll={{ y: 495 }}
        pagination={{
          total: total_count || 0,
          pageSize: pageSize || 10,
          position: ['bottomCenter'],
          showSizeChanger: false,
          onChange: (page) => {
            setCurrentPage(page)
          },
        }}
        rowKey="id"
        expandable={{
          expandedRowRender: (record: IModelDetailInfo) => {
            return (
              <>
                <p style={{ margin: 0 }}>
                  {t('Dataset')} : {record.dataset_name}
                </p>
                {record.error_code ? (
                  <p style={{ margin: 0 }}>
                    {t('Issue Summary')} : {error_codes[record.error_code] || t('Please contact the administrator.')}
                  </p>
                ) : (
                  ''
                )}
              </>
            )
          },
        }}
      >
        <Column
          title={t('Model Name')}
          dataIndex="name"
          key="name"
          align="center"
          width={200}
          render={(name: string) => <Ellipsis ref={contentRef}>{name}</Ellipsis>}
        />
        <Column title={t('Target')} dataIndex="target" key="target" align="center" ellipsis={false} />
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
        <Column title={t('Created')} dataIndex="created_at" key="created_at" align="center" />
        <Column
          title={
            <>
              {t('State')}{' '}
              <InfoCircle
                placement="rightBottom"
                content={<ModelStateInfo status={status} />}
                styleClass="text-[12px]"
              />
            </>
          }
          dataIndex="state"
          key="state"
          align="center"
          width={95}
          render={(text, record: IModelInfo) => renderStateBadge(text, status, record.is_canceled)}
        />
        <Column
          title={t('Result')}
          dataIndex="state"
          key="customKey"
          align="center"
          width={53}
          render={(text, record: IModelInfo) => (
            <>
              {record.state === '9' && record.is_canceled === 0 && (
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
          render={(text, record: IModelInfo) => (
            <>
              <Dropdown menu={{ items: getFilteredItems(record) }} placement="bottom">
                <Button type="text" icon={<EllipsisOutlined />}></Button>
              </Dropdown>
            </>
          )}
        />
      </Table>
    </>
  )
}

export default ModelListTable
