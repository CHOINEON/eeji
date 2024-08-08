import styled from '@emotion/styled'
import caution_icon from 'assets/img/icons/main/caution_square.svg'
import icon_01_b from 'assets/img/icons/main/icon_01_b.png'

function ToastContent({ title, onClose, type, content }: any) {
  return (
    <>
      <ToastContainer type={type}>
        <img
          src={type === 'success' ? icon_01_b : caution_icon}
          className="w-[64px] h-[44px] my-[18px] mx-[10px] float-left"
        />
        <div className="inline w-[174px] float-left">
          <ToastTitle>{title}</ToastTitle>
          <button
            onClick={onClose}
            className="w-[16px] h-[16px] color-[#002D65] bg-[#fff] border-[#002D65] rounded-full text-[12px] leading-[12px] m-[10px] float-right"
          >
            X
          </button>
          <ToastText>{content}</ToastText>
        </div>
      </ToastContainer>
    </>
  )
}

export default ToastContent

const ToastContainer = styled.div<{ type?: string }>`
  border-radius: 20px;
  width: 260px;
  height: 75px;
  background-color: ${({ type }) => (type === 'success' ? '#002d65' : '#FF3D50')};
  box-shadow: 5px 5px 10px #00000033;
  margin-bottom: 10px;
`

const ToastTitle = styled.span`
  letter-spacing: 0.4px;
  font-family: 'ITC Avant Garde Gothic Pro';
  font-weight: bolder;
  color: white;
  float: left;
  margin-top: 16px;
  font-size: 15px;
`

const ToastText = styled.p`
  float: left;
  color: white;
  text-align: center;
  font-size: 13px;
`
