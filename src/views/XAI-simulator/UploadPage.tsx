import styled from '@emotion/styled'
import { Button } from 'antd'
import { ConfirmContext } from 'components/dialogs/ConfirmContext'
import Progressbar from 'components/progressbar/Progressbar'
import useModal from 'hooks/useModal'
import React, { useContext } from 'react'

const UploadPage = () => {
  const { confirm } = useContext(ConfirmContext)
  const { openModal, closeModal } = useModal()
  const handleClick = (type: string) => {
    openModal({
      modalTitle: 'Model Import',
      modalType: type,
      modalProps: {
        onClick: () => {
          closeModal()
        },
      },
    })
  }

  const handleDialogOpen = async () => {
    const result = await confirm('Are you sure?')
    // console.log('handleDialogOpenresult:', result)
  }

  return (
    <>
      <UploadContainer>
        <TextMain>시작하기</TextMain>
        <TextSub>분석을 위해 데이터를 업로드하세요.</TextSub>
        <div style={{ width: '100%', textAlign: 'center', marginTop: 32, flexDirection: 'row' }}>
          <UploadButton onClick={() => handleClick('CustomModelImport')}>사용자 생성 모델</UploadButton>
          <UploadButton onClick={() => handleClick('SavedModelImport')}>INFINITE OPTIMAL MODEL</UploadButton>
          <Button type="text" onClick={handleDialogOpen}>
            Dialog Test
          </Button>
        </div>
        <div>
          <Progressbar currentValue={60} maxValue={100} />
        </div>
      </UploadContainer>
    </>
  )
}

export default UploadPage

interface Container {
  width?: any
  height?: any
  minHeight?: any
  position?: string
}

const UploadContainer = styled.div`
  // border: 1px solid red;
  position: absolute;
  width: 100%;
  height: 400px;
  padding: 100px 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
`

const TextMain = styled.p`
  font: sans-serif;
  color: #002d65;
  font-size: 25px;
  text-align: center;
`

const TextSub = styled.p`
  font: sans-serif;
  color: #002d65;
  font-size: 13px;
  text-align: center;
`

const Container = styled.div`
  width: 100%;
  height: 35vw;
  margin-top: 2vw;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`

const RoundedBox = styled.div<Container>`
  margin-right: 0.5vw;
  background-color: #fff;
  box-shadow: 0px 5px 10px #4338f733;
  border-radius: 20px;
  padding: 2vw;
  width: ${(props) => (props.width ? props.width : 'auto')};
  height: ${(props) => (props.height ? props.height : 'auto')};
  min-height: ${(props) => (props.minHeight ? props.minHeight : 'auto')};
  position: ${(props) => (props.position ? props.position : 'relative')};
`

const UploadButton = styled.button`
  background-color: #4338f7;
  width: 230px;
  height: 46px;
  border-radius: 10px;
  color: #fff;
  font-family: 'Helvetica Neue';
  font-weight: Bold;
  font-size: 17px;
  margin-left: 20px;
`
