import { createContext } from 'react'

type Type = {
  confirm: (messages?: string) => Promise<boolean>
}

export const ConfirmContext = createContext<Type>({
  confirm: () => new Promise((_, reject) => reject()), //초기화 하지 않으면 사용 불가 처리
})
