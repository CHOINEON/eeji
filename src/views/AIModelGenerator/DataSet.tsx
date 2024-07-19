import styled from '@emotion/styled'
import { useEffect } from 'react'
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil'
import DatasetList from './DatasetList'
import DataEditModal from './components/DataInfo/DataEditModal'
import DataInfoBox from './components/DataInfo/DataInfoBox'
import { selectedDataState, userInfoState } from './store/dataset/atom'
import { stepCountStore } from './store/global/atom'
import { analysisResponseAtom } from './store/response/atoms'
import './style/data-analysis-style.css'

const DataSet = () => {
  const selectedData = useRecoilState(selectedDataState)
  const setActiveStep = useSetRecoilState(stepCountStore)
  const setUserInfo = useSetRecoilState(userInfoState)
  const resetAnalysisResponse = useResetRecoilState(analysisResponseAtom)

  useEffect(() => {
    //데이터셋 페이지 나갔다 오면 초기화
    resetAnalysisResponse()
    setUserInfo({ user_id: localStorage.getItem('userId'), com_id: localStorage.getItem('companyId') })
  }, [])

  return (
    <div className="h-[80vh] p-10 border-r-2">
      <p className="font-['Helvetica Neue'] font-bold text-[23px] text-[#002D65] ">Dataset</p>
      <div className="h-[93vh]">
        <div className="text-center w-100 float-left"></div>
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
        <div className="w-100 flex align-center justify-center">
          <GenerateButton
            className="w-100 mx-[10px] h-[46px] rounded-lg bg-[#4338F7] text-white text-[15px] font-bold font-lg leading-[47px]"
            disabled={!selectedData[0].ds_id}
            onClick={() => setActiveStep(1)}
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
