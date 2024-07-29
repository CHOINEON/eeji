import styled from '@emotion/styled'
import { App } from 'antd'
import ModelApi from 'apis/ModelApi'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import DatasetList from './DatasetList'
import DataEditModal from './components/DataInfo/DataEditModal'
import DataInfoBox from './components/DataInfo/DataInfoBox'
import { selectedDataState, userInfoState } from './store/dataset/atom'
import { analysisResponseAtom } from './store/response/atoms'
import './style/data-analysis-style.css'

const DataSet = () => {
  const { message } = App.useApp()
  const queryClient = useQueryClient()

  const selectedData = useRecoilState(selectedDataState)
  const setUserInfo = useSetRecoilState(userInfoState)
  const resetAnalysisResponse = useResetRecoilState(analysisResponseAtom)

  const { mutate: mutateRunning } = useMutation(ModelApi.postModelwithOption, {
    onSuccess: (result: any) => {
      message.success('모델 학습이 정상적으로 요청되었습니다.')
      queryClient.invalidateQueries('models')
    },
    onError: (error: any) => {
      message.error('요청이 실패하였습니다. 다음에 다시 시도해주세요.')
    },
  })

  useEffect(() => {
    //데이터셋 페이지 나갔다 오면 초기화
    resetAnalysisResponse()
    setUserInfo({ user_id: localStorage.getItem('userId'), com_id: localStorage.getItem('companyId') })
  }, [])

  const handleGenerateModel = () => {
    const payload = {
      set_auto: true,
      user_id: localStorage.getItem('userId'),
      com_id: localStorage.getItem('companyId') || 'google',
      dataset_id: selectedData[0].ds_id,
      date_col: selectedData[0].dateCol,
      start_date: selectedData[0].startDate,
      end_date: selectedData[0].endDate,
      y_value: selectedData[0].targetY || '',
      if_classification: selectedData[0].isClassification,
    }
    mutateRunning({ type: 'request', payload: payload })
  }

  return (
    <div className="h-[80vh] p-10 border-r-2">
      <p className="font-['Helvetica Neue'] font-bold text-[23px] text-[#002D65] ">Dataset</p>
      <div className="h-[93vh]">
        <div className="w-100 h-3/5 overflow-scroll text-center">
          <div className="flex justify-center flex-wrap">
            <DatasetList />
          </div>
        </div>
        {selectedData[0].ds_id && (
          <div className="w-100 flex align-center justify-center">
            <DataInfoBox />
          </div>
        )}
        <div className="w-100 flex align-center justify-center mt-2">
          <GenerateButton
            className="w-100 float-right h-[46px] rounded-lg bg-[#4338F7] text-white text-[15px] font-bold font-lg leading-[47px]"
            disabled={!selectedData[0].ds_id}
            onClick={handleGenerateModel}
          >
            Generate Model
          </GenerateButton>
        </div>
        <DataEditModal />
      </div>
    </div>
  )
}

export default DataSet

const GenerateButton = styled.button`
  background-color: ${(props: any) => (props.disabled ? '#C3CADB' : '#4338f7')};
`
