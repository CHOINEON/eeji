import React, { createContext, useState } from 'react'
import { ConfirmContext } from './ConfirmContext'
import Confirm from './Confirm'

//Confirm Dialog 제어, ConfirmContext 제공

type ConfirmState = {
  message: string
  onClickOK: () => void
  onClickCancel: () => void
}

const ConfirmDialog = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ConfirmState>()

  const confirm = (message?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        message: message ?? '',
        onClickOK: () => {
          setState(undefined)
          resolve(true)
        },
        onClickCancel: () => {
          setState(undefined)
          resolve(false)
        },
      })
    })
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state && <Confirm message={state.message} onClickOK={state.onClickOK} onClickCancel={state.onClickCancel} />}
    </ConfirmContext.Provider>
  )
}

export default ConfirmDialog
