import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import Dimmer from './Dimmer'

interface Props {
  message: string
  onClickOK: () => void
  onClickCancel: () => void
}

const Confirm = ({ message, onClickOK, onClickCancel }: Props) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClickCancel()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClickCancel])

  return (
    <>
      {' '}
      <Dimmer onClick={() => onClickCancel()} />
      <DialogContainer>
        <Contents>
          <Title></Title>
          <Text>{message}</Text>
          <ButtonWrapper>
            <OKButton onClick={onClickCancel}>확인</OKButton>
            {/* <button onClick={onClickOK}>ok</button> */}
          </ButtonWrapper>
        </Contents>
      </DialogContainer>
    </>
  )
}

export default Confirm

const DialogContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border: 1px solid red;
  width: 298px;
  // height: 152px;
  box-shadow: 0px 0px 10px #5951db33;
  border: 1px solid #d5dcef;
  border-radius: 25px;
  z-index: 9999;
`

// const Dimmer = styled.div`
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background-color: rgba(0, 0, 0, 0.5);
//   z-index: 999999;
// `
const Contents = styled.div`
  // border: 1px solid red;
  width: 100%;
  height: 100%;
  padding: 5%;
`

const Title = styled.div`
  font-family: 'Helvetica Bold';
  font-size: 23px;
  color: #002d65;
  text-align: center;
  margin-bottom: 5%;
`

const Text = styled.div`
  font-family: 'Helvetica Neue';
  font-size: 13px;
  color: #002d65;
  min-height: 50px;
  text-align: center;
`

const ButtonWrapper = styled.div`
  width: 100%;
  height: 35px;
  text-align: center;
`

const OKButton = styled.button`
  width: 80%;
  height: 100%;
  background-color: #4338f7;
  border-radius: 10px;
  color: white;
  font-family: 'Helvetica Neue';
  font-size: 15px;
  font-weight: bold;
`
