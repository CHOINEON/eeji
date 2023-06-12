import React from 'react'
import styled from '@emotion/styled'
import { Select, Modal } from 'antd'
import './style/style.css'

// import * as 태그함수 from '../../../hmid_config/grid/function/태그데이터함수'
// import DataConnection from '../data/data_connection_list'

import { useRecoilState, useRecoilValue } from 'recoil'
import * as RecoilAtoms from '../../../hmid_config/recoil/config/atoms'

const DataListWrap = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
`

export const WidgetModal: React.FC = () => {
  const [showDataConnectionModal, setShowDataConnectionModal] = useRecoilState(RecoilAtoms.ShowConnectionDataState)
  const [TagInfo, setSelectTagInfo] = useRecoilState(RecoilAtoms.SelectTagInfoState)
  const [TagListArr, setTagListArr] = useRecoilState(RecoilAtoms.TagListArrState)
  const TagListByTagData = useRecoilValue(RecoilAtoms.TagListByTagDataState)

  //rendering시 함수 호출
  React.useEffect(() => {
    CreateTagListItems(TagListByTagData)
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
    setSelectTagInfo(value)
  }

  return (
    <>
      <Modal
        title="Modal"
        open={showDataConnectionModal}
        onOk={() => {
          setShowDataConnectionModal(false)
          setSelectTagInfo([])
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
            options={TagListArr}
            value={TagInfo}
          />
        </DataListWrap>
      </Modal>
    </>
  )
}

export default WidgetModal
