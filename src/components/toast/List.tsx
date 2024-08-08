import styled from '@emotion/styled'
import { useRecoilValue } from 'recoil'
import { toastState } from 'views/AIModelGenerator/store/global/toast'
import ToastItem from './Item/ToastItem'

const ToastList = () => {
  const toasts = useRecoilValue(toastState)

  return (
    <>
      <StToastList>
        {toasts.map((toast: any, i: number) => (
          <ToastItem key={i} id={toast.id} title={toast.title} top={100} {...toast} />
        ))}
      </StToastList>
    </>
  )
}

export default ToastList

const StToastList = styled.div`
  width: 300px;
  height: auto;
  top: 65px;
  right: 0px;
  padding-top: 20px;
  position: fixed;
  z-index: 1000;
`
