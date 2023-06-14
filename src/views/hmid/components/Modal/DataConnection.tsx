import React from 'react'
import styled from '@emotion/styled'
import { Select, Modal } from 'antd'
import './style/style.css'

// import * as 태그함수 from '../../../hmid_config/grid/function/태그데이터함수'
// import DataConnection from '../data/data_connection_list'

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import * as RecoilAtoms from '../../../hmid_config/recoil/config/atoms'

const DataListWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`

export const WidgetModal: React.FC = () => {
  const [showDataConnectionModal, setShowDataConnectionModal] = useRecoilState(RecoilAtoms.ShowConnectionDataState)

  //Tag에서 선택한 데이터 Array
  const setSelectTagInfo = useSetRecoilState(RecoilAtoms.SelectTagInfoState)
  //Ant에 맞춘 TagList Array
  const setTagListArr = useSetRecoilState(RecoilAtoms.TagListArrState)
  //상위에서 넘어온 API TagDataList
  const TagListByTagData = useRecoilValue(RecoilAtoms.TagListByTagDataState)

  const [changeTagData, setChangeTagData] = React.useState<any>([])

  //rendering시 함수 호출
  React.useEffect(() => {
    //CreateTagListItems(TagListByTagData)
  }, [])

  const CreateTagListItems = (TagData: any) => {
    const Arr: any = []
    let Obj: any = new Object()

    for (let i = 0, len = TagData.length; i < len; i++) {
      Obj.value = TagData[i].name
      Obj.label = TagData[i].name
      Arr.push(Obj)
      Obj = new Object()
    }

    setTagListArr(Arr)
  }

  const handleTagChange = (value: any | any[]) => {
    console.log(value)
    setChangeTagData(value)
    // setSelectTagInfo(value)
  }

  return (
    <>
      <Modal
        title="Modal"
        open={showDataConnectionModal}
        onOk={() => {
          setShowDataConnectionModal(false)
          setSelectTagInfo(changeTagData)
          setChangeTagData([])
        }}
        onCancel={() => {
          setShowDataConnectionModal(false)
        }}
        okText="Connect"
        cancelText="Cancel"
      >
        <DataListWrap>
          <div>Tag</div>
          <Select
            mode="tags"
            size={'large'}
            placeholder={'Tag Select'}
            onChange={handleTagChange}
            style={{ width: '100%' }}
            // options={TagListArr}
            options={[
              { value: 'TestData1', label: '테스트 데이터1' },
              // { value: 'TestData2', label: '테스트 데이터2' },
            ]}
            value={changeTagData}
          />
        </DataListWrap>
      </Modal>
    </>
  )
}

export default WidgetModal
