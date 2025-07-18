import { useToast } from 'hooks/useToast'
import { useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { Toast } from 'views/AIModelGenerator/store/global/toast'
import ToastContent from './ToastContent'

function ToastItem(props: Toast) {
  const { removeToast } = useToast()
  const { content, top, duration, id, type, title } = props
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (isClosing) {
      setTimeout(() => {
        removeToast(id)
      }, duration ?? 1000) //animation(1s)
    }
  }, [isClosing])

  return (
    <StToastItem id={id} top={top} $isclosing={isClosing.toString()}>
      <ToastContent title={title} type={type} content={content} onClose={() => setIsClosing(true)} />
    </StToastItem>
  )
}

export default ToastItem

// isclosing을 소문자로 작성(커스텀 속성)
// isclosing을 bool이 아닌 string 으로 전달 (isclosing을 DOM의 속성으로 반영)
const StToastItem = styled.div<{ top?: number; $isclosing?: string }>`
  ${({ $isclosing }) =>
    $isclosing === 'true' &&
    css`
      animation: ${slideOutUp} 1s forwards;
    `}
`

const slideOutUp = keyframes`
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
    opacity: 0;
  }
`
