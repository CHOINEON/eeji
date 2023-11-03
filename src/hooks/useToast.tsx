import { useRecoilState } from 'recoil'
import { toastState } from 'views/DataAnalysis/store/global/toast'

export const useToast = () => {
  const [toasts, setToasts] = useRecoilState(toastState)

  const removeToast = (content: string) => setToasts({ content: content, isClosing: true })
  const fireToast = (content: string) => {
    setToasts({ content: content, isClosing: true })
    setTimeout(() => removeToast(content), 60000)
    setTimeout(() => setToasts({ content: '', isClosing: false }), 60000)
  }

  return { toasts, fireToast }
}
