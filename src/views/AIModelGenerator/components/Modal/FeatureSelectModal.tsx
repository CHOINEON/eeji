import { Button, Modal, Select, Tag } from 'antd'
import ModelApi from 'apis/ModelApi'
import ColumnLabel from 'components/fields/ColumnLabel'
import { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'
import { v4 } from 'uuid'
import { selectedDataState } from 'views/AIModelGenerator/store/dataset/atom'
import { featureSelectModalState } from 'views/AIModelGenerator/store/modal/atom'
import { analysisResponseAtom } from 'views/AIModelGenerator/store/response/atoms'
import { variableStore } from 'views/AIModelGenerator/store/variable/atom'

const FeatureSelectModal = ({ data, onRunning }: any) => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(featureSelectModalState)
  const [variableList, setVariableList] = useRecoilState(variableStore) //전체
  const [analysisResponse, setAnalysisResponse] = useRecoilState(analysisResponseAtom)
  const selectedData = useRecoilValue(selectedDataState)

  const [options, setOptions] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])

  const { mutate: mutateRunning } = useMutation(ModelApi.postModelwithOption, {
    onSuccess: (result: any) => {
      // console.log('FeatureSelectModal mutate result:', result)
      onRunning(false)

      setAnalysisResponse([
        ...analysisResponse,
        {
          key: v4(),
          pred_data: JSON.parse(result['prediction_data']),
          feature_data: result['feature_piechart_data'],
          input: result['selected_input'],
          error: result['metrics'],
          row_data: result['result_table'],
          performance: result['peformance_table'],
          uuid: result['get_uuid'],
          classes: result['classes'],
        },
      ])
    },
    onError: (error: any) => {
      if (error.message === 'canceled') {
        alert('request canceled')
      } else {
        console.error(error)
      }
    },
  })

  useEffect(() => {
    if (selectedData.non_numeric_cols && selectedData?.numeric_cols) {
      const numeric_cols = JSON.parse(selectedData.numeric_cols)
      const non_numeric_cols = JSON.parse(selectedData.non_numeric_cols)

      const newOption: Array<any> = []
      variableList.map((x) => {
        if (numeric_cols?.includes(x.value)) {
          newOption.push({ value: x.value, label: x.value })
        } else if (non_numeric_cols.includes(x.value)) {
          newOption.push({ value: x.value, label: `${x.value} (non-numeric column)`, disabled: true })
        }
      })
      setOptions(newOption)
    }
  }, [])

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleChange = (value: string[]) => {
    setSelectedFeatures(value)
  }

  const handleGenerate = () => {
    //spinner showing
    onRunning(true)
    //close the modal
    handleCancel()

    //기존 첫번째 모델 돌릴때 사용했던 옵션들 다 가져와야 됨
    if (selectedFeatures.length < 2) {
      alert('변수는 2개 이상 선택되어야 합니다.')
    } else {
      const payload = {
        set_auto: true,
        user_id: localStorage.getItem('userId'),
        com_id: localStorage.getItem('companyId'),
        dataset_id: selectedData.ds_id,
        date_col: selectedData.dateCol,
        start_date: selectedData.startDate,
        end_date: selectedData.endDate,
        x_value: selectedFeatures || null,
        y_value: selectedData.targetY || '',
        if_classification: selectedData.isClassification,
      }
      const controller = new AbortController()

      mutateRunning({ type: 'request', payload, controller })
    }
  }

  return (
    <Modal
      title="Select feature X"
      open={isModalOpen}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
      width={300}
    >
      <>
        자동 선택된 추천 변수 :
        <p>
          {data.map((d: any, index: number) => (
            <Tag key={index}>{d}</Tag>
          ))}
        </p>
      </>

      <div style={{ marginTop: '10px' }}>
        <ColumnLabel required={true} label=" 원인 변수 (2개 이상)" />
        <Select
          style={{
            width: '100%',
            backgroundColor: '#fff !important',
            border: '1px solid #A3AFCF',
            borderRadius: '10px',
          }}
          mode="multiple"
          allowClear
          placeholder="Feature X"
          options={options}
          onChange={handleChange}
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Button onClick={handleGenerate}>Generate</Button>
      </div>
    </Modal>
  )
}

export default FeatureSelectModal
