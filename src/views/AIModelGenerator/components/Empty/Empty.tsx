import { Button } from 'antd'
import React from 'react'
import empty_db from 'assets/img/icons/empty_db.png'
import styled from 'styled-components'
import { CustomButton } from '../DataInfo/DataImportModal'
import useModal from 'hooks/useModal'

const Empty = () => {
  const { openModal, closeModal } = useModal()

  const handleClick = () => {
    openModal({
      modalTitle: 'Data Upload',
      modalType: 'DataImport',
      modalProps: {
        onClick: () => {
          closeModal()
        },
      },
    })
  }

  return (
    <div style={{ height: '81vh', paddingTop: '15%' }}>
      <img src={empty_db} style={{ display: 'inline-block', marginBottom: 20 }} />
      <MainText>업로드된 데이터가 없습니다.</MainText>
      <SubText>분석을 위해 데이터를 업로드하세요.</SubText>
      <CustomButton
        visible={true}
        style={{ width: 200, height: 40, margin: '20px auto', fontSize: 15, fontWeight: 'bold' }}
        onClick={handleClick}
      >
        Data Upload
      </CustomButton>
    </div>
  )
}

export default Empty

const MainText = styled.p`
  font-family: '본고딕';
  font-weight: bold;
  color: #002d65;
  font-size: 20px;
`
const SubText = styled.p`
  font-family: '본고딕';
  color: #002d65;
  font-size: 13px;
`
