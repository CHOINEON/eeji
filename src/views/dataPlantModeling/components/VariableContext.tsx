import React, { createContext, Dispatch, useContext, useEffect, useReducer } from 'react'
import initialState from './TagTree/initialState'
import TagSelectReducer from './TagTree/reducer'

type State = {
  targetTag: []
  explanatoryTag: []
}

type Action = { type: 'TARGET_VARIABLE'; payload: Array<any> } | { type: 'EXPLANATORY_VARIABLE'; payload: Array<any> }

// 디스패치를 위한 타입 (Dispatch 를 리액트에서 불러올 수 있음), 액션들의 타입을 Dispatch 의 Generics로 설정
type VariableDispatch = Dispatch<Action>

const VariableStateContext = createContext<State | null>(null)
const VariableDispatchContext = createContext<VariableDispatch | null>(null)

export function VariableProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(TagSelectReducer, initialState)

  //   useEffect(() => {
  //     console.log('VariableProvider state:', state)
  //   }, [state])

  return (
    <VariableStateContext.Provider value={state}>
      <VariableDispatchContext.Provider value={dispatch}>{children}</VariableDispatchContext.Provider>
    </VariableStateContext.Provider>
  )
}

// // state 와 dispatch 를 쉽게 사용하기 위한 커스텀 Hooks
// export function useSampleState() {
//   const state = useContext(VariableStateContext)
//   if (!state) throw new Error('Cannot find SampleProvider') // 유효하지 않을땐 에러를 발생
//   return state
// }

// export function useSampleDispatch() {
//   const dispatch = useContext(VariableDispatchContext)
//   if (!dispatch) throw new Error('Cannot find SampleProvider') // 유효하지 않을땐 에러를 발생
//   return dispatch
// }
