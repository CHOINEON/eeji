import { atom, selector, selectorFamily } from 'recoil'
import { selectModelState } from '../userOption/atom'

interface IAnalysisResponse {
  error: any
  feature_data: Array<any>
  input: Array<any>
  key: string
  pred_data: any
}

interface IregressionResult {
  [key: number]: IAnalysisResponse
}

export const analysisResponseAtom = atom({
  key: 'analysisResponse',
  default: [],
})

export const filteredResultState = selectorFamily({
  key: 'filteredResultState',
  get:
    (param: string) =>
    ({ get }: any) => {
      const modelIdx = get(selectModelState)
      const result: Array<IregressionResult> = []

      if (param) {
        if (param.length > 0) result.push(get(analysisResponseAtom)[modelIdx][param])
        else result.push(get(analysisResponseAtom)[modelIdx])

        console.log('filteredResultState result:', result)
        return result
      }
    },
})
