import { Button, Modal, Select, Tag } from 'antd'
import ModelApi from 'apis/ModelApi'
import ColumnLabel from 'components/fields/ColumnLabel'
import React, { useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { useRecoilState, useRecoilValue } from 'recoil'
import { v4 } from 'uuid'
import { selectedDataState } from 'views/DataAnalysis/store/dataset/atom'
import { featureSelectModalState } from 'views/DataAnalysis/store/modal/atom'
import { analysisResponseAtom } from 'views/DataAnalysis/store/response/atoms'
import { inputOptionListState } from 'views/DataAnalysis/store/userOption/atom'
import { variableStore } from 'views/DataAnalysis/store/variable/atom'

const FeatureSelectModal = ({ data, onRunning }: any) => {
  const [isModalOpen, setIsModalOpen] = useRecoilState(featureSelectModalState)
  const [variableList, setVariableList] = useRecoilState(variableStore) //전체
  const [analysisResponse, setAnalysisResponse] = useRecoilState(analysisResponseAtom)
  const selectedData = useRecoilValue(selectedDataState)
  const userInputOption = useRecoilValue(inputOptionListState)

  const [options, setOptions] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])

  const { mutate: mutateRunning } = useMutation(ModelApi.postModelwithOption, {
    onSuccess: (result: any) => {
      // console.log('FeatureSelectModal mutate result:', result)
      onRunning(false)

      setAnalysisResponse([
        ...analysisResponse,
        { key: v4(), data: result, input: result['selected_input'], error: result['metrics'] },
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
    if (isModalOpen) {
      if (selectedData.numeric_cols !== '') {
        // const numeric_cols = JSON.parse(selectedData.numeric_cols)
        // const non_numeric_cols = JSON.parse(selectedData.non_numeric_cols)

        console.log(selectedData)
        // console.log(non_numeric_cols)
      }
    }
  }, [isModalOpen])

  useEffect(() => {
    // console.log('selectedData:', selectedData)
    if (selectedData.non_numeric_cols && selectedData?.numeric_cols) {
      const numeric_cols = JSON.parse(selectedData.numeric_cols)
      const non_numeric_cols = JSON.parse(selectedData.non_numeric_cols)

      // console.log(numeric_cols)
      // console.log(non_numeric_cols)

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
    // setOptions(variableList.filter((x) => x.value !== selectedData.targetY))
  }, [])

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleChange = (value: string[]) => {
    // console.log(value)
    setSelectedFeatures(value)
    // console.log('new arr:', value.split(', '))
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
        type_missing: userInputOption.type_missing,
        number_missing: userInputOption.number_missing,
        type_outlier: userInputOption.type_outlier,
        number_std: userInputOption.number_std,
        number_perc: userInputOption.number_perc,
        type_scaling: userInputOption.type_scaling,
        number_ma: userInputOption.number_ma,
        type_model: userInputOption.type_model,
        number_epoch: userInputOption.number_epoch,
        number_beyssian: userInputOption.number_beyssian,
      }
      const controller = new AbortController()
      // setController(controller)
      console.log('custom model generate / payload:', payload)
      mutateRunning({ type: 'request', payload, controller })
    }
  }

  return (
    <Modal
      // style={{ top: 150 }}
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
            width: 120,
            backgroundColor: '#fff !important',
            border: '1px solid #A3AFCF',
            borderRadius: '10px',
          }}
          mode="multiple"
          allowClear
          placeholder="Feature X"
          options={options}
          // value={inputOption.target_y}
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
