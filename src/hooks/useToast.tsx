import { useRecoilState } from 'recoil'
import { Toast, toastState } from 'views/AIModelGenerator/store/global/toast'

export const useToast = () => {
  const [toasts, setToasts] = useRecoilState(toastState)

  const removeToast = (toastID: Toast['id']) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastID))
  }

  const fireToast = (toast: Toast) => {
    setToasts((prev) => [...prev, { ...toast }])
  }

  return { toasts, fireToast, removeToast }
}
