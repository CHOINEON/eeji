import { atom } from 'recoil'

export interface Toast {
  id: string
  content: string
  title?: string
  type?: 'success' | 'error'
  top?: number
  duration?: number
  isClosing?: boolean
}

export const toastState = atom<Toast>({
  key: 'toastState',
})
