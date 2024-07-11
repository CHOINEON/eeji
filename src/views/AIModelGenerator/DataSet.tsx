import { Empty, Spin } from 'antd'
import useGetDatasets from 'hooks/queries/useGetDatasets'
import { useEffect, useState } from 'react'
import { useResetRecoilState, useSetRecoilState } from 'recoil'
import DataEditModal from './components/DataInfo/DataEditModal'
import DescriptionBox from './components/DataInfo/DescriptionBox'
import { selectedDataState, userInfoState } from './store/dataset/atom'
import { analysisResponseAtom } from './store/response/atoms'
import { usedVariableStore } from './store/variable/atom'
import './style/data-analysis-style.css'

const DataSet = () => {
  const [loading, setLoading] = useState(false)

  const setUserInfo = useSetRecoilState(userInfoState)
  const setSelectedData = useSetRecoilState(selectedDataState)
  const setUsedVariable = useSetRecoilState(usedVariableStore)

  const resetAnalysisResponse = useResetRecoilState(analysisResponseAtom)

  const { data } = useGetDatasets(localStorage.getItem('userId'))

  useEffect(() => {
    //데이터셋 페이지 나갔다 오면 초기화
    resetAnalysisResponse()
    setUserInfo({ user_id: localStorage.getItem('userId'), com_id: localStorage.getItem('companyId') })
  }, [])

  useEffect(() => {
    if (data) setLoading(false)
    else setLoading(true)
  }, [data])

  const handleSelect = (data: any) => {
    setUsedVariable([])
    setSelectedData({
      ds_id: data.ds_id,
      name: data.name,
      size: data.size,
      rowCount: 0,
      colCount: 0,
      startDate: data.start_date,
      endDate: data.end_date,
      dateCol: data.date_col,
      targetY: data.target_y,
      numeric_cols: data.numeric_cols,
      non_numeric_cols: data.non_numeric_cols,
      isClassification: data.is_classification,
    })
  }

  return (
    <>
      {/* 배포를 위해 숨김처리 */
      /* <ModelList />  */}
      <div>
        {data?.data.length > 0 ? (
          <Spin tip="데이터셋 로드 중..." spinning={loading} style={{ marginTop: '100px', backgroundColor: 'red' }}>
            {data?.data.map((data: any, index: number) => (
              <DescriptionBox key={index} data={data} onSelect={handleSelect} />
            ))}
          </Spin>
        ) : (
          !loading && <Empty />
        )}
      </div>
      <DataEditModal />
    </>
  )
}

export default DataSet
