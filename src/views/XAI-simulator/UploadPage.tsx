import styled from '@emotion/styled'
import { ConfirmContext } from 'components/dialogs/ConfirmContext'
import useModal from 'hooks/useModal'
import React, { useContext } from 'react'
import CardButton from './components/button/CardButton'
import IconServerUpload from 'assets/img/icons/XAI/upload_b_io.png'
import IconCustomerUpload from 'assets/img/icons/XAI/upload_b_user.png'
import ProgressbarSimple from 'components/progressbar/ProgressbarSimple'

const UploadPage = () => {
  const { confirm } = useContext(ConfirmContext)
  const { openModal, closeModal } = useModal()

  const buttonItems = [
    {
      title: 'INFINITE OPTIMAL',
      description: 'INFINITE OPTIMAL에서 모델 데이터를 가져옵니다.',
      icon: IconServerUpload,
      handleClick: () => handleClick('SavedModelImport'),
    },
    {
      title: 'USER',
      description: '사용자의 PC에 저장된 모델 데이터를 가져옵니다.',
      icon: IconCustomerUpload,
      handleClick: () => handleClick('UserModelImport'),
    },
  ]

  function handleClick(type: string) {
    // message.info('3월 11일부터 서비스 예정입니다')
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
        <div style={{ width: '100%', textAlign: 'center', marginTop: 32, flexDirection: 'row' }}>
          <IconContainer>
            {buttonItems.map((item: any, index: number) => (
              <CardButton item={item} key={index} />
            ))}
          </IconContainer>
        </div>
        <div
          style={{
            display: 'block',
            textAlign: 'center',
            marginTop: '100px',
          }}
        >
          {/* <Button type="text" onClick={handleDialogOpen}>
            Dialog Test
          </Button> */}
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

// const Overlay = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   z-index: 2;
//   width: 100%;
//   height: 100%;
//   background: rgba(0, 0, 0, 0.7);
//   opacity: 0;
//   visibility: hidden;
//   transition: 0.3s linear;
// `

const UploadContainer = styled.div`
  // border: 1px solid red;
  position: absolute;
  width: 100%;
  height: 400px;
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

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
`
