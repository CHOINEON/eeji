import { atom, selectorFamily } from 'recoil'
import { IConstraint } from 'views/AIModelGenerator/components/Table/CustomTable'
import { selectModelState } from '../userOption/atom'

export interface IAnalysisResult {
  [key: number | string]: number | string
}

export const analysisResponseAtom = atom({
  key: 'analysisResponse',
  default: [],
})

export const filteredResultState = selectorFamily({
  key: 'filteredResultState',
  get:
    (param: string) =>
    ({ get }) => {
      const modelIdx = get(selectModelState)
      const result: Array<IAnalysisResult> = []

      // console.log('current atom:', get(analysisResponseAtom))
      if (param) {
        if (param.length > 0) result.push(get(analysisResponseAtom)[modelIdx][param])
        else result.push(get(analysisResponseAtom)[modelIdx])

        // console.log('filteredResultState result:', result)
        return result
      }
    },
})

export const filterWithConstraint = selectorFamily({
  key: 'filterWithConstraint',
  get:
    (param: any) =>
    ({ get }) => {
      const modelIdx = get(selectModelState)

      // 초기값 세팅(atom에 저장된 값)
      let selectedData = get(analysisResponseAtom)[modelIdx][param[0]?.data]
      // console.log('selectedData:', selectedData) //{data: 'row_data', filterKey: '실제', selectedValue: 4}

      console.log('param:', param)
      if (!param || param.length === 0) {
        console.log('param 0일때  return :', selectedData)
        return selectedData
      } else {
        param.map((item: any, idx: number) => {
          const key = item.filterKey
          const value = item.filterValue
          console.log('key:', key)
          console.log('value:', value)

          // if (value) {
          selectedData = Object.values(selectedData).filter((el: any) => el[key] === value)
          console.log('selectedData:', selectedData)
          // }
          // else {
          //   //value === undefined ? clearFilter 새로운 값 다시 가져오기
          //   selectedData = get(analysisResponseAtom)[modelIdx][param[0]?.data]
          // }
        })
        return selectedData
      }
    },
})
